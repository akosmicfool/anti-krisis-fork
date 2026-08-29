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
        if (not candidate.contains(#text "\"error\"")) {
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

  /// AKK-4 + AKK-8: verify the platform-fee tx exists, succeeded, AND binds the
  /// burn to the claimant. Binding rules (all from public chain data):
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
  func verifyFeeBinding(feeTxHash : Text, burnTxHash : Text, chain : Text, claimant : Principal) : async { #ok; #err : Text } {
    // 1. status check + receipt fetch (single outcall — the receipt is reused
    //    for the FeePaid event check when the collector gate is armed)
    let statusResult = await verifyFeeTxWithReceipt(feeTxHash, chain);
    let feeReceipt = switch (statusResult) {
      case (#err(e)) { return #err(e) };
      case (#ok(r)) { r };
    };
    // 2-4. fetch both txs and run the binding comparison
    let feeTxResult = await VerifyLib.fetchTxByHash(feeTxHash, chain, transformResponse);
    let feeTx = switch (feeTxResult) {
      case (#err("PENDING")) { return #err("PENDING") };
      case (#err(e)) { return #err(e) };
      case (#ok(tx)) { tx };
    };
    let burnTxResult = await VerifyLib.fetchTxByHash(burnTxHash, chain, transformResponse);
    let burnTx = switch (burnTxResult) {
      case (#err("PENDING")) { return #err("PENDING") };
      case (#err(e)) { return #err("BINDING_FAIL: cannot fetch burn tx: " # e) };
      case (#ok(tx)) { tx };
    };
    let expectedRecipient = switch (admin.feeRecipient) {
      case null { return #err("BINDING_FAIL: fee recipient not configured") };
      case (?r) { r };
    };
    let bindingResult = VerifyLib.verifyFeeBinding(feeTx, burnTx, expectedRecipient, claimant.toText(), burnTxHash);
    switch (bindingResult) {
      case (#err(e)) { return #err(e) };
      case (#ok) {};
    };
    // 5. Option B: FeePaid event from the FeeCollector contract.
    //    Armed only when the admin enabled the check AND configured the
    //    collector address — both set from the admin panel AFTER the collector
    //    is deployed and feeRecipient points at it. PENDING is the correct
    //    retriable outcome when the event is missing: on a collector-deployed
    //    chain a successful fee tx to the collector ALWAYS carries it, so a
    //    missing event means an RPC served a stale/partial receipt (or the
    //    tx went to a squatter address, which binding check 2 would have
    //    caught) — either way, retry or fail, never credit.
    if (fee.requireFeePaidEvent) {
      let collector = fee.collectorAddress;
      if (collector.size() == 0) {
        return #err("BINDING_FAIL: FeePaid check armed but collector address not configured");
      };
      if (not VerifyLib.feePaidLogPresent(feeReceipt, collector, feeTx.from)) {
        return #err("PENDING");
      };
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
    if (GritLib.isDuplicateClaim(gritState, txHash)) {
      if (not GritLib.resurrectFailedClaim(gritState, txHash, caller, feeTxHash, Time.now())) {
        return #err("already claimed");
      };
      resurrected := true;
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
    if (not resurrected) {
      let pendingRecord : GritTypes.ClaimRecord = {
        txHash;
        feeTxHash     = ?feeTxHash;
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
        GritLib.updateClaimStatus(gritState, txHash, #failed, 0, null);
        return #err("Unsupported chain: " # chain);
      };
      case (?rpcUrlsRaw) {
        let body = VerifyLib.buildRpcRequestBody(txHash);

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
              GritLib.updateClaimStatus(gritState, txHash, #failed, 0, null);
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
            GritLib.updateClaimStatus(gritState, txHash, #failed, 0, null);
            #err("Verification failed: transaction was reverted on-chain");
          };
          case (#err(_reason)) {
            // Any other error is transient (RPC issue, malformed response, etc.).
            // Leave the claim as #pending — the background 60-second timer will retry.
            #ok;
          };
          case (#ok({ amountBurned = rawAmountBurned })) {
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
            gritState.claims.mapInPlace(func(r : GritTypes.ClaimRecord) : GritTypes.ClaimRecord {
              if (r.txHash == txHash) { { r with amountBurned = humanAmount; usdValue = usdValueAtVerification } } else { r }
            });

            // Now verify the fee transaction AND its binding before crediting GRIT
            let feeResult = await verifyFeeBinding(feeTxHash, txHash, chain, caller);
            switch (feeResult) {
              case (#err("TX_FAILED")) {
                // Fee tx reverted on-chain — ask user to retry fee payment
                GritLib.updateClaimToPendingFee(gritState, txHash, feeTxHash);
                return #err("FEE_PENDING");
              };
              case (#err("PENDING")) {
                // Fee not yet confirmed — transition to #pendingFee so user can retry
                GritLib.updateClaimToPendingFee(gritState, txHash, feeTxHash);
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
                GritLib.updateClaimStatus(gritState, txHash, #failed, 0, null);
                return #err(bindingMsg);
              };
              case (#ok) {
                // Fee confirmed — credit GRIT and mark verified
                let gritAmount = GritLib.calcGrit(rawAmountBurned, token.decimals, effectivePrice, admin.gritIssuanceRate);
                GritLib.updateClaimStatus(gritState, txHash, #verified, gritAmount, null);
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
        GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null);
      };
      case (#err(_)) {
        // Any other error (malformed response, unrecognised status, etc.) is
        // treated as transient — leave the claim as #pending so the next
        // timer cycle will retry. NO age-out: per the no-expiry policy the
        // claim stays #pending (background rechecks continue) and the user
        // can always force a fresh verification via Retry Claim.
      };
      case (#ok({ amountBurned = rawAmountBurned })) {
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

        // set amountBurned and usdValue on the record FIRST, then verify fee and mark #verified
        let usdValueRecheckBurn : Float = humanAmount * effectivePrice;
        gritState.claims.mapInPlace(func(r : GritTypes.ClaimRecord) : GritTypes.ClaimRecord {
          if (r.txHash == record.txHash) { { r with amountBurned = humanAmount; usdValue = usdValueRecheckBurn } } else { r }
        });

        // AKK-4: verify fee tx binding before crediting GRIT. The legacy
        // empty-hash bypass (credit without any fee tx) is removed — fail closed.
        let feeTxHash = switch (record.feeTxHash) {
          case null { "" };
          case (?h) { h };
        };
        if (feeTxHash == "") {
          // No fee tx hash — cannot be bound to any wallet. Definitive failure.
          GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null);
        } else {
          let feeResult = await verifyFeeBinding(feeTxHash, record.txHash, record.chain, record.claimant);
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
                GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null);
                Debug.print("[grit-api] recheckClaim binding fail: " # bindingMsg);
              };
            };
            case (#ok) {
              // Both burn and fee confirmed AND bound — credit GRIT
              GritLib.updateClaimStatus(gritState, record.txHash, #verified, gritAmount, null);
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
  func recheckFeeClaim(record : GritTypes.ClaimRecord) : async () {
    let feeTxHash = switch (record.feeTxHash) {
      case null { return }; // no fee tx hash stored — nothing to check
      case (?h) { h };
    };

    let feeResult = await verifyFeeBinding(feeTxHash, record.txHash, record.chain, record.claimant);
    switch (feeResult) {
      case (#err("PENDING")) { return }; // pending — try again next cycle
      case (#err("TX_FAILED")) { return }; // definitively failed — user must retry fee
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
          GritLib.updateClaimStatus(gritState, record.txHash, #failed, 0, null);
          Debug.print("[grit-api] recheckFeeClaim binding fail: " # bindingMsg);
        };
      };
      case (#ok) {
        // Fee confirmed — fetch token info and price to credit GRIT
        let tokenOpt = AllowlistLib.findToken(allowlistState, record.tokenAddress, record.chain);
        let token = switch (tokenOpt) { case null { return }; case (?t) { t } };

        var divisor : Nat = 1;
        var dd = token.decimals;
        while (dd > 0) { divisor *= 10; dd -= 1 };
        let rawAmountBurned : Nat = (record.amountBurned * divisor.toFloat()).toInt().toNat();

        let priceResult = try {
          await PriceOracle.fetchTokenPrice(record.tokenAddress, record.chain, priceCache, transformPriceResponse);
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
        // Update usdValue at fee-confirmation time (price may have changed slightly)
        let usdValueFeeConfirm : Float = record.amountBurned * effectivePrice;
        gritState.claims.mapInPlace(func(r : GritTypes.ClaimRecord) : GritTypes.ClaimRecord {
          if (r.txHash == record.txHash) { { r with usdValue = usdValueFeeConfirm } } else { r }
        });
        GritLib.updateClaimStatus(gritState, record.txHash, #verified, gritAmount, null);
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
    // Look up the claim
    let claimOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool { r.txHash == txHash });
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

    // AKK-4: verify the new fee tx binding too
    let feeResult = await verifyFeeBinding(feeTxHash, txHash, claim.chain, caller);
    switch (feeResult) {
      case (#err("PENDING")) {
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
        // Fee confirmed — store new fee hash and credit GRIT
        gritState.claims.mapInPlace(func(r : GritTypes.ClaimRecord) : GritTypes.ClaimRecord {
          if (r.txHash == txHash) { { r with feeTxHash = ?feeTxHash } } else { r }
        });

        // Fetch token info for GRIT calculation
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

        // Fetch real-time price — must be live; no fallback allowed
        let priceResult = try {
          await PriceOracle.fetchTokenPrice(claim.tokenAddress, claim.chain, priceCache, transformPriceResponse);
        } catch (_) {
          #err("Price unavailable — network error. Please try again later.")
        };
        let effectivePrice = switch (priceResult) {
          case (#ok(p)) { p };
          case (#err(reason)) {
            return #err(reason);
          };
        };

        let gritAmount = GritLib.calcGrit(rawAmountBurned, token.decimals, effectivePrice, admin.gritIssuanceRate);
        // Store usdValue at retry-fee time
        let usdValueRetry : Float = claim.amountBurned * effectivePrice;
        gritState.claims.mapInPlace(func(r : GritTypes.ClaimRecord) : GritTypes.ClaimRecord {
          if (r.txHash == txHash) { { r with usdValue = usdValueRetry } } else { r }
        });
        GritLib.updateClaimStatus(gritState, txHash, #verified, gritAmount, null);
        #ok(gritAmount);
      };
    };
  };

  /// User: manually re-check a single claim by its burn tx hash.
  /// Useful when the background timer has not yet picked up a slow confirmation.
  /// Caller must be the original claimant.
  public shared ({ caller }) func recheckClaimByHash(txHash : Text) : async { #ok : Text; #err : Text } {
    // Look up the claim — must belong to this caller
    let claimOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool {
      r.txHash == txHash and r.claimant == caller
    });
    let claim = switch (claimOpt) {
      case null {
        // Could be a different user's claim or simply not found — check if the hash exists at all
        let anyClaimOpt = gritState.claims.find(func(r : GritTypes.ClaimRecord) : Bool { r.txHash == txHash });
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
            r.txHash == txHash
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
};
