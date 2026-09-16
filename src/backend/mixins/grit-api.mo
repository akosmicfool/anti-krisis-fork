import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import GritLib "../lib/grit";
import AllowlistLib "../lib/allowlist";
import GritTypes "../types/grit";
import VerifyLib "../lib/verification";
import FeeConfig "../lib/fee-config";
import PriceOracle "../lib/price-oracle";
import Float "mo:core/Float";
import Debug "mo:core/Debug";
import Timer "mo:core/Timer";
import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import TribeLib "../lib/tribe";
import Error "mo:core/Error";
import FeeAmount "../lib/fee-amount";
import ClaimIdentity "../lib/claim-identity";
import Nat "mo:core/Nat";

mixin (
  gritState : GritLib.State,
  allowlistState : AllowlistLib.State,
  admin : AllowlistLib.AdminState,
  gate : AllowlistLib.GateState,
  priceCache : Map.Map<Text, Float>,
  tribeState : TribeLib.State,
  fee : FeeConfig.FeeState,
) {
  /// kVCM (KlimaDAO tokenized carbon) is retired on-chain via the KlimaDAO
  /// Retirement Aggregator (retireCreditViaKlima), which emits a CarbonRetired
  /// event rather than a plain ERC-20 transfer-to-dead-address. Its burn claims
  /// must be verified against the retirement receipt instead of the standard
  /// ERC-20 burn flow.
  func KVCM_ADDRESS() : Text { "0x00fbac94fec8d4089d3fe979f39454f48c71a65d" };

  func isKvcm(tokenAddress : Text) : Bool {
    tokenAddress.toLower() == KVCM_ADDRESS()
  };

  /// Dispatch burn verification: kVCM burns are confirmed via the KlimaDAO
  /// retirement receipt; all other tokens use the standard ERC-20 burn flow.
  func verifyBurn(jsonResponse : Text, tokenAddress : Text, chain : Text) : VerifyLib.VerificationResult {
    if (isKvcm(tokenAddress)) {
      VerifyLib.parseRetirementResponse(jsonResponse, tokenAddress, chain)
    } else {
      VerifyLib.parseRpcResponse(jsonResponse, tokenAddress, chain)
    }
  };

  /// HTTP transform for burn-verification RPC responses.
  public query func transformResponse(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    { input.response with headers = [] }
  };

  /// HTTP transform for price oracle responses (DexScreener).
  public query func transformPriceResponse(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    PriceOracle.transformPriceResponse(input);
  };

  /// Internal helper: verify a fee tx hash on-chain and return the receipt JSON.
  /// Returns #ok(receiptJson) for confirmed success, #err("PENDING") for
  /// not-yet-mined, #err("TX_FAILED") for revert. The receipt is needed by
  /// verifyFeeBinding for the FeeCollector `FeePaid` event check (Option B).
  func verifyFeeTxWithReceipt(feeTxHash : Text, chain : Text) : async { #ok : Text; #err : Text } {
    let rpcUrlOpt = VerifyLib.rpcUrlForChain(chain);
    let rpcUrlsRaw = switch (rpcUrlOpt) { case null { return #err("Unsupported chain") }; case (?u) { u } };
    let rpcUrlList : [Text] = rpcUrlsRaw.split(#char '|').toArray();
    let body = VerifyLib.buildRpcRequestBody(feeTxHash);

    var response : Text = "";
    var gotValidResponse = false;
    var i = 0;
    while (i < rpcUrlList.size() and not gotValidResponse) {
      var candidate : Text = "";
      try {
        candidate := await OutCall.httpPostRequest(
          rpcUrlList[i],
          [{ name = "Content-Type"; value = "application/json" }],
          body,
          transformResponse
        );
        // A top-level JSON-RPC "error" (rate limit, overload, gateway) means
        // THIS RPC failed — skip to the next fallback URL instead of treating
        // it as a terminal PENDING. A legitimately-mined receipt never carries
        // an "error" key; result:null is the only not-yet-mined signal.
        // 2026-09-11 guard: a blocked/rate-limited endpoint returns non-JSON
        // junk (HTTP 403 HTML, literal "Too Many Requests" 429 text) that
        // carries NEITHER marker — accepting it as a "valid response" produced
        // garbage classification downstream. Require a JSON-RPC shape marker,
        // same rule fetchTxByHash has used since the 2026-08-28 llamarpc
        // outage.
        if (not candidate.contains(#text "\"error\"")
            and (candidate.contains(#text "\"jsonrpc\"") or candidate.contains(#text "\"result\""))) {
          response := candidate;
          gotValidResponse := true;
        };
      } catch (_) {};
      i += 1;
    };
    if (not gotValidResponse) { return #err("PENDING") };

    // We only care about tx status (success/fail/pending) — not log contents.
    // The receipt is RETURNED so callers can additionally inspect logs
    // (FeeCollector FeePaid event) without a second outcall.
    // Reuse parseRpcResponse with a dummy token address; the status check runs first
    // and returns before log parsing for confirmed/failed txs.
    // For a native transfer there are no ERC-20 logs, so parseRpcResponse will return
    // #err("No ERC-20 Transfer log found ...") for a successful native tx.
    // We intercept that: if status was 0x1 (success), treat it as #ok.
    let arr = response.toArray();
    if (response.contains(#text "\"error\"")) { return #err("PENDING") };
    // Check result:null → pending
    let needle1 = "\"result\":null";
    let needle2 = "\"result\": null";
    if (response.contains(#text needle1) or response.contains(#text needle2)) {
      return #err("PENDING");
    };
    // Parse status field via parseRpcResponse; for a successful native transfer
    // it will fail at log-parsing stage — catch that specifically
    let probeResult = VerifyLib.parseRpcResponse(response, "0x0000000000000000000000000000000000000000", chain);
    switch (probeResult) {
      case (#err("PENDING"))   { #err("PENDING") };
      case (#err("TX_FAILED")) { #err("TX_FAILED") };
      case (#ok(_))            { #ok(response) };
      // Any other error after the status check means the tx succeeded (native transfer has no ERC-20 logs)
      case (#err(_))           {
        // Re-examine raw status to confirm it was actually 0x1
        if (response.contains(#text "\"status\":\"0x1\"") or
            response.contains(#text "\"status\": \"0x1\"") or
            response.contains(#text "\"status\":1") or
            response.contains(#text "\"status\": 1") or
            response.contains(#text "\"status\":true") or
            response.contains(#text "\"status\": true")) {
          #ok(response)
        } else {
          #err("PENDING")
        }
      };
    };
  };

  // ── AKK-10: native-token (fee currency) price lookup ──────────────────────
  // The platform fee is paid in the chain's NATIVE token (ETH on ethereum/
  // base/optimism, CELO on celo), while the claim's USD value is priced by
  // the token oracle. To verify the paid fee covers feePercent × usdValue we
  // need the native token's USD price. DexScreener exposes canonical
  // wrapped-native ERC-20s (WETH / CELO) — same oracle, same parser, no new
  // trust. Keyed by chain; a chain without a verified wrapped-native address
  // yields null → the amount check is SKIPPED for that chain (logged, never
  // fails a claim) rather than guessing an address.
  func nativeWrappedAddress(chain : Text) : ?Text {
    switch (chain.toLower()) {
      case ("ethereum") ?"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
      case ("base") ?"0x4200000000000000000000000000000000000006"; // WETH
      case ("optimism") ?"0x4200000000000000000000000000000000000006"; // WETH
      // CELO ERC-20 (native CELO as ERC-20) — user-verified 2026-09-03
      case ("celo") ?"0x471EcE3750Da237f93B8E339c536989b8978a438";
      case _ null;
    };
  };

  func fetchNativePrice(chain : Text) : async ?Float {
    let wrapped = switch (nativeWrappedAddress(chain)) {
      case null { return null };
      case (?w) w;
    };
    let result = try {
      await PriceOracle.fetchTokenPrice(wrapped, chain, priceCache, transformPriceResponse);
    } catch (_) { #err("network error") };
    switch (result) {
      case (#ok(p)) ?p;
      case (#err(_)) null;
    };
  };

  /// AKK-10 + AKK-8: verify the platform-fee tx exists, succeeded, AND binds the
  /// burn to the claimant — and (Option B armed) that the FeePaid event's `value`
  /// actually covers feePercent × the claim's oracle-priced USD value.
  /// Binding rules (all from public chain data):
  ///   - fee tx status == success                      (receipt check)
  ///   - fee tx recipient == configured fee wallet     (anti fee-wallet spoofing)
  ///   - fee tx sender == burn tx sender               (same wallet did both)
  ///   - fee tx calldata == (claimant principal, burn tx hash)
  ///     → one fee tx can satisfy exactly one claim by exactly one user
  ///       (single-use: the payload names that specific burn tx hash)
  ///   - Option B (when armed via admin panel): the fee receipt must carry a
  ///     `FeePaid` event emitted BY the FeeCollector contract with the fee
  ///     sender as payer — defeats address-squatting on chains where the
  ///     collector is not yet deployed.
  ///   - AKK-10: paid value ≥ ceil(feePercent × usdValue) × (1 − 7% tolerance).
  ///     The tolerance mirrors the frontend-price deviation gate: the fee is
  ///     sized on the frontend price, we check against the oracle price, so an
  ///     honest fee may sit below the oracle-computed ideal by up to that band.
  ///     The amount check runs ONLY when the FeePaid check is armed AND a
  ///     native price is available (celo currently skips — no verified ERC-20
  ///     CELO address); undecodable/missing event data stays PENDING (transient,
  ///     never fraud) per the recovery model. Zero usdValue (oracle returned no
  ///     price) or feePercent = 0 auto-pass — the amount check never blocks a
  ///     claim the rest of the pipeline would credit.
  func verifyFeeBinding(
    feeTxHash : Text,
    burnTxHash : Text,
    chain : Text,
    claimant : Principal,
    usdValue : ?Float,
    // W1B Bug-2 fix: the on-chain burn owner from the burn receipt's
    // Transfer log (captured at claim verification). When present, the fee
    // sender may match EITHER the burn tx.from (direct sends) OR this
    // owner (relayed kVCM burns, where burnTx.from = the embedded-wallet
    // relayer). Null keeps the strict tx.from rule — never a silent bypass.
    burnOwner : ?Text,
  ) : async { #ok; #err : Text } {
    // 1. status check + receipt fetch (single outcall — the receipt is reused
    //    for the FeePaid event check when the collector gate is armed)
    let statusResult = await verifyFeeTxWithReceipt(feeTxHash, chain);
    let feeReceipt = switch (statusResult) {
      case (#err(e)) { return #err(e) };
      case (#ok(r)) { r };
    };
    // 1b. W1B Bug-2: resolve the burn owner LAZILY — only fetched if the
    //     strict sender check (feeTx.from == burnTx.from) is about to fail.
    //     The caller may supply the owner (from the claim-verification
    //     receipt, threaded through from initiateClaim/recheckClaim);
    //     otherwise it's resolved below after both txs are fetched, so
    //     direct-burn cycles cost zero extra outcalls. Failure leaves null
    //     so the strict tx.from rule applies (fail closed).
    var burnOwnerResolved : ?Text = switch (burnOwner) {
      case (?o) { if (o.size() > 0) { ?o } else { null } };
      case null { null };
    };
    // 5+6 first: Option B FeePaid event check + AKK-10 value decode — ONE
    //      receipt scan, done BEFORE the binding check (and before the tx
    //      fetch — a relayed fee's event is the only evidence of collector
    //      receipt, since tx.to names the forwarder). Payer-vs-tx.from and
    //      sender-vs-burn-sender are enforced after the tx fetch below.
    //      Armed only when the admin enabled the check AND configured the
    //      collector address. PENDING is the correct retriable outcome when
    //      the event is missing (a successful fee tx to the collector ALWAYS
    //      carries it — a missing event means a stale/partial RPC receipt).
    //      #unparseable (log present, data unreadable) is also PENDING —
    //      transient, never fraud, per the recovery model.
    var paidValueWei : ?Nat = null;
    var eventBindingHex : ?Text = null;
    if (fee.requireFeePaidEvent) {
      let collector = fee.collectorAddress;
      if (collector.size() == 0) {
        return #err("BINDING_FAIL: FeePaid check armed but collector address not configured");
      };
      switch (VerifyLib.feePaidLogValue(feeReceipt, collector, "")) {
        case (#found(r)) {
          paidValueWei := ?r.valueWei;
          eventBindingHex := r.bindingHex;
        };
        case (#unparseable) { return #err("PENDING") };
        case (#missing) { return #err("PENDING") };
      };
    };
    // 2-4. fetch both txs, validate payer identity, and run the binding
    //      comparison (relay-tolerant when the collector event is in hand:
    //      the event attests receipt + carries the binding bytes; a relayed
    //      payment's tx-level `to`/`input` name the forwarder, not the
    //      collector).
    // W1B LATENCY: the two tx fetches (fee + burn) run CONCURRENTLY —
    // Motoko starts both async calls before awaiting either, so the wall
    // clock is one outcall (~1–3 s) instead of two (~2–6 s). Same for the
    // FeePaid-event receipt scan, which was already done above (its result
    // is reused — no extra call).
    let feeTxPromise = VerifyLib.fetchTxByHash(feeTxHash, chain, transformResponse);
    let burnTxPromise = VerifyLib.fetchTxByHash(burnTxHash, chain, transformResponse);
    let feeTxResult = await feeTxPromise;
    let feeTx = switch (feeTxResult) {
      case (#err("PENDING")) { return #err("PENDING") };
      case (#err(e)) { return #err(e) };
      case (#ok(tx)) { tx };
    };
    // The matched event's payer must be the fee tx's actual sender (the scan
    // above accepts any payer; this binds the event to THIS tx's sender).
    if (fee.requireFeePaidEvent) {
      switch (VerifyLib.feePaidPayerMatches(feeReceipt, fee.collectorAddress, feeTx.from)) {
        case true {};
        case false { return #err("PENDING") }; // stale/mismatched receipt — retriable
      };
    };
    let burnTxResult = await burnTxPromise;
    let burnTx = switch (burnTxResult) {
      case (#err("PENDING")) { return #err("PENDING") };
      case (#err(e)) { return #err("BINDING_FAIL: cannot fetch burn tx: " # e) };
      case (#ok(tx)) { tx };
    };
    let expectedRecipient = switch (admin.feeRecipient) {
      case null { return #err("BINDING_FAIL: fee recipient not configured") };
      case (?r) { r };
    };
    // 1b. W1B Bug-2 (lazy): the strict sender check is about to run — if
    //     feeTx.from != burnTx.from and no owner was supplied, fetch the
    //     burn RECEIPT now and parse the Transfer log's sender (the real
    //     burn owner for relayed burns). Direct burns never pay this
    //     outcall; mismatched senders without a provable owner fail closed.
    if (burnOwnerResolved == null and feeTx.from != burnTx.from) {
      let burnRcpt = await verifyFeeTxWithReceipt(burnTxHash, chain);
      burnOwnerResolved := switch (burnRcpt) {
        case (#err(_)) { null };
        case (#ok(json)) { VerifyLib.parseBurnOwnerFromReceipt(json) };
      };
    };
    let bindingResult = VerifyLib.verifyFeeBinding(
      feeTx,
      burnTx,
      expectedRecipient,
      claimant.toText(),
      burnTxHash,
      eventBindingHex,
      burnOwnerResolved,
    );
    switch (bindingResult) {
      case (#err(e)) { return #err(e) };
      case (#ok) {};
    };
    // AKK-10: the paid amount must cover feePercent × usdValue (oracle-priced).
    // Runs only when the event check is armed (paidValueWei is authoritative
    // there), the native price is available, and both fee% and usdValue are
    // known-nonzero — a failed native lookup or an unknown value SKIPS the
    // check (logged) rather than blocking a claim the rest of the pipeline
    // would credit. Tolerance mirrors the frontend-price deviation gate.
    // AKK-10 + W4 review fix (F1): the paid amount must cover feePercent ×
    // usdValue (oracle-priced). The decision lives in FeeAmount.amountCheckFloor
    // → a floor is returned whenever a fee is actually due, and the caller
    // compares `paid < floor` UNCONDITIONALLY — including paid == 0.
    //
    // The bug this closes: the guard used to read
    //   if (requireFeePaidEvent and paid > 0 and usd > 0.0)
    // so a ZERO-value call to the collector (whose fallback() emits
    // FeePaid(..., msg.value) with no minimum, and whose event value decodes
    // to ?0) skipped the check entirely and still credited full GRIT — the
    // whole platform fee was evadable at gas cost. 1 wei was rejected, 0 was
    // free. Now every positive floor rejects 0.
    //
    // Remaining fail-open cases (deliberate, documented): an unknown claim
    // value (usd ≤ 0) and an unavailable native price — both SKIP rather than
    // block a claim the rest of the pipeline would credit.
    switch (paidValueWei, usdValue) {
      case (?paid, ?usd) {
        if (fee.requireFeePaidEvent and usd > 0.0) {
          let nativePrice = await fetchNativePrice(chain);
          switch (nativePrice) {
            case null {
              Debug.print("[grit-api] AKK-10 amount check skipped (no native price for " # chain # ")");
            };
            case (?np) {
              let feeBps = FeeAmount.feeBpsFromPercent(admin.feePercent);
              switch (FeeAmount.amountCheckFloor(usd, feeBps, np, FeeAmount.DEFAULT_TOLERANCE_BPS)) {
                case null {
                  // No fee is due (feeBps = 0) or the price is unusable — nothing to enforce.
                };
                case (?minWei) {
                  if (paid < minWei) {
                    let paidNative = Float.fromInt(paid) / 1e18;
                    let minNative = Float.fromInt(minWei) / 1e18;
                    return #err("BINDING_FAIL: fee underpaid — paid " # paidNative.toText() # " native, required ≥ " # minNative.toText());
                  };
                };
              };
            };
          };
        };
      };
      case _ {};
    };
    #ok
  };

  /// User: submit a burn tx hash for GRIT issuance.
  /// Stores claim as #pending, triggers async HTTP outcall to verify burn,
  /// on success checks the fee tx; if fee is still pending/failed transitions to #pendingFee.
  /// frontendPrice: live price (USD) fetched by the frontend at burn time. AKK-3: NEVER used
  /// to price the claim (attacker-controlled when the oracle fails — fail closed instead);
  /// retained solely as a cross-check source — deviations >6.9% vs the oracle are rejected.
  public shared ({ caller }) func initiateClaim(
    txHash        : Text,
    feeTxHash     : Text,
    chain         : Text,
    tokenAddress  : Text,
    frontendPrice : Float
  ) : async { #ok; #err : Text } {
    // W1A: canonical transaction identity — every spelling of the same
    // on-chain tx (0x/no prefix, any casing) resolves to ONE claim. Strict
    // validation happens HERE, before any duplicate check or outcall.
    let canTxHash = switch (ClaimIdentity.canonicalTxHash(txHash)) {
      case (#ok(c)) { c };
      case (#err(e)) { return #err("INVALID_TX_HASH: " # e) };
    };
    let canFeeHash = switch (ClaimIdentity.canonicalOptionalFeeHash(feeTxHash)) {
      case (#ok(c)) { c };
      case (#err(e)) { return #err("INVALID_FEE_TX_HASH: " # e) };
    };
    // Canonical values replace the raw inputs for the rest of the flow.
    let txHashCanon = canTxHash;
    let feeTxHashCanon = canFeeHash;
    // Normalise token address to lowercase for all comparisons
    let normToken = tokenAddress.toLower();

    // --- Launch-time gate ---
    // Block burns until the configured launch timestamp has been reached.
    if (gate.launchTimeEnabled) {
      // Time.now() returns nanoseconds; launchTime is stored as milliseconds → convert to ns
      let launchTimeNs : Int = gate.launchTime * 1_000_000;
      if (Time.now() < launchTimeNs) {
        return #err("LAUNCH_NOT_STARTED");
      };
    };

    // --- NFT gate ---
    // When enabled the frontend is expected to have verified ownership before submitting;
    // the backend enforces the gate flag here. Full on-chain NFT verification is done by
    // the frontend via direct Ethereum RPC — the backend stores the gate flag as the
    // authoritative toggle and rejects claims when it is on.
    // NOTE: A future upgrade can replace this with a backend EVM-RPC ownership check
    // once ICP HTTP outcalls to NFT contract `ownerOf` are wired in.
    if (gate.nftGateEnabled) {
      // Check if the caller has passed NFT verification.
      // The claim record includes nftVerified (set by the frontend flow);
      // until full on-chain verification is added, the gate blocks all claims
      // when enabled and there is no verified NFT flag in the submission.
      // The frontend is responsible for gating the UI; the backend blocks as a hard stop.
      return #err("NFT_GATE_BLOCKED");
    };

    // Duplicate guard — with retry semantics:
    // A #failed record credited nothing and previously bricked the burn's
    // txHash forever (users re-burned real value after a transient pricing
    // failure). The original claimant may resurrect it with a fresh fee tx;
    // any other duplicate stays rejected (AKK-2 protection intact).
    var resurrected = false;
    // W4/F4: set when the caller adopted an existing squatted claim (no store needed)
    var adopted = false;
    if (GritLib.isDuplicateClaim(gritState, txHashCanon)) {
      // W4/F4: BEFORE considering this a duplicate, let a different caller adopt
      // an uncredited claim — this is the relief for claim squatting (see
      // GritLib.adoptUncreditedClaim). It cannot hand anyone GRIT: the adopter
      // still has to pass the same fee-binding proof, which only the burn's own
      // wallet can produce. Without this, a squatter who submitted the burn hash
      // first locked the genuine burner out forever.
      if (GritLib.adoptUncreditedClaim(gritState, txHashCanon, caller)) {
        adopted := true;
      } else if (not GritLib.resurrectFailedClaim(gritState, txHashCanon, caller, feeTxHashCanon, Time.now())) {
        return #err("already claimed");
      } else {
        resurrected := true;
      };
    };

    // Verify the token is on the allowlist
    let tokenOpt = AllowlistLib.findToken(allowlistState, normToken, chain);
    switch (tokenOpt) {
      case null { return #err("Token is not on the allowlist") };
      case (?_) {};
    };

    // Fetch token info for the pending record
    let tokenInfo = switch (AllowlistLib.findToken(allowlistState, normToken, chain)) {
      case null { Runtime.trap("Token disappeared after allowlist check") };
      case (?t) { t };
    };

    // Store pending claim — SKIPPED when an existing #failed record was just
    // resurrected in place above: appending would duplicate the txHash (the
    // background recheck would verify it twice and burn stats would
    // double-count it). The resurrected record is already #pending.
    if (not resurrected and not adopted) {
      let pendingRecord : GritTypes.ClaimRecord = {
        txHash = txHashCanon;
        feeTxHash     = ?feeTxHashCanon;
        tokenAddress  = normToken;
        chain;
        tokenSymbol   = tokenInfo.symbol;
        tokenDecimals = tokenInfo.decimals;
        amountBurned  = 0.0;
        usdValue      = 0.0;
        gritMinted    = 0;
        status        = #pending;
        timestamp     = Time.now();
        claimant      = caller;
      };
      GritLib.storePendingClaim(gritState, pendingRecord);
    };

    // Trigger async verification
    let rpcUrlOpt = VerifyLib.rpcUrlForChain(chain);
    switch (rpcUrlOpt) {
      case null {
        GritLib.updateClaimStatus(gritState, txHashCanon, #failed, 0, null, null, null, null);
        return #err("Unsupported chain: " # chain);
      };
      case (?rpcUrlsRaw) {
        let body = VerifyLib.buildRpcRequestBody(txHashCanon);

        // Split pipe-delimited fallback URLs (e.g. Ethereum has 3 fallbacks)
        let rpcUrlList : [Text] = rpcUrlsRaw.split(#char '|').toArray();

        // Retry up to 5 times across all available RPC endpoints.
        // parseRpcResponse returns #err("PENDING") when the tx is not yet indexed —
        // that is the only retriable error; all other errors fail the claim immediately.
        var jsonResponse : Text = "";
        var rpcCallSucceeded = false;
        var attempt = 0;
        var urlIdx = 0;

        label retryLoop while (attempt <= 5) {
          // Yield between retries to give the RPC time to index.
          if (attempt > 0) {
            await async {};
          };

          // Round-robin across available endpoints
          let currentUrl = if (urlIdx < rpcUrlList.size()) rpcUrlList[urlIdx] else rpcUrlList[0];

          var response : Text = "";
          var httpFailed = false;
          try {
            response := await OutCall.httpPostRequest(
              currentUrl,
              [{ name = "Content-Type"; value = "application/json" }],
              body,
              transformResponse
            );
          } catch (_) {
            httpFailed := true;
          };

          if (httpFailed) {
            // Endpoint failed — try next URL before giving up
            if (urlIdx + 1 < rpcUrlList.size()) {
              urlIdx += 1;
              attempt += 1;
            } else {
              GritLib.updateClaimStatus(gritState, txHashCanon, #failed, 0, null, null, null, null);
              return #err("HTTP outcall failed");
            };
          } else {
            // Use verifyBurn to determine if the tx is pending or done
            let probeResult = verifyBurn(response, normToken, chain);
            switch (probeResult) {
              case (#err("PENDING")) {
                // Not indexed yet — retry up to 5 times, cycling to next endpoint
                if (attempt < 5) {
                  let numUrls = if (rpcUrlList.size() > 0) rpcUrlList.size() else 1;
                  urlIdx := (urlIdx + 1) % numUrls;
                  attempt += 1;
                } else {
                  // Still pending after all retries — leave claim as #pending for background re-check
                  rpcCallSucceeded := false;
                  attempt := 6; // exit loop
                };
              };
              case (_) {
                // Got a definitive response (success or non-pending error)
                jsonResponse := response;
                rpcCallSucceeded := true;
                attempt := 6; // break
              };
            };
          };
        };

        if (not rpcCallSucceeded) {
          // Transaction is still pending — keep the claim as #pending and return ok
          // so the frontend knows we accepted it; background timer will re-check
          return #ok;
        };

        let verifyResult = verifyBurn(jsonResponse, normToken, chain);
        switch (verifyResult) {
          case (#err("PENDING")) {
            // Transaction not yet mined — leave as #pending; background timer will re-check
            #ok;
          };
          case (#err("TX_FAILED")) {
            // Explicit on-chain revert — this is a definitive failure.
            GritLib.updateClaimStatus(gritState, txHashCanon, #failed, 0, null, null, null, null);
            #err("Verification failed: transaction was reverted on-chain");
          };
          case (#err(_reason)) {
            // Any other error is transient (RPC issue, malformed response, etc.).
            // Leave the claim as #pending — the background 60-second timer will retry.
            #ok;
          };
          case (#ok({ amountBurned = rawAmountBurned; burnOwner })) {
            let token = switch (AllowlistLib.findToken(allowlistState, normToken, chain)) {
              case null { Runtime.trap("Token disappeared from allowlist during claim") };
              case (?t) { t };
            };

            // Convert raw wei-like amount to human-readable Float (preserves fractions like 0.01)
            // Debug: log the runtime decimals so we can verify axlREGEN uses 6 not 18
            Debug.print("[grit-api] token=" # token.symbol # " decimals=" # debug_show(token.decimals) # " rawAmountBurned=" # debug_show(rawAmountBurned));
            var divisor : Nat = 1;
            var dd = token.decimals;
            while (dd > 0) { divisor *= 10; dd -= 1 };
            let humanAmount : Float = rawAmountBurned.toFloat() / divisor.toFloat();
            Debug.print("[grit-api] humanAmount=" # debug_show(humanAmount) # " divisor=" # debug_show(divisor));

            // Fetch real-time price from DexScreener (sole source of truth for GRIT crediting).
            // Cross-check against frontendPrice: reject if deviation > 6.9%.
            // AKK-3: on oracle failure we FAIL CLOSED — the claim stays #pending and the
            // background timer retries the price fetch (aged out after 35 min if the
            // oracle never recovers). The frontend-supplied price is never used to mint.
            let backendPriceResult = try {
              await PriceOracle.fetchTokenPrice(normToken, chain, priceCache, transformPriceResponse);
            } catch (_) {
              #err("Price unavailable — network error. Please try again later.")
            };
            let effectivePrice = switch (backendPriceResult) {
              case (#ok(backendPrice)) {
                // Backend fetch succeeded — cross-check against frontendPrice if one was supplied
                if (frontendPrice > 0.0) {
                  let diff = backendPrice - frontendPrice;
                  let absDiff = if (diff >= 0.0) diff else -diff;
                  let deviation = absDiff / backendPrice;
                  if (deviation > 0.069) {
                    // NOT terminal (was: #failed, which bricked the burn's
                    // txHash and demanded a real re-burn). Leave the claim
                    // #pending so the background recheck re-prices with a
                    // settled oracle price and credits when both sources
                    // agree. AKK-3's fail-closed posture is unchanged: the
                    // frontend price is never used to mint, and no credit
                    // happens while prices disagree. Bounded by the 35-min
                    // pending age-out. STILL_PROCESSING is a stable contract
                    // token — the frontend keeps the modal in a processing
                    // state (step 3 spinner) and polls until settlement,
                    // instead of showing a terminal failure for a claim
                    // that is about to credit.
                    return #err("STILL_PROCESSING: GRIT credit is being finalized — no action needed.");
                  };
                };
                backendPrice
              };
              case (#err(_reason)) {
                // AKK-3: fail closed — never price a claim from caller-supplied data.
                // The claim stays #pending; the background recheck timer retries the
                // price fetch and credits GRIT when a real oracle price is reachable
                // (claims still pending after 35 min age out as #failed).
                return #ok;
              };
            };

            // Update amountBurned and usdValue in the stored record first
            let usdValueAtVerification : Float = humanAmount * effectivePrice;
            // W1A: metadata now commits atomically inside updateClaimStatus
            // (no separate mapInPlace — a standalone write could interleave
            // with a concurrent completion and rewrite a verified receipt).

            // W1B UX fix (claim-first flow): an EMPTY fee hash means the
            // user has not paid the fee yet (deferred-fee path). This is NOT
            // a failure and MUST NOT touch the fee state: verify the burn
            // only and leave the claim #pending with no fee hash. The user
            // completes it via Pay Fee (retryFeeClaim handles a #pending
            // claim with no fee hash); the background timer skips the fee
            // half for fee-less claims. Previously this path ran an RPC for
            // the empty hash, transitioned the claim to #pendingFee storing
            // ?"" — a broken state that made the frontend skip the wallet
            // popup and sit forever at "confirm fee" (draft v326 report).
            if (feeTxHashCanon.size() == 0) {
              GritLib.updateClaimStatus(
                gritState,
                txHashCanon,
                #pending,
                0,
                null,
                ?humanAmount,
                ?usdValueAtVerification,
                null,
              );
              // Deferred-fee submission SUCCEEDED: claim created, burn
              // verified, fee to follow. Return #ok (NOT #err(FEE_PENDING) —
              // that contract means "a fee tx was sent and is confirming",
              // which made the frontend enter its fee-watching poll loop
              // instead of showing the wallet popup — the user's "jumps to
              // confirm fee without approval" symptom on draft v327).
              return #ok;
            };

            // Now verify the fee transaction AND its binding before crediting GRIT
            let feeResult = await verifyFeeBinding(feeTxHashCanon, txHashCanon, chain, caller, ?usdValueAtVerification, burnOwner);
            switch (feeResult) {
              case (#err("TX_FAILED")) {
                // Fee tx reverted on-chain — ask user to retry fee payment
                GritLib.updateClaimToPendingFee(gritState, txHashCanon, feeTxHashCanon);
                return #err("FEE_PENDING");
              };
              case (#err("PENDING")) {
                // Fee not yet confirmed — transition to #pendingFee so user can retry
                GritLib.updateClaimToPendingFee(gritState, txHashCanon, feeTxHashCanon);
                return #err("FEE_PENDING");
              };
              case (#err(bindingMsg)) {
                // AKK-4 binding failure at initial claim. Same transient-vs-
                // structural rule as the recheck paths: RPC artifacts
                // (missing fields, empty/unparseable responses) are NOT
                // terminal — transition to #pendingFee is wrong here too;
                // keep the claim #pending so the background recheck and the
                // user's Retry Claim can re-verify. Only structural
                // mismatches fail the claim outright.
                let isTransient =
                  bindingMsg.contains(#text "missing")
                  or bindingMsg.contains(#text "cannot fetch")
                  or bindingMsg.contains(#text "not found")
                  or bindingMsg.contains(#text "carries no binding payload");
                if (isTransient) {
                  Debug.print("[grit-api] initiateClaim transient binding error (kept pending): " # bindingMsg);
                  return #ok;
                };
                GritLib.updateClaimStatus(gritState, txHashCanon, #failed, 0, null, null, null, null);
                return #err(bindingMsg);
              };
              case (#ok) {
                // Fee confirmed — credit GRIT and mark verified
                let gritAmount = GritLib.calcGrit(rawAmountBurned, token.decimals, effectivePrice, admin.gritIssuanceRate);
                GritLib.updateClaimStatus(gritState, txHashCanon, #verified, gritAmount, null, ?humanAmount, ?usdValueAtVerification, null);
                #ok;
              };
            };
          };
        };
      };
    };
  };

  /// Internal: re-check a single pending claim. Used by the background timer.
  /// Attempts one RPC call per available endpoint; if still pending, leaves claim unchanged.
  /// Marks #failed only on explicit on-chain failure (TX_FAILED) or >30 min age.
  func recheckClaim(record : GritTypes.ClaimRecord) : async () {
    let rpcUrlOpt = VerifyLib.rpcUrlForChain(record.chain);
    let rpcUrlsRaw = switch (rpcUrlOpt) { case null { return }; case (?u) { u } };
    let rpcUrlList : [Text] = rpcUrlsRaw.split(#char '|').toArray();
    let body = VerifyLib.buildRpcRequestBody(record.txHash);

    // Try each endpoint with up to 2 attempts before moving to the next
    var response : Text = "";
    var gotResponse = false;
    var i = 0;
    while (i < rpcUrlList.size() and not gotResponse) {
      var innerAttempt = 0;
      while (innerAttempt < 2 and not gotResponse) {
        try {
          response := await OutCall.httpPostRequest(
            rpcUrlList[i],
            [{ name = "Content-Type"; value = "application/json" }],
            body,
            transformResponse
          );
          gotResponse := true;
        } catch (_) {
          innerAttempt += 1;
          if (innerAttempt >= 2) {
            i += 1;
          };
        };
      };
    };

    if (not gotResponse) { return }; // network error — try again next cycle

    let result = verifyBurn(response, record.tokenAddress, record.chain);
    switch (result) {
      case (#err("PENDING")) {
        // Transient (RPC noise, not-yet-indexed tx). NEVER age out to
        // #failed: the user's manual Retry Claim path re-runs this exact
        // verification on demand, and per the no-expiry policy claims stay
        // in history forever. Leaving #pending keeps the free background
        // recheck going as long as the claim exists.
      };
      case (#err("TX_FAILED")) {
        GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null, null, null, null);
      };
      case (#err(_)) {
        // Any other error (malformed response, unrecognised status, etc.) is
        // treated as transient — leave the claim as #pending so the next
        // timer cycle will retry. NO age-out: per the no-expiry policy the
        // claim stays #pending (background rechecks continue) and the user
        // can always force a fresh verification via Retry Claim.
      };
      case (#ok({ amountBurned = rawAmountBurned; burnOwner })) {
        let tokenOpt = AllowlistLib.findToken(allowlistState, record.tokenAddress, record.chain);
        let token = switch (tokenOpt) { case null { return }; case (?t) { t } };

        var divisor : Nat = 1;
        var dd = token.decimals;
        while (dd > 0) { divisor *= 10; dd -= 1 };
        let humanAmount : Float = rawAmountBurned.toFloat() / divisor.toFloat();

        let priceResult = try {
          await PriceOracle.fetchTokenPrice(record.tokenAddress, record.chain, priceCache, transformPriceResponse);
        } catch (_) {
          #err("Price unavailable — network error. Please try again later.")
        };
        // If price unavailable, leave claim as #pending so the next timer cycle will retry
        let effectivePrice = switch (priceResult) {
          case (#ok(p)) { p };
          case (#err(_)) {
            // Price temporarily unavailable — leave as #pending for retry on next cycle
            return;
          };
        };
        let gritAmount = GritLib.calcGrit(rawAmountBurned, token.decimals, effectivePrice, admin.gritIssuanceRate);

        // W1A: amountBurned + usdValue commit atomically in the final
        // updateClaimStatus below (was a separate mapInPlace here).
        let usdValueRecheckBurn : Float = humanAmount * effectivePrice;

        // AKK-4: verify fee tx binding before crediting GRIT. The legacy
        // empty-hash bypass (credit without any fee tx) is removed — fail closed.
        // W1B UX fix (claim-first): an empty/null fee hash means the fee has
        // NOT been paid yet (deferred-fee claim) — that is a WAITING state,
        // not a failure. Leave the claim #pending so the user can Pay Fee
        // from Burn History; do NOT age it out to #failed. (The old code
        // failed these claims, killing any claim whose fee wasn't paid
        // within the first timer tick.)
        let feeTxHash = switch (record.feeTxHash) {
          case null { "" };
          case (?h) { h };
        };
        if (feeTxHash == "") {
          // Waiting for the fee — keep #pending, nothing to verify yet.
          // BUG FIX (2026-09-11, live incident): this early return previously
          // DISCARDED the freshly-verified burn data — amountBurned stayed 0
          // forever on every claim whose burn settled via the timer while
          // fee-less. When the user then paid the fee, retryFeeClaim computed
          // GRIT from amountBurned × divisor = 0 and credited ZERO GRIT (the
          // "definitely not 0 but shows 0" report). Commit the verified
          // amount atomically NOW, exactly like initiateClaim's inline path:
          // the burn IS verified, its data must survive until the fee arrives.
          GritLib.updateClaimStatus(
            gritState,
            record.txHash,
            #pending,
            0,
            null,
            ?humanAmount,
            ?usdValueRecheckBurn,
            null,
          );
          return;
        } else {
          // AKK-10 amount check uses the STORED claim-time usdValue (the value
          // the fee was actually sized against) — NOT usdValueRecheckBurn.
          // This path auto-reprices the claim to the CURRENT oracle price for
          // the GRIT credit, but the fee was paid at claim-time prices; using
          // the repriced value would fail honest claims after a >7% price rise
          // during the pending window (same class as the AKK-4b drift bug).
          let feeResult = await verifyFeeBinding(feeTxHash, record.txHash, record.chain, record.claimant, ?record.usdValue, burnOwner);
          switch (feeResult) {
            case (#err("TX_FAILED")) {
              // Fee tx definitively failed — ask user to retry
              GritLib.updateClaimToPendingFee(gritState, record.txHash, feeTxHash);
            };
            case (#err("PENDING")) {
              // Fee still pending — transition to #pendingFee
              GritLib.updateClaimToPendingFee(gritState, record.txHash, feeTxHash);
            };
            case (#err(bindingMsg)) {
              // Binding failure during recheckClaim. Same transient-vs-
              // structural rule as recheckFeeClaim: RPC artifacts (missing
              // fields, unparseable/empty responses) must NOT terminally
              // fail a claim whose on-chain data is healthy — leave #pending
              // so the next cycle retries.
              let isTransient =
                bindingMsg.contains(#text "missing")
                or bindingMsg.contains(#text "cannot fetch")
                or bindingMsg.contains(#text "not found")
                or bindingMsg.contains(#text "carries no binding payload");
              if (isTransient) {
                Debug.print("[grit-api] recheckClaim transient binding error (kept pending): " # bindingMsg);
              } else {
                GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null, null, null, null);
                Debug.print("[grit-api] recheckClaim binding fail: " # bindingMsg);
              };
            };
            case (#ok) {
              // Both burn and fee confirmed AND bound — credit GRIT
              GritLib.updateClaimStatus(gritState, record.txHash, #verified, gritAmount, null, ?humanAmount, ?usdValueRecheckBurn, null);
            };
          };
        };
      };
    };
  };

  /// Internal: collect all #pending claims and re-check each one.
  /// Called by the recurring timer every 15 seconds.
  /// Adaptive polling: faster retries for younger claims.
  /// Internal: re-check a single #pendingFee claim. Verifies the stored feeTxHash on-chain.
  /// If confirmed, credits GRIT. If definitively failed, transitions back to #pendingFee (no change).
  /// If still pending, leaves claim unchanged for the next timer cycle.
  /// Verify a claim's burn tx on-chain and return the human-readable amount.
  /// Shared by recheckClaim and recheckFeeClaim's amt==0 recovery (2026-09-11):
  /// same receipt fetch + verifyBurn + decimals scaling, without the fee side.
  func recheckBurnAmount(record : GritTypes.ClaimRecord) : async { #ok : Float; #err : Text } {
    let rpcUrlOpt = VerifyLib.rpcUrlForChain(record.chain);
    let rpcUrlsRaw = switch (rpcUrlOpt) { case null { return #err("PENDING") }; case (?u) { u } };
    let rpcUrlList : [Text] = rpcUrlsRaw.split(#char '|').toArray();
    let body = VerifyLib.buildRpcRequestBody(record.txHash);
    var response : Text = "";
    var gotResponse = false;
    var i = 0;
    while (i < rpcUrlList.size() and not gotResponse) {
      var innerAttempt = 0;
      while (innerAttempt < 2 and not gotResponse) {
        try {
          response := await OutCall.httpPostRequest(
            rpcUrlList[i],
            [{ name = "Content-Type"; value = "application/json" }],
            body,
            transformResponse,
          );
          gotResponse := true;
        } catch (_) {
          innerAttempt += 1;
          if (innerAttempt >= 2) { i += 1 };
        };
      };
    };
    if (not gotResponse) { return #err("PENDING") };
    switch (verifyBurn(response, record.tokenAddress, record.chain)) {
      case (#err("TX_FAILED")) { #err("TX_FAILED") };
      case (#err(_)) { #err("PENDING") };
      case (#ok({ amountBurned = rawAmountBurned; burnOwner = _ })) {
        let tokenOpt = AllowlistLib.findToken(allowlistState, record.tokenAddress, record.chain);
        let token = switch (tokenOpt) { case null { return #err("PENDING") }; case (?t) { t } };
        var divisor : Nat = 1;
        var dd = token.decimals;
        while (dd > 0) { divisor *= 10; dd -= 1 };
        #ok(rawAmountBurned.toFloat() / divisor.toFloat());
      };
    };
  };

  func recheckFeeClaim(record : GritTypes.ClaimRecord) : async () {
    let feeTxHash = switch (record.feeTxHash) {
      case null { return }; // no fee tx hash stored — nothing to check
      case (?h) { h };
    };
    // W1B UX fix (claim-first): an empty stored hash is the deferred-fee
    // sentinel (claim is #pendingFee with no fee yet) — same as null, never
    // run an RPC for it.
    if (feeTxHash.size() == 0) { return };

    // BUG FIX (2026-09-11, second pass): a #pendingFee claim with
    // amountBurned == 0 means the burn NEVER verified (fee paid via Pay Fee
    // before the burn settled — the RPC outage let users reach the fee step
    // first). The FIRST version of this fix computed feeResult from the
    // stale zero usdValue and then credited from record.amountBurned == 0 —
    // converting "stuck at pendingFee" into "#verified with 0 GRIT", which
    // is worse (verified claims are final). Correct order: re-verify the
    // burn FIRST, commit the recovered amount, and run BOTH the fee check
    // (AKK-10 now sees a real usd instead of being skipped by usd==0) and
    // the credit from the RECOVERED record.
    var rec = record;
    if (record.amountBurned <= 0.0) {
      switch (await recheckBurnAmount(record)) {
        case (#err("TX_FAILED")) {
          GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null, null, null, null);
          return;
        };
        case (#err(_)) { return }; // PENDING / transient RPC — retry next cycle
        case (#ok(humanAmount)) {
          let usdNow = switch (await PriceOracle.fetchTokenPrice(record.tokenAddress, record.chain, priceCache, transformPriceResponse)) {
            case (#ok(p)) { humanAmount * p };
            case (#err(_)) { return }; // price needed to commit + size AKK-10 — retry next cycle
          };
          GritLib.updateClaimStatus(gritState, record.txHash, #pendingFee, 0, null, ?humanAmount, ?usdNow, null);
          rec := { record with amountBurned = humanAmount; usdValue = usdNow };
        };
      };
    };
    let feeResult = await verifyFeeBinding(feeTxHash, record.txHash, record.chain, record.claimant, ?rec.usdValue, null);
    switch (feeResult) {
      case (#err("PENDING")) { return }; // pending — try again next cycle
      case (#err("TX_FAILED")) {
        // Bug-3 fix (2026-09-09): the fee tx REVERTED on-chain — the user
        // must pay a NEW fee. Clear the stored hash so the claim becomes
        // "#pendingFee with no fee" → Burn History surfaces the single
        // correct action (Pay Fee) instead of an endless "Confirming fee"
        // that never resolves. The reverted hash is dropped (it can never
        // verify); the claim itself stays alive per the no-expiry policy.
        GritLib.updateClaimToPendingFee(gritState, record.txHash, "");
      };
      case (#err(bindingMsg)) {
        // AKK-4 binding failure on a #pendingFee claim. IMPORTANT (root-cause
        // finding 2026-08-28): healthy claims were being failed here by
        // TRANSIENT RPC responses — a dead/erratic endpoint yields a
        // response with no `from` field, producing
        // "BINDING_FAIL: tx missing `from`" which this branch treated as
        // definitive. Guard: only *structural* binding failures (recipient
        // mismatch, sender mismatch, calldata mismatch) are terminal;
        // anything mentioning a missing field, an unparseable response, or
        // an empty/absent calldata payload ("carries no binding payload" —
        // fetchTxByHash now signals PENDING for those, but older error
        // strings could still surface transiently) is transient — leave
        // #pendingFee for the next cycle / the user's Retry Claim.
        let isTransient =
          bindingMsg.contains(#text "missing")
          or bindingMsg.contains(#text "cannot fetch")
          or bindingMsg.contains(#text "not found")
          or bindingMsg.contains(#text "carries no binding payload");
        if (isTransient) {
          Debug.print("[grit-api] recheckFeeClaim transient binding error (kept pendingFee): " # bindingMsg);
        } else {
          GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null, null, null, null);
          Debug.print("[grit-api] recheckFeeClaim binding fail: " # bindingMsg);
        };
      };
      case (#ok) {
        // Fee confirmed — fetch token info and price to credit GRIT
        // (from `rec` — the RECOVERED record when the burn re-verify ran,
        // so a healed amt==0 claim credits the real burn, not zero).
        let tokenOpt = AllowlistLib.findToken(allowlistState, rec.tokenAddress, rec.chain);
        let token = switch (tokenOpt) { case null { return }; case (?t) { t } };

        var divisor : Nat = 1;
        var dd = token.decimals;
        while (dd > 0) { divisor *= 10; dd -= 1 };
        let rawAmountBurned : Nat = (rec.amountBurned * divisor.toFloat()).toInt().toNat();

        let priceResult = try {
          await PriceOracle.fetchTokenPrice(rec.tokenAddress, rec.chain, priceCache, transformPriceResponse);
        } catch (_) {
          #err("Price unavailable — network error. Please try again later.")
        };
        // If price unavailable, leave claim as #pendingFee so the next timer cycle will retry
        let effectivePrice = switch (priceResult) {
          case (#ok(p)) { p };
          case (#err(_)) {
            return; // retry on next cycle
          };
        };
        let gritAmount = GritLib.calcGrit(rawAmountBurned, token.decimals, effectivePrice, admin.gritIssuanceRate);
        // W1A: usdValue at fee-confirmation time commits atomically below
        let usdValueFeeConfirm : Float = rec.amountBurned * effectivePrice;
        GritLib.updateClaimStatus(gritState, rec.txHash, #verified, gritAmount, null, null, ?usdValueFeeConfirm, null);
      };
    };
  };

  /// Internal: collect all #pending and #pendingFee claims and re-check each one.
  /// Called by the recurring timer every 15 seconds.
  public func recheckPendingClaims() : async () {
    let nowNs : Int = Time.now();
    // Adaptive polling: only attempt to recheck a claim if enough time has passed
    // since last check, based on claim age.
    //   0–3 min:   retry every 8 s
    //   3–10 min:  retry every 20 s
    //   10–30 min: retry every 45 s
    //   >30 min:   will be expired by recheckClaim itself
    let pending = gritState.claims.filter(func(r : GritTypes.ClaimRecord) : Bool {
      if (r.status != #pending) { return false };
      let ageNs : Int = nowNs - r.timestamp;
      let ageSeconds : Int = ageNs / 1_000_000_000;
      // Use lastChecked field equivalent: we approximate via timestamp + status.
      // Since we call this every 15 s, always pass claims that are due for a check.
      if (ageSeconds < 180) {
        // 0–3 min: check every 8 s → always eligible on a 15 s timer
        true
      } else if (ageSeconds < 600) {
        // 3–10 min: check every 20 s → eligible every ~2 timer ticks (use modulo on age)
        (ageSeconds / 20) % 2 == 0
      } else {
        // 10–30 min: check every 45 s → eligible every ~3 timer ticks
        (ageSeconds / 45) % 3 == 0
      }
    }).toArray();
    for (record in pending.vals()) {
      await recheckClaim(record);
    };
    let pendingFee = gritState.claims.filter(func(r : GritTypes.ClaimRecord) : Bool {
      r.status == #pendingFee
    }).toArray();
    for (record in pendingFee.vals()) {
      await recheckFeeClaim(record);
    };
  };

  /// User: get caller's current GRIT balance.
  public query ({ caller }) func getMyBalance() : async Nat {
    GritLib.getBalance(gritState, caller);
  };

  /// User: get caller's claim history (sorted by timestamp descending).
  public query ({ caller }) func getMyClaimHistory() : async [GritTypes.ClaimRecord] {
    GritLib.getClaimsByUser(gritState, caller);
  };

  /// User: retry fee payment for a claim in #pendingFee status.
  /// Verifies the new feeTxHash on-chain; if confirmed, credits GRIT and marks claim #verified.
  public shared ({ caller }) func retryFeeClaim(
    txHash    : Text,
    feeTxHash : Text
  ) : async { #ok : Nat; #err : Text } {
    // W1A: canonical identity — a retry with any spelling of the hash must
    // find the SAME stored claim and update its canonical record.
    let txHashCanon = switch (ClaimIdentity.canonicalTxHash(txHash)) {
      case (#ok(c)) { c };
      case (#err(e)) { return #err("INVALID_TX_HASH: " # e) };
    };
    let feeTxHashCanon = switch (ClaimIdentity.canonicalTxHash(feeTxHash)) {
      case (#ok(c)) { c };
      case (#err(e)) { return #err("INVALID_FEE_TX_HASH: " # e) };
    };
    // Look up the claim (canonical identity — see recheckClaimByHash)
    let claimOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool { r.txHash == txHashCanon });
    let claim = switch (claimOpt) {
      case null { return #err("Claim not found") };
      case (?c) { c };
    };

    // Caller must be the original claimant
    if (claim.claimant != caller) {
      return #err("Unauthorized: caller did not create this claim");
    };

    // Claim must be awaiting a fee: #pendingFee (fee tried and failed/still
    // confirming) or #pending with no fee hash yet (the modal's slow-burn
    // background path — Pay Fee button completes it from Burn History).
    // #pending claims WITH a fee hash are mid-verification; Retry Claim, not
    // Pay Fee, is their path.
    switch (claim.status) {
      case (#pendingFee) {};
      case (
        #pending
      ) {
        switch (claim.feeTxHash) {
          case null {}; // no fee yet — exactly the Pay Fee case
          case (?existing) {
            if (existing.size() > 0) {
              return #err("Claim is already verifying — use Retry Claim instead");
            };
          };
        };
      };
      case _ { return #err("Claim is not awaiting a fee payment") };
    };

    // AKK-10: a NEW fee (Pay Fee / Retry Fee) is sized by the frontend at the
    // CURRENT price, so the amount check must compare against the CURRENT
    // oracle-priced value — not the stored claim-time usdValue (stale after a
    // price move; would demand a fee different from the one just paid).
    // Fetch the price BEFORE the fee check so the comparator is current.
    let tokenOpt = AllowlistLib.findToken(allowlistState, claim.tokenAddress, claim.chain);
    let token = switch (tokenOpt) {
      case null { return #err("Token no longer on allowlist") };
      case (?t) { t };
    };

    // Compute raw amount from stored humanAmount
    var divisor : Nat = 1;
    var dd = token.decimals;
    while (dd > 0) { divisor *= 10; dd -= 1 };
    let rawAmountBurned : Nat = (claim.amountBurned * divisor.toFloat()).toInt().toNat();

    // Bug-1 hardening (2026-09-10): STORE THE FEE HASH FIRST — before any
    // price fetch or verification. The wallet has confirmed the fee tx; the
    // claim MUST record it before anything can fail downstream (GIV/op case:
    // a DexScreener outage threw before the old store point and the paid fee
    // was orphaned — user prompted to pay AGAIN). Storing early costs
    // nothing: if verification then succeeds, the claim goes #verified; if
    // anything fails transiently, the 15s timer re-runs with the stored hash.
    GritLib.updateClaimToPendingFee(gritState, txHashCanon, feeTxHashCanon);

    // Fetch real-time price — must be live; no fallback allowed
    let priceResult = try {
      await PriceOracle.fetchTokenPrice(claim.tokenAddress, claim.chain, priceCache, transformPriceResponse);
    } catch (_) {
      #err("Price unavailable — network error. Please try again later.")
    };
    let effectivePrice = switch (priceResult) {
      case (#ok(p)) { p };
      case (#err(reason)) {
        // Fee hash is stored + #pendingFee; the timer re-runs verification
        // (incl. the price fetch) every 15s — the claim self-heals.
        return #err(reason);
      };
    };
    // Current oracle-priced USD value — what the new fee was sized against.
    let usdValueRetry : Float = claim.amountBurned * effectivePrice;

    // AKK-4: verify the new fee tx binding too (AKK-10 amount check vs CURRENT value)
    let feeResult = await verifyFeeBinding(feeTxHashCanon, txHashCanon, claim.chain, caller, ?usdValueRetry, null);
    switch (feeResult) {
      case (#err("PENDING")) {
        // Bug-1 fix (2026-09-09): the fee tx is REAL (wallet confirmed it) —
        // RPC indexing just lags. STORE the fee hash + transition to
        // #pendingFee so the background timer verifies it within seconds.
        // The previous code returned an error WITHOUT storing the hash —
        // every slow-indexed fee was orphaned (paid on-chain, claim never
        // learned about it, user prompted to pay AGAIN). Frontend treats
        // this message as processing, not failure.
        GritLib.updateClaimToPendingFee(gritState, txHashCanon, feeTxHashCanon);
        return #err("Fee transaction not yet confirmed");
      };
      case (#err("TX_FAILED")) {
        return #err("Fee transaction failed on-chain");
      };
      case (#err(bindingMsg)) {
        // Claim stays #pendingFee — user can retry with a correctly bound fee tx
        return #err(bindingMsg);
      };
      case (#ok) {
        // Fee confirmed — new fee hash + usdValue + credit commit atomically below
        let gritAmount = GritLib.calcGrit(rawAmountBurned, token.decimals, effectivePrice, admin.gritIssuanceRate);
        GritLib.updateClaimStatus(gritState, txHashCanon, #verified, gritAmount, null, null, ?usdValueRetry, ?feeTxHashCanon);
        #ok(gritAmount);
      };
    };
  };

  /// User: manually re-check a single claim by its burn tx hash.
  /// Useful when the background timer has not yet picked up a slow confirmation.
  /// No expiry applies: claims are never timed out (see lib/grit.mo).
  /// Caller must be the original claimant.
  public shared ({ caller }) func recheckClaimByHash(txHash : Text) : async { #ok : Text; #err : Text } {
    // W1A: canonical identity — a re-check submitted with any spelling of the
    // hash must find the SAME stored claim.
    let txHashCanon = switch (ClaimIdentity.canonicalTxHash(txHash)) {
      case (#ok(c)) { c };
      case (#err(e)) { return #err("INVALID_TX_HASH: " # e) };
    };
    // Look up the claim — must belong to this caller
    let claimOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool {
      r.txHash == txHashCanon and r.claimant == caller
    });
    let claim = switch (claimOpt) {
      case null {
        // Could be a different user's claim or simply not found — check if the hash exists at all
        let anyClaimOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool { r.txHash == txHashCanon });
        switch (anyClaimOpt) {
          case (?_) { return #err("Unauthorized") };
          case null  { return #err("Claim not found") };
        };
      };
      case (?c) { c };
    };

    switch (claim.status) {
      case (#verified) {
        #ok("Already verified — GRIT has been credited.");
      };
      case (#pendingFee) {
        #ok("Burn verified — use Retry Fee to complete GRIT crediting.");
      };
      case (#pending or #failed) {
        try {
          await recheckClaim(claim);
          // Read back the updated status
          let updatedOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool {
            r.txHash == txHashCanon
          });
          let statusText = switch (updatedOpt) {
            case null { "unknown" };
            case (?r) {
              switch (r.status) {
                case (#verified)   { "verified" };
                case (#pending)    { "pending" };
                case (#failed)     { "failed" };
                case (#pendingFee) { "pendingFee" };
              };
            };
          };
          #ok("Re-check complete — claim is now " # statusText # ".");
        } catch (e) {
          #err("Re-check failed: " # e.message());
        };
      };
    };
  };

  /// Return (tokenSymbol, totalUsdValue) for all verified burns by a specific player, summed across chains.
  public shared query func getPlayerBurnSummary(principal : Principal) : async [(Text, Float)] {
    GritLib.getPlayerBurnSummary(gritState, principal);
  };

  /// Return (tokenSymbol, totalUsdValue) for all verified burns attributed to a tribe (time-scoped by membership).
  public shared query func getTribeBurnSummary(tribeId : Text) : async [(Text, Float)] {
    GritLib.getTribeBurnSummary(gritState, tribeId, tribeState.membershipHistory);
  };

  /// Admin: get all claim records across all users.
  public shared ({ caller }) func getAllClaimHistory() : async [GritTypes.ClaimRecord] {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    GritLib.getAllClaims(gritState);
  };

  /// Admin: probe EVERY configured RPC endpoint of every chain FROM THE
  /// CANISTER and report which ones actually serve a request right now
  /// (2026-09-11 diagnostic; widened to all endpoints per owner 2026-09-12).
  ///
  /// Why this exists: endpoint re-probes from an agent's machine proved
  /// meaningless — canister subnets face different blocking (publicnode 403s,
  /// 429 rate-limit text bodies) than residential IPs, and the 2026-09-11
  /// incident (every OP/ETH claim stuck while Base/Celo verified) was only
  /// diagnosable by elimination. This turns that class into a one-call read.
  ///
  /// Method: for each chain, probe EVERY configured endpoint with a
  /// lightweight `eth_chainId` (no tx hash needed, ~every node serves it).
  /// Verified live = response parses as JSON-RPC with a result. Cost: one
  /// outcall per endpoint (~18 across 6 chains) per call — admin-only, never
  /// on the burn path. Blocked bodies are truncated to 200 chars.
  public shared ({ caller }) func probeRpcEndpoints() : async [(Text, Text)] {
    if (not AllowlistLib.isAdmin(admin, caller)) {
      Runtime.trap("Unauthorized: caller is not admin");
    };
    let chains : [Text] = ["ethereum", "optimism", "base", "celo", "arbitrum", "polygon"];
    let results = List.empty<(Text, Text)>();
    for (chain in chains.vals()) {
      switch (VerifyLib.rpcUrlForChain(chain)) {
        case null { results.add((chain, "no endpoints configured")) };
        case (?raw) {
          // Probe EVERY endpoint of the chain (owner request 2026-09-12):
          // a first-endpoint-only probe reported BLOCKED when #1 was down
          // while #2/#3 served fine — chasing ghosts while the real
          // verification was falling over successfully.
          for (ep in raw.split(#char '|').toArray().vals()) {
            let probeBody = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_chainId\",\"params\":[]}";
            try {
              let resp = await OutCall.httpPostRequest(
                ep,
                [{ name = "Content-Type"; value = "application/json" }],
                probeBody,
                transformResponse,
              );
              if (resp.contains(#text "\"result\"")) {
                results.add((chain, "OK " # ep));
              } else {
                // Truncate junk bodies (403 HTML / 429 text can be KB–MB) —
                // the diagnostic only needs the head to identify the blocker.
                var head : Text = "";
                var taken : Nat = 0;
                label take for (c in resp.chars()) {
                  if (taken >= 200) {
                    head #= "…";
                    break take;
                  };
                  head #= Text.fromChar(c);
                  taken += 1;
                };
                results.add((chain, "NON-JSON/BLOCKED " # ep # " → " # head));
              };
            } catch (e) {
              results.add((chain, "ERROR " # ep # " → " # Error.message(e)));
            };
          };
        };
      };
    };
    results.toArray();
  };
};
