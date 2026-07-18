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
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Utils "../lib/utils";
import Runtime "mo:core/Runtime";import Error "mo:core/Error";





mixin (
  state : MiningLib.State,
  gritState : GritLib.State,
  adminState : AllowlistLib.AdminState,
  allowlistState : AllowlistLib.State,
  gate : AllowlistLib.GateState,
  getSelfPrincipal : () -> ?Principal,
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
  public shared ({ caller }) func createMiner(
    name : Text,
    gritAmount : Nat,
    rate : Nat,
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
    MiningLib.createMiner(state, gritProxy(), caller, name, gritAmount, rate);
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
  /// Accepts an ICRC-1 Account (with optional subaccount) for real ledger transfer.
  /// Transfer fee (state.akkTransferFee e8s) is deducted from the caller's balance on top of amount.
  /// Withdraw AKK from caller's balance to a recipient ICRC-1 Account.
  /// In live mode (external ledger set), calls icrc1_transfer directly on the ledger.
  /// The caller's AKK lives at their principal account on the ledger (no subaccount).
  public shared ({ caller }) func withdrawAkk(
    recipient : AkkLedgerTypes.Account,
    amount : Nat,
  ) : async { #ok : Text; #err : Text } {
    if (amount == 0) { return #err "Amount must be greater than 0" };
    switch (state.akkLedgerId) {
      case null {
        // Draft mode: internal balance transfer
        let callerBal = MiningLib.getAkkEarned(state, caller);
        if (callerBal < amount) {
          return #err ("Insufficient AKK balance. Available: " # callerBal.toText() # " e8s");
        };
        MiningLib.withdrawAkk(state, caller, recipient.owner, amount);
      };
      case (?ledgerId) {
        // Live mode: real ICRC-1 transfer from caller's account on the ledger
        let ledger : AkkLedgerTypes.IcrcLedger = actor (ledgerId.toText());
        let transferResult = await ledger.icrc1_transfer({
          from_subaccount = null; // caller's principal account
          to = recipient;
          amount;
          fee = ?state.akkTransferFee;
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
              case (#BadFee _) {
                "Transfer fee mismatch. Please refresh and retry.";
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
      if (name != "Anti Krisis Koin") {
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
  public shared query ({ caller }) func getAkkLedgerCanisterId() : async ?Principal {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return null;
    };
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
              let result = await ledger.icrc1_transfer({
                from_subaccount = null;
                to = { owner = entry.owner; subaccount = null };
                amount = entry.amount;
                fee = null;
                memo = null;
                created_at_time = null;
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
                case (#Err e) {
                  entry.error := "creditAbandonedMints Err: " # debug_show(e);
                  entry.attempts += 1;
                  entry.lastAttemptTime := Time.now();
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

  /// Admin: audit Current Supply vs sum of all actual balances.
  /// Returns totalAkkMined, sumOfAllBalances (akkBalances map),
  /// pendingMints total, and discrepancy = totalAkkMined - (sumOfAllBalances + pendingMints).
  /// Admin: audit Current Supply vs sum of all actual balances.
  /// In live mode, totalAkkMined is the authoritative supply counter.
  public shared query ({ caller }) func getSupplyVsBalanceAudit() : async {
    totalAkkMined : Nat;
    sumOfAllBalances : Nat;
    pendingMints : Nat;
    discrepancy : Int;
  } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return { totalAkkMined = 0; sumOfAllBalances = 0; pendingMints = 0; discrepancy = 0 };
    };
    // In live mode akkBalances is a draft-only buffer; use totalAkkWonByUser for audit
    var sumBalances : Nat = 0;
    for ((_, earned) in state.totalAkkWonByUser.entries()) {
      sumBalances += earned;
    };
    var pendingTotal : Nat = 0;
    for (entry in state.pendingMints.values()) {
      pendingTotal += entry.amount;
    };
    let discrepancy : Int = state.totalAkkMined.toInt() - (sumBalances + pendingTotal).toInt();
    {
      totalAkkMined    = state.totalAkkMined;
      sumOfAllBalances = sumBalances;
      pendingMints     = pendingTotal;
      discrepancy;
    };
  };

  /// Query: compute total AKK minted from real block history (read-only cross-check).
  public shared query func getTotalAkkFromHistory() : async Nat {
    MiningLib.getTotalAkkFromHistory(state);
  };

  /// Admin: recalculate totalAkkMined by summing akkReward across all blockHistory entries.
  /// Corrects inflation caused by ghost blocks or double-counting before the timer fix.
  public shared ({ caller }) func recalculateTotalAkkMined() : async { #ok : Nat; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err "Unauthorized: admins only";
    };
    var sum : Nat = 0;
    for (b in state.blockHistory.values()) {
      sum += b.akkReward;
    };
    state.totalAkkMined := sum;
    #ok sum;
  };

  /// Admin: return mints that exhausted all retry attempts.
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
