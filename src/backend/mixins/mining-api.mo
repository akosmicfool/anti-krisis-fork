import MiningLib "../lib/mining";
import MiningTypes "../types/mining";
import GritLib "../lib/grit";
import AllowlistLib "../lib/allowlist";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import AkkLedgerTypes "../types/akk-ledger";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import Time "mo:core/Time";
import Utils "../lib/utils";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import LedgerMint "../lib/ledger-mint";
import VerifyLib "../lib/verification";
import FeeConfig "../lib/fee-config";
import OutCall "mo:caffeineai-http-outcalls/outcall";





mixin (
  state : MiningLib.State,
  gritState : GritLib.State,
  adminState : AllowlistLib.AdminState,
  allowlistState : AllowlistLib.State,
  gate : AllowlistLib.GateState,
  fee : FeeConfig.FeeState,
  getSelfPrincipal : () -> ?Principal,
  // Cross-mixin callbacks (passed from main.mo, where the GritMixin splice is
  // already in scope): on-chain fee-tx verification + the HTTP transform for
  // eth_getTransactionByHash. Mixins are separate compilation units, so the
  // mining mixin reaches the claim-side RPC helpers through these — the same
  // pattern as getSelfPrincipal.
  verifyFeeWithReceipt : (Text, Text) -> async { #ok : Text; #err : Text },
  transformFn : shared query OutCall.TransformationInput -> async OutCall.TransformationOutput,
) {
  // The mining canister's own principal — passed in from main.mo's selfPrincipal.
  // Traps if selfPrincipal is not yet initialised.
  func miningCanisterPrincipal() : Principal {
    switch (getSelfPrincipal()) {
      case (?p) {
        if (p.isAnonymous()) {
          Runtime.trap("selfPrincipal not initialized");
        };
        p;
      };
      case null {
        Runtime.trap("selfPrincipal not initialized");
      };
    };
  };
  // Bridge the GritLib.State balances map to the simple get/set interface Mining lib expects
  func gritProxy() : { get : (Principal) -> ?Nat; set : (Principal, Nat) -> () } {
    {
      get = func(p : Principal) : ?Nat { gritState.balances.get(p) };
      set = func(p : Principal, v : Nat) { gritState.balances.add(p, v) };
    };
  };

  /// Create a new miner; deducts gritAmount from caller's GRIT balance.
  ///
  /// Miner-creation fee gate (miner-creation-fee-plan): when a fee is
  /// configured for `feeChain` (decision 1: fee 0 / unset = FREE), the caller
  /// must present a paid fee tx to the fee wallet — a FeeCollector payment
  /// whose calldata binds (caller principal, "MINE"). Single-use: one fee tx
  /// creates exactly one miner (consumed-fee map, W1A-canonical keys).
  ///
  /// Ordering (reentrancy): ALL awaits (RPC verification) run BEFORE any
  /// state change. The tail — replay check → GRIT debit → miner insert →
  /// consume — is await-free, so concurrent calls cannot interleave between
  /// the replay check and the consume (no double-spend window). Consume
  /// happens only on a successful create: a failed validation never burns
  /// the caller's payment.
  public shared ({ caller }) func createMiner(
    name : Text,
    gritAmount : Nat,
    rate : Nat,
    feeChain : ?Text,
    feeTxHash : ?Text,
  ) : async { #ok : MiningTypes.MinerId; #err : Text } {
    // --- Launch-time gate ---
    // Block miner creation until the configured launch timestamp has been reached.
    if (gate.launchTimeEnabled) {
      // Time.now() returns nanoseconds; launchTime is stored as milliseconds → convert to ns
      let launchTimeNs : Int = gate.launchTime * 1_000_000;
      if (Time.now() < launchTimeNs) {
        return #err("LAUNCH_NOT_STARTED");
      };
    };

    // --- Fee verification phase (RPC outcalls only — no state writes) ---
    // D1: the gate is NOT caller-elected. When ANY chain carries an armed fee
    // (a minerCreationFees entry > 0), creation is never free: feeChain must
    // be Some AND name a chain that is itself armed. Omitting feeChain, or
    // naming an unarmed/misspelled chain, can no longer skip verification.
    // Only a fully unarmed fee map (the owner's launch switch) leaves
    // creation free — exactly the previous behavior on an unarmed canister.
    var feeCheck : ?{ chain : Text; txHash : Text } = null;
    if (MiningLib.anyMinerFeeArmed(state)) {
      let chain = switch (feeChain) {
        case null {
          return #err("MINER_FEE_TX_REQUIRED: a miner-creation fee is armed — pay the fee and pass feeChain + feeTxHash");
        };
        case (?c) { c };
      };
      let requiredWei = switch (MiningLib.minerFeeRequired(state, chain)) {
        case null {
          return #err("MINER_FEE_CHAIN_UNSUPPORTED: no miner-creation fee is configured for \"" # chain # "\" — armed chains only");
        };
        case (?f) { f };
      };
      let txHash = switch (feeTxHash) {
        case null { return #err("MINER_FEE_TX_REQUIRED: a fee is configured for this chain — pay it in Step 1, then retry with the tx hash") };
        case (?h) { h };
      };
      // Empty-config guard (never silently skip): a configured fee with a
      // missing collector/event arm is an admin error, not a bypass.
      let collector = fee.collectorAddress;
      if (not fee.requireFeePaidEvent or collector.size() == 0) {
        return #err("MINER_FEE_NOT_CONFIGURED: fee set but the FeePaid check or collector address is missing — contact an admin");
      };
      let recipient = switch (adminState.feeRecipient) {
        case null { return #err("MINER_FEE_NOT_CONFIGURED: fee recipient not configured — contact an admin") };
        case (?r) { if (r.size() == 0) { return #err("MINER_FEE_NOT_CONFIGURED: fee recipient not configured — contact an admin") }; r };
      };

      // 1. tx status == success + receipt fetch (one outcall, reused for
      //    the FeePaid event check).
      let receipt = switch (await verifyFeeWithReceipt(txHash, chain)) {
        case (#err("PENDING")) { return #err("PENDING: fee tx not yet indexed — retry in a moment") };
        case (#err("TX_FAILED")) { return #err("MINER_FEE_TX_FAILED: the fee transaction reverted on-chain") };
        case (#err(e)) { return #err("MINER_FEE_TX_ERROR: " # e) };
        case (#ok(json)) { json };
      };

      // 2. collector FeePaid event: value + binding bytes. PENDING outcomes
      //    are retriable (same recovery model as claims); #missing with a
      //    tx.to == collector means a plain transfer (no event) — the
      //    binding then comes from the tx calldata, which the collector
      //    requires anyway.
      var paidValueWei : ?Nat = null;
      var eventBindingHex : ?Text = null;
      switch (VerifyLib.feePaidLogValue(receipt, collector, "")) {
        case (#found(r)) {
          paidValueWei := ?r.valueWei;
          eventBindingHex := r.bindingHex;
        };
        case (#unparseable) { return #err("PENDING: fee event unreadable — retry in a moment") };
        case (#missing) {
          // NOT a usable fallback (review 2026-09-12): with recipient ==
          // collector enforced and FeePaid emitted on every accepted
          // payment, #missing here means a stale/partial RPC receipt —
          // the payer-match check below correctly returns PENDING and the
          // claim retried. A genuine plain transfer (no event) can never
          // pass this gate, so no value/binding is read on this path.
        };
      };

      // 3. fetch the fee tx (from / to / input).
      let feeTx = switch (await VerifyLib.fetchTxByHash(txHash, chain, transformFn)) {
        case (#err("PENDING")) { return #err("PENDING: fee tx not yet indexed — retry in a moment") };
        case (#err(e)) { return #err("MINER_FEE_TX_ERROR: " # e) };
        case (#ok(t)) { t };
      };

      // 4. the event's payer must be THIS tx's sender (binds event to tx).
      switch (VerifyLib.feePaidPayerMatches(receipt, collector, feeTx.from)) {
        case true {};
        case false { return #err("PENDING: fee event payer mismatch — stale or partial receipt, retry") };
      };

      // 5. binding: recipient wallet + MINE payload naming the caller.
      switch (VerifyLib.verifyMinerFeeBinding(feeTx, recipient, caller.toText(), eventBindingHex)) {
        case (#ok) {};
        case (#err(e)) { return #err(e) };
      };

      // 6. amount: exact-or-more against the configured fixed fee — only
      //    on the event path (paidValueWei != null). Reachability note
      //    (review 2026-09-12): the no-event path cannot reach this point
      //    (payer-match fails on #missing → PENDING above), so the amount
      //    floor is ALWAYS enforced for any payment that gets here —
      //    there is no underpayment bypass through a missing event.
      switch (paidValueWei) {
        case null {}; // plain-transfer path — see comment above
        case (?paid) {
          switch (VerifyLib.minerFeeShortfall(paid, requiredWei)) {
            case null {};
            case (?missing) {
              let paidEth = Float.fromInt(paid) / 1e18;
              let reqEth = Float.fromInt(requiredWei) / 1e18;
              return #err("MINER_FEE_UNDERPAID: paid " # paidEth.toText() # " native, required ≥ " # reqEth.toText());
            };
          };
        };
      };

      // Remember the verified fee facts for the atomic tail below.
      feeCheck := ?{ chain = chain; txHash = txHash };
    };

    // --- Atomic tail (await-free): replay check → create → consume ---
    // Any concurrent createMiner with the same fee tx interleaves only at
    // awaits — there are none between this check and the consume.
    switch (feeCheck) {
      case (?fc) {
        if (MiningLib.isMinerFeeConsumed(state, fc.chain, fc.txHash)) {
          return #err("MINER_FEE_REPLAY: this fee transaction was already used to create a miner");
        };
        let result = MiningLib.createMiner(state, gritProxy(), caller, name, gritAmount, rate);
        switch (result) {
          case (#ok(id)) {
            // Tear the ticket ONLY on success — a failed create must not
            // consume the caller's payment.
            MiningLib.consumeMinerFee(state, fc.chain, fc.txHash);
            #ok(id);
          };
          case (#err(e)) { #err(e) };
        };
      };
      case null {
        MiningLib.createMiner(state, gritProxy(), caller, name, gritAmount, rate);
      };
    };
  };

  /// Edit an existing miner (rename, top-up, rate change, pause/resume).
  public shared ({ caller }) func editMiner(
    minerId : MiningTypes.MinerId,
    nameChange : ?Text,
    topUp : ?Nat,
    rateChange : ?Nat,
    pause : ?Bool,
  ) : async { #ok; #err : Text } {
    MiningLib.editMiner(state, gritProxy(), caller, minerId, nameChange, topUp, rateChange, pause);
  };

  /// Return all miners belonging to the caller.
  public shared query ({ caller }) func getMyMiners() : async [MiningTypes.MinerView] {
    MiningLib.getMinersByOwner(state, caller);
  };

  /// Return the caller's AKK balance.
  /// When the ledger is configured, queries the real ICRC-1 ledger;
  /// otherwise returns from the internal balance map.
  /// Return the caller's AKK balance.
  /// When the external ledger is configured, queries icrc1_balance_of for the
  /// caller's principal account; otherwise returns from the internal balance map.
  public shared ({ caller }) func getAkkBalance() : async Nat {
    switch (state.akkLedgerId) {
      case null {
        // Draft mode: use all-time earned map
        MiningLib.getAkkEarned(state, caller);
      };
      case (?ledgerId) {
        let selfP = getSelfPrincipal();
        // Guard against the ledger ID pointing to this canister itself
        let isSelf = switch (selfP) {
          case (?s) Principal.equal(ledgerId, s);
          case null false;
        };
        if (isSelf) {
          return MiningLib.getAkkEarned(state, caller);
        };
        let ledger : AkkLedgerTypes.IcrcLedger = actor (ledgerId.toText());
        await ledger.icrc1_balance_of({ owner = caller; subaccount = null });
      };
    };
  };

  /// Withdraw AKK from caller's balance to a recipient ICRC-1 Account.
  ///
  /// Draft mode (no external ledger): moves balances in the internal map.
  ///
  /// Live mode (external ICRC-1 ledger): AKK is held on the USER's principal on the
  /// ledger (minted there by this canister as minting_account). The backend cannot
  /// call icrc1_transfer on behalf of the user — that would execute as a MINT from
  /// the minting account (fee must be 0) and does not move the user's tokens.
  /// Live withdrawals must be signed by the user's Internet Identity via the
  /// frontend (direct ledger icrc1_transfer). This endpoint only supports optional
  /// ICRC-2 transfer_from after the user has approved this canister as spender.
  public shared ({ caller }) func withdrawAkk(
    recipient : AkkLedgerTypes.Account,
    amount : Nat,
  ) : async { #ok : Text; #err : Text } {
    if (amount == 0) { return #err "Amount must be greater than 0" };
    switch (state.akkLedgerId) {
      case null {
        let callerBal = MiningLib.getAkkBalance(state, caller);
        if (callerBal < amount) {
          return #err ("Insufficient AKK balance. Available: " # callerBal.toText() # " e8s");
        };
        MiningLib.withdrawAkk(state, caller, recipient.owner, amount);
      };
      case (?ledgerId) {
        let ledger : AkkLedgerTypes.IcrcLedger = actor (ledgerId.toText());

        let liveFee : Nat = try {
          let f = await ledger.icrc1_fee();
          if (f != state.akkTransferFee) { state.akkTransferFee := f };
          f;
        } catch (_) {
          return #err "Could not read the ledger fee. Please retry in a moment.";
        };

        // Prefer ICRC-2 transfer_from when the user has approved this canister.
        // This moves tokens from the caller's ledger account (not a mint).
        let selfP = miningCanisterPrincipal();
        let spender : AkkLedgerTypes.Account = { owner = selfP; subaccount = null };
        let fromAcct : AkkLedgerTypes.Account = { owner = caller; subaccount = null };

        let allowance = try {
          await ledger.icrc2_allowance({ account = fromAcct; spender })
        } catch (_) {
          { allowance = 0 : Nat; expires_at = null };
        };

        let needed = amount + liveFee;
        if (allowance.allowance < needed) {
          return #err (
            "Live AKK withdrawals must be signed by your Internet Identity. " #
            "Approve this app as spender for at least " # needed.toText() #
            " e8s (amount + fee) on the AKK ledger, or use the in-app withdraw " #
            "flow which signs the transfer directly. Current allowance: " #
            allowance.allowance.toText() # " e8s."
          );
        };

        let transferResult = await ledger.icrc2_transfer_from({
          spender_subaccount = null;
          from = fromAcct;
          to = recipient;
          amount;
          fee = ?liveFee;
          memo = null;
          created_at_time = null;
        });
        switch (transferResult) {
          case (#Ok _) {
            #ok (amount.toText() # " AKK withdrawn");
          };
          case (#Err e) {
            let msg : Text = switch (e) {
              case (#InsufficientFunds _) {
                "Insufficient balance. Check your AKK balance and try again.";
              };
              case (#InsufficientAllowance { allowance }) {
                "Insufficient allowance (" # allowance.toText() # " e8s). Re-approve and retry.";
              };
              case (#BadFee { expected_fee }) {
                "Transfer fee mismatch. The ledger expects a fee of " # expected_fee.toText() #
                " e8s. Please contact an admin to update the configured fee.";
              };
              case (#BadBurn _) {
                "Transfer amount is below the minimum required.";
              };
              case (#TooOld) {
                "Transaction expired. Please try again.";
              };
              case (#CreatedInFuture _) {
                "Transaction timestamp is in the future. Please try again.";
              };
              case (#TemporarilyUnavailable) {
                "The ledger is temporarily unavailable. Please try again in a moment.";
              };
              case (#Duplicate _) {
                "This transaction appears to be a duplicate. If your balance was not changed, please retry.";
              };
              case (#GenericError err) {
                "Transfer failed: " # err.message;
              };
            };
            #err msg;
          };
        };
      };
    };
  };

  /// Admin: set the AKK transfer fee (in e8s). Applied to all future withdrawals.
  public shared ({ caller }) func setAkkTransferFee(fee : Nat) : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    state.akkTransferFee := fee;
    #ok;
  };

  /// Query the current AKK transfer fee (in e8s).
  public query func getAkkTransferFee() : async Nat {
    state.akkTransferFee;
  };

  /// Admin: set the AKK ledger canister ID for real ICRC-1 minting/transfers.
  /// Validates the target canister by calling icrc1_name() and icrc1_minting_account()
  /// before committing. The ledger's minting_account.owner MUST match this canister's
  /// own principal — otherwise minting will fail with #InsufficientFunds.
  public shared ({ caller }) func setAkkLedgerCanisterId(id : Principal) : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    let selfP = miningCanisterPrincipal();
    let probe = actor (id.toText()) : actor {
      icrc1_name : query () -> async Text;
      icrc1_minting_account : query () -> async ?AkkLedgerTypes.Account;
    };
    try {
      let name = await probe.icrc1_name();
      // Case-insensitive / outer-whitespace-tolerant match
      let normalized = name.trim(#char ' ').toLower();
      if (normalized != "anti krisis koin") {
        return #err("Ledger validation failed: target returned name '" # name # "', expected 'Anti Krisis Koin'");
      };
      // Verify the ledger's minting account matches this canister.
      // icrc1_transfer only creates tokens when the CALLER is the minting_account.
      // Any mismatch causes #InsufficientFunds on every block reward.
      let mintingAccountOpt = await probe.icrc1_minting_account();
      switch (mintingAccountOpt) {
        case null {
          return #err("Ledger has no minting account configured. Cannot use this ledger for AKK minting.");
        };
        case (?mintingAccount) {
          if (mintingAccount.owner != selfP) {
            return #err(
              "Ledger minting account (" # mintingAccount.owner.toText() #
              ") does not match this canister's principal (" # selfP.toText() #
              "). Please redeploy the ledger with: minting_account = record { owner = principal \"" # selfP.toText() # "\" }"
            );
          };
        };
      };
      state.akkLedgerId := ?id;
      #ok;
    } catch (e) {
      #err("Ledger validation failed: " # e.message());
    };
  };

  /// Query the currently configured AKK ledger canister ID.
  /// Public so any user can resolve the ledger for signed withdrawals.
  public shared query func getAkkLedgerCanisterId() : async ?Principal {
    state.akkLedgerId;
  };

  /// Admin: return this canister's own principal.
  /// Use this to find the correct minting_account owner when deploying the AKK ledger.
  public shared query func getAppPrincipal() : async Principal {
    miningCanisterPrincipal();
  };

  /// Admin: query the AKK ledger's configured minting account.
  /// Returns null if no ledger is configured or the query fails.
  public shared func getLedgerMintingAccount() : async ?AkkLedgerTypes.Account {
    switch (state.akkLedgerId) {
      case null null;
      case (?ledgerId) {
        let ledger : AkkLedgerTypes.IcrcLedger = actor (ledgerId.toText());
        try {
          await ledger.icrc1_minting_account();
        } catch (_) { null };
      };
    };
  };

  /// Admin: clear the pending mint retry queue.
  /// Call this to discard stuck retries after fixing a ledger misconfiguration.
  public shared ({ caller }) func clearPendingMints() : async { #ok : Nat; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    let count = state.pendingMints.size();
    state.pendingMints.clear();
    #ok count;
  };

  /// Admin: clear the abandoned mint list.
  /// Call this to discard entries that can never be retried after a ledger swap.
  public shared ({ caller }) func clearAbandonedMints() : async { #ok : Nat; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    let count = state.abandonedMints.size();
    state.abandonedMints.clear();
    #ok count;
  };

  /// Admin: reset the AKK ledger canister ID lock so a corrected ledger can be set.
  /// Only allowed when the currently configured ledger's minting account does NOT match
  /// this canister's principal (i.e. the ledger was misconfigured) or is unreachable.
  public shared ({ caller }) func resetAkkLedgerCanisterId() : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    switch (state.akkLedgerId) {
      case null {
        return #err "No ledger ID is currently set.";
      };
      case (?ledgerId) {
        let selfP = miningCanisterPrincipal();
        let ledger : AkkLedgerTypes.IcrcLedger = actor (ledgerId.toText());
        var isMisconfigured = false;
        try {
          let mintingAccountOpt = await ledger.icrc1_minting_account();
          switch (mintingAccountOpt) {
            case null { isMisconfigured := true };
            case (?acct) {
              if (acct.owner != selfP) { isMisconfigured := true };
            };
          };
        } catch (_) {
          // Unreachable ledger — also allow reset
          isMisconfigured := true;
        };
        if (not isMisconfigured) {
          return #err "Cannot reset: the current ledger is correctly configured (minting account matches this canister). Use clearPendingMints to flush the retry queue instead.";
        };
        state.akkLedgerId := null;
        #ok;
      };
    };
  };

  /// Admin: credit all abandoned mints through the external ledger.
  /// Replays each abandoned MintRetryEntry, minting the original reward
  /// directly to the winner's principal account. No supply cap check is applied
  /// (these rewards are already counted in totalAkkMined and totalAkkWonByUser).
  /// On success the entry is moved out of abandonedMints and its blockId added to
  /// mintedBlockIds so retries are deduplicated. Caller must be an admin.
  public shared ({ caller }) func creditAbandonedMints() : async { #ok : Nat; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    switch (state.akkLedgerId) {
      case null { return #err "No external ledger configured. Set AKK Ledger Canister ID first." };
      case (?ledgerId) {
        let ledger : AkkLedgerTypes.IcrcLedger = actor (ledgerId.toText());
        var credited : Nat = 0;
        let snapshot = state.abandonedMints.toArray();
        for (entry in snapshot.values()) {
          // Skip if already minted
          if (state.mintedBlockIds.contains(entry.blockId)) {
            let without = state.abandonedMints.filter(func(e : MiningLib.MintRetryEntry) : Bool { e.blockId != entry.blockId });
            state.abandonedMints.clear();
            for (e in without.values()) { state.abandonedMints.add(e) };
            credited += 1;
          } else {
            try {
              // AKK-6: cap-clamp the replayed amount against current supply —
              // the "already counted in totalAkkMined" argument covers
              // bookkeeping, not the LEDGER's 21M cap. If the supply query
              // fails, leave the entry abandoned (retry later) — no blind mint.
              var replayAmount = entry.amount;
              var supplyUnknown = false;
              try {
                let currentSupply = await ledger.icrc1_total_supply();
                replayAmount := LedgerMint.capDecision(currentSupply, LedgerMint.AKK_HARD_CAP, entry.amount);
              } catch (_) { supplyUnknown := true };
              if (supplyUnknown) {
                entry.error := "creditAbandonedMints: supply query failed — left for retry (AKK-6)";
                entry.lastAttemptTime := Time.now();
              } else if (replayAmount == 0) {
                // Ledger cap genuinely reached — these rewards can never mint.
                state.mintedBlockIds.add(entry.blockId);
                let without = state.abandonedMints.filter(func(e : MiningLib.MintRetryEntry) : Bool { e.blockId != entry.blockId });
                state.abandonedMints.clear();
                for (e in without.values()) { state.abandonedMints.add(e) };
                credited += 1;
              } else if (replayAmount != entry.amount) {
                // W4/A-F1: cap-reached is settled above; here the frozen amount
                // only PARTIALLY fits, so sending it would hash differently from
                // the original attempt and a committed-but-unreported transfer
                // could be paid twice. Leave it abandoned for the admin instead.
                entry.error := "creditAbandonedMints: frozen amount no longer fits the remaining cap — not sent (request identity preserved)";
                entry.lastAttemptTime := Time.now();
              } else {
                // F2 staleness net (mirrors drainPendingMints): an entry can
                // reach the abandoned list with a timestamp that has since aged
                // out of the ledger's 24h window, and a frozen value cannot
                // refresh itself — the replay would fail #TooOld forever.
                // Re-freeze before replaying. Safe here: every retry of this
                // entry failed, so no transfer ever committed for the block (a
                // committed one would have returned #Duplicate on the next
                // identical attempt).
                let replayNow = Time.now();
                if (LedgerMint.isFrozenStale(entry.createdAtTime, replayNow)) {
                  entry.createdAtTime := LedgerMint.mintCreatedAtTime(entry.blockId, replayNow);
                  entry.error := "Re-froze stale mint timestamp on admin replay (F2 staleness net)";
                };
                let result = await ledger.icrc1_transfer({
                  from_subaccount = null;
                  to = { owner = entry.owner; subaccount = null };
                  amount = replayAmount;
                  fee = null;
                  memo = ?Utils.blockIdMemo(entry.blockId);
                  // AKK-7 + F2: the entry's FROZEN timestamp — the admin replay
                  // sends the same created_at_time as the original attempt, so
                  // if that attempt actually committed before being abandoned,
                  // the ledger's dedup returns #Duplicate rather than minting
                  // a second time.
                  created_at_time = ?entry.createdAtTime;
                });
                switch (result) {
                  case (#Ok _) {
                    state.mintedBlockIds.add(entry.blockId);
                    let without = state.abandonedMints.filter(func(e : MiningLib.MintRetryEntry) : Bool { e.blockId != entry.blockId });
                    state.abandonedMints.clear();
                    for (e in without.values()) { state.abandonedMints.add(e) };
                    state.totalMintSucceeded += 1;
                    credited += 1;
                  };
                  case (#Err(#Duplicate _)) {
                    state.mintedBlockIds.add(entry.blockId);
                    let without = state.abandonedMints.filter(func(e : MiningLib.MintRetryEntry) : Bool { e.blockId != entry.blockId });
                    state.abandonedMints.clear();
                    for (e in without.values()) { state.abandonedMints.add(e) };
                    state.totalMintSucceeded += 1;
                    credited += 1;
                  };
                  case (#Err e) {
                    entry.error := "creditAbandonedMints Err: " # debug_show(e);
                    entry.attempts += 1;
                    entry.lastAttemptTime := Time.now();
                  };
                };
              };
            } catch (e) {
              entry.error := "creditAbandonedMints exception: " # e.message();
              entry.attempts += 1;
              entry.lastAttemptTime := Time.now();
            };
          };
        };
        #ok credited;
      };
    };
  };

  /// Return current block info.
  public shared query func getCurrentBlockInfo() : async {
    blockNumber : Nat;
    lastBlockTime : Int;
    nextBlockIn : Nat;
    isMiningActive : Bool;
  } {
    MiningLib.getCurrentBlockInfo(state);
  };

  /// Return miner creation fees for all chains that have at least one allowlisted token.
  public shared query func getMinerCreationFees() : async [MiningTypes.ChainFeeEntry] {
    MiningLib.getMinerCreationFees(state, AllowlistLib.getTokens(allowlistState));
  };

  /// Admin: update miner creation fee for a specific chain.
  public shared ({ caller }) func setMinerCreationFee(
    chain : Text,
    feeWei : Nat,
  ) : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    // F1 hardening: fees are only armable on allowlisted chains. The UI's
    // fee display filters to allowlisted chains — arming a fee on any other
    // chain would make the UI show "free" while the backend enforced (a
    // config-divergence bypass). Case-insensitive match; the allowlist is
    // the source of truth for which chains exist.
    let chainLc = chain.toLower();
    var supported : Nat = 0;
    for (t in AllowlistLib.getTokens(allowlistState).values()) {
      if (t.chain.toLower() == chainLc) { supported += 1 };
    };
    if (not MiningLib.setMinerCreationFeeAllowed(supported)) {
      return #err("MINER_FEE_CHAIN_UNSUPPORTED: no allowlisted tokens on \"" # chain # "\" — allowlist a token on that chain before setting its creation fee");
    };
    MiningLib.setMinerCreationFee(state, chain, feeWei);
    #ok;
  };

  /// Return the most recent `limit` block records.
  public shared query func getBlockHistory(limit : Nat) : async [MiningTypes.BlockRecord] {
    MiningLib.getBlockHistory(state, limit);
  };

  /// Return a page of block records, most recent first (page 0 = newest).
  public shared query func getBlockHistoryPage(page : Nat, pageSize : Nat) : async [MiningTypes.BlockRecord] {
    MiningLib.getBlockHistoryPage(state, page, pageSize);
  };

  /// Return the total number of blocks stored in the full history.
  public query func getTotalBlockCount() : async Nat {
    MiningLib.getTotalBlockCount(state);
  };

  /// Admin: return the pending mint retry queue as structured views.
  public shared ({ caller }) func getPendingMints() : async [MiningTypes.MintRetryView] {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return [];
    };
    MiningLib.getPendingMints(state);
  };

  public shared query func getTotalAkkFromHistory() : async Nat {
    MiningLib.getTotalAkkFromHistory(state);
  };

  public shared ({ caller }) func getAbandonedMints() : async [MiningTypes.MintRetryView] {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return [];
    };
    MiningLib.getAbandonedMints(state);
  };

  /// Admin: return aggregate mint retry statistics.
  public shared ({ caller }) func getMintRetryStats() : async {
    queueDepth : Nat;
    totalRetried : Nat;
    totalSucceeded : Nat;
    totalAbandoned : Nat;
  } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return { queueDepth = 0; totalRetried = 0; totalSucceeded = 0; totalAbandoned = 0 };
    };
    MiningLib.getMintRetryStats(state);
  };

  /// Admin: manually retry a specific failed mint by blockId.
  public shared ({ caller }) func retryMint(blockId : Nat) : async { #Ok; #Err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #Err "Unauthorized: admins only";
    };
    // Find the entry in pending mints
    let found = state.pendingMints.find(func(e : MiningTypes.MintRetryEntry) : Bool {
      e.blockId == blockId
    });
    switch (found) {
      case null {
        // Check abandoned mints too
        let abandonedFound = state.abandonedMints.find(func(e : MiningTypes.MintRetryEntry) : Bool {
          e.blockId == blockId
        });
        switch (abandonedFound) {
          case null { #Err ("No pending or abandoned mint found for blockId " # blockId.toText()) };
          case (?entry) {
            // Re-queue the abandoned entry with reset attempts
            entry.attempts := 0;
            entry.error := "Re-queued by admin";
            // Remove from abandoned
            let without = state.abandonedMints.filter(func(e : MiningTypes.MintRetryEntry) : Bool {
              e.blockId != blockId
            });
            state.abandonedMints.clear();
            for (e in without.values()) { state.abandonedMints.add(e) };
            state.pendingMints.add(entry);
            #Ok;
          };
        };
      };
      case (?entry) {
        // Reset the attempt counter so drainPendingMints will retry it next cycle
        entry.attempts := 0;
        entry.error := "Manually retriggered by admin";
        #Ok;
      };
    };
  };

  /// Return full block detail for a given block number, or null if not found.
  /// Return full block detail for a given block number, or null if not found.
  /// Return full block detail for a given block number, or null if not found.
  /// Return full block detail for a given block number, or null if not found.
  public shared query func getBlockDetails(blockNumber : Nat) : async ?MiningTypes.BlockDetailView {
    // Use List.find for a clean, reliable exact-match lookup.
    let found = state.blockHistory.find(func(r : MiningTypes.BlockRecord) : Bool {
      r.blockNumber == blockNumber
    });
    switch (found) {
      case null null;
      case (?r) {
        ?{
          blockNumber      = r.blockNumber;
          winnerPrincipal  = r.winnerOwner;
          winnerMinerId    = r.winnerMinerId;
          minerParticipants = r.minerParticipants;
          totalGritSpent   = r.totalGritSpent;
          minerCount       = r.minerParticipants.size();
          minerGritSpent   = r.minerGritSpent;
          minerWeights     = r.minerWeights;
          vrfValue         = r.vrfValue;
          akkReward        = r.akkReward;
          timestamp        = r.timestamp;
        };
      };
    };
  };

  /// Return protocol-level aggregate stats for the Overview page.
  public shared query func getProtocolStats() : async {
    currentBlock : Nat;
    nextBlockIn : Nat;
    blockReward : Nat;
    totalAkkMined : Nat;
    activeMiners : Nat;
    totalMiners : Nat;
    totalGritSpent : Nat;
    isMiningActive : Bool;
    blocksUntilHalving : Nat;
  } {
    let HALVING_INTERVAL : Nat = 69_000;
    let info = MiningLib.getCurrentBlockInfo(state);
    // Count active miners and total miners
    var activeMiners : Nat = 0;
    var totalGritSpent : Nat = 0;
    for (m in state.miners.values()) {
      if (m.status == #active) { activeMiners += 1 };
    };
    for ((_, spent) in state.gritSpentByUser.entries()) {
      totalGritSpent += spent;
    };
    let reward = MiningLib.blockReward(state.blockNumber, state.totalAkkMined);
    let nextHalvingBlock : Nat = ((state.blockNumber / HALVING_INTERVAL) + 1) * HALVING_INTERVAL;
    let blocksUntilHalving : Nat = nextHalvingBlock - state.blockNumber;
    {
      currentBlock       = state.blockNumber;
      nextBlockIn        = info.nextBlockIn;
      blockReward        = reward;
      totalAkkMined      = state.totalAkkMined;
      activeMiners       = activeMiners;
      totalMiners        = state.nextMinerId;
      totalGritSpent     = totalGritSpent;
      isMiningActive     = info.isMiningActive;
      blocksUntilHalving = blocksUntilHalving;
    };
  };

  /// Return protocol-level burn summary: total USD burned, total GRIT minted from burns, and breakdown by token.
  public shared query func getProtocolBurnSummary() : async {
    totalBurnUsd : Float;
    totalGritFromBurns : Nat;
    byToken : [(Text, Float, Float)];
  } {
    // aggregated: symbol → (totalTokensBurned, totalUsdValue)
    let aggregated = Map.empty<Text, (Float, Float)>();
    var totalBurnUsd : Float = 0.0;
    var totalGritFromBurns : Nat = 0;
    for (r in gritState.claims.values()) {
      if (r.status == #verified) {
        totalBurnUsd += r.usdValue;
        totalGritFromBurns += r.gritMinted;
        let (curBurned, curUsd) = switch (aggregated.get(r.tokenSymbol)) {
          case null (0.0, 0.0);
          case (?v) v;
        };
        aggregated.add(r.tokenSymbol, (curBurned + r.amountBurned, curUsd + r.usdValue));
      };
    };
    let results = List.empty<(Text, Float, Float)>();
    for ((sym, (burned, usd)) in aggregated.entries()) {
      results.add((sym, burned, usd));
    };
    // Sort descending by USD value
    let sorted = results.sort(func(a : (Text, Float, Float), b : (Text, Float, Float)) : Order.Order {
      if (b.2 > a.2) #less
      else if (b.2 < a.2) #greater
      else #equal
    });
    {
      totalBurnUsd;
      totalGritFromBurns;
      byToken = sorted.toArray();
    };
  };

  /// Return per-caller mining stats: blocks mined, AKK won, GRIT spent.
  public shared query ({ caller }) func getUserMiningStats() : async { blocksMined : Nat; akkWon : Nat; gritSpent : Nat } {
    var blocksMined : Nat = 0;
    var akkWonFromHistory : Nat = 0;
    for (b in state.blockHistory.values()) {
      switch (b.winnerOwner) {
        case (?owner) {
          if (owner == caller) {
            blocksMined += 1;
            akkWonFromHistory += b.akkReward;
          };
        };
        case null {};
      };
    };
    let akkWonAccumulator : Nat = switch (state.totalAkkWonByUser.get(caller)) {
      case null 0;
      case (?n) n;
    };
    // Use the maximum of block-history sum and the running accumulator.
    // The accumulator only captures wins since it was introduced; the block history
    // (capped at 100) covers the most recent blocks. Taking the max ensures neither
    // source undercounts — the full all-time total is whichever is higher.
    let akkWon : Nat = Nat.max(akkWonFromHistory, akkWonAccumulator);
    let gritSpent : Nat = switch (state.gritSpentByUser.get(caller)) {
      case null 0;
      case (?n) n;
    };
    { blocksMined; akkWon; gritSpent };
  };
};
