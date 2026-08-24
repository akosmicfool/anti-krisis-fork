import MiningTypes "../types/mining";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat64 "mo:core/Nat64";
import List "mo:core/List";
import Int "mo:core/Int";
import Nat32 "mo:core/Nat32";
import Map "mo:core/Map";import GritLib "../lib/grit";

import Principal "mo:core/Principal";
import Float "mo:core/Float";

module {
  public type State = MiningTypes.State;
  public type MinerId = MiningTypes.MinerId;
  public type MinerView = MiningTypes.MinerView;
  public type BlockRecord = MiningTypes.BlockRecord;
  public type MinerCreationFeeConfig = MiningTypes.MinerCreationFeeConfig;
  public type ChainFeeEntry = MiningTypes.ChainFeeEntry;  public type MintRetryEntry = MiningTypes.MintRetryEntry;
  public type MintRetryView  = MiningTypes.MintRetryView;


  let MAX_MINT_ATTEMPTS : Nat = 5;

  let AKK_HARD_CAP : Nat = 2_100_000_000_000_000; // 21_000_000 * 100_000_000
  let BASE_REWARD   : Nat = 15_000_000_000;        // 150 * 100_000_000
  let HALVING_INTERVAL : Nat = 69_000;
  let BLOCK_SECONDS    : Nat = 690;

  /// Project a mutable MinerRecord to an immutable MinerView.
  public func toView(m : MiningTypes.MinerRecord) : MinerView {
    {
      id                = m.id;
      owner             = m.owner;
      name              = m.name;
      gritBalance       = m.gritBalance;
      miningRate        = m.miningRate;
      status            = m.status;
      createdAt         = m.createdAt;
      lastProcessedBlock = m.lastProcessedBlock;
      blocksMined       = m.blocksMined;
      gritSpent         = m.gritSpent;
    };
  };

  /// Create a new miner for caller, deducting gritAmount from their GRIT balance.
  public func createMiner(
    state : State,
    gritBalances : { get : (Principal) -> ?Nat; set : (Principal, Nat) -> () },
    caller : Principal,
    name : Text,
    gritAmount : Nat,
    rate : Nat,
  ) : { #ok : MinerId; #err : Text } {
    if (name.size() == 0) { return #err "Miner name cannot be empty" };
    if (gritAmount == 0) { return #err "Must load at least 1 GRIT" };
    if (rate < 1_000_000_000 or rate > 10_000_000_000) {
      return #err "Mining rate must be between 1 and 10 billion GRIT/day";
    };
    let currentBalance = switch (gritBalances.get(caller)) {
      case null 0;
      case (?b) b;
    };
    if (currentBalance < gritAmount) {
      return #err "Insufficient GRIT balance";
    };
    gritBalances.set(caller, currentBalance - gritAmount);
    let minerId = state.nextMinerId;
    let miner : MiningTypes.MinerRecord = {
      id                 = minerId;
      owner              = caller;
      var name           = name;
      var gritBalance    = gritAmount;
      var miningRate     = rate;
      var status         = #active;
      createdAt          = Time.now();
      var lastProcessedBlock = state.blockNumber;
      var blocksMined    = 0;
      var gritSpent      = 0;
    };
    state.miners.add(minerId, miner);
    state.nextMinerId += 1;
    #ok minerId;
  };

  /// Edit an existing miner: rename, top up GRIT, change rate, or pause/resume.
  public func editMiner(
    state : State,
    gritBalances : { get : (Principal) -> ?Nat; set : (Principal, Nat) -> () },
    caller : Principal,
    minerId : MinerId,
    nameChange : ?Text,
    topUpGrit : ?Nat,
    rateChange : ?Nat,
    pause : ?Bool,
  ) : { #ok; #err : Text } {
    let miner = switch (state.miners.get(minerId)) {
      case null { return #err "Miner not found" };
      case (?m) m;
    };
    if (miner.owner != caller) { return #err "Not your miner" };
    // Apply name change
    switch (nameChange) {
      case null {};
      case (?n) {
        if (n.size() == 0) { return #err "Miner name cannot be empty" };
        miner.name := n;
      };
    };
    // Apply GRIT top-up
    switch (topUpGrit) {
      case null {};
      case (?amount) {
        if (amount == 0) { return #err "Top-up amount must be greater than 0" };
        let currentBalance = switch (gritBalances.get(caller)) {
          case null 0;
          case (?b) b;
        };
        if (currentBalance < amount) { return #err "Insufficient GRIT balance" };
        gritBalances.set(caller, currentBalance - amount);
        miner.gritBalance += amount;
        // Reactivate if exhausted
        if (miner.status == #exhausted) { miner.status := #active };
      };
    };
    // Apply rate change
    switch (rateChange) {
      case null {};
      case (?r) {
        if (r < 1_000_000_000 or r > 10_000_000_000) {
          return #err "Mining rate must be between 1 and 10 billion GRIT/day";
        };
        miner.miningRate := r;
      };
    };
    // Apply pause/resume
    switch (pause) {
      case null {};
      case (?true) { miner.status := #paused };
      case (?false) {
        if (miner.gritBalance == 0) {
          return #err "Cannot resume: miner has no GRIT. Top up first.";
        };
        miner.status := #active;
      };
    };
    #ok;
  };

  /// Return all miners owned by a given principal.
  public func getMinersByOwner(state : State, owner : Principal) : [MinerView] {
    state.miners.values().filter(func(m : MiningTypes.MinerRecord) : Bool {
      m.owner == owner
    }).map(toView).toArray();
  };

  /// Return every miner in the system.
  public func getAllMiners(state : State) : [MinerView] {
    state.miners.values().map(toView).toArray();
  };

  /// Return the mocked AKK balance of a principal.
  public func getAkkBalance(state : State, owner : Principal) : Nat {
    switch (state.akkBalances.get(owner)) {
      case null 0;
      case (?b) b;
    };
  };

  /// Return the all-time accumulated AKK earned through block rewards.
  /// Never decreases on withdrawal or transfer.
  public func getAkkEarned(state : State, owner : Principal) : Nat {
    switch (state.totalAkkWonByUser.get(owner)) {
      case null 0;
      case (?n) n;
    };
  };

  /// Withdraw (transfer) AKK from caller's balance to a recipient principal.
  /// Withdraw AKK from caller's earned balance to a recipient principal.
  /// Reads from and deducts from totalAkkWonByUser (the all-time earned map,
  /// which is the only map populated by block rewards in single-canister mode).
  public func withdrawAkk(
    state : State,
    caller : Principal,
    recipient : Principal,
    amount : Nat,
  ) : { #ok : Text; #err : Text } {
    if (amount == 0) { return #err "Amount must be greater than 0" };
    let callerBal = getAkkEarned(state, caller);
    if (callerBal < amount) {
      return #err ("Insufficient AKK balance. Available: " # callerBal.toText() # " e8s");
    };
    // Deduct from the all-time earned map (this is the spendable balance in single-canister mode)
    state.totalAkkWonByUser.add(caller, callerBal - amount);
    // Credit recipient
    let recipientBal = getAkkEarned(state, recipient);
    state.totalAkkWonByUser.add(recipient, recipientBal + amount);
    #ok (amount.toText() # " AKK withdrawn to " # recipient.toText());
  };

  /// Compute true total AKK minted from real block history.
  /// Sums akkReward for all blocks that had a non-null winner.
  /// Use this as a cross-check against totalAkkMined for supply audits.
  public func getTotalAkkFromHistory(state : State) : Nat {
    var total : Nat = 0;
    for (block in state.blockHistory.values()) {
      switch (block.winnerOwner) {
        case null {};
        case (?_) { total += block.akkReward };
      };
    };
    total;
  };

  /// Compute block reward for a given block number (halving every 69_000 blocks, hard cap 21M AKK).
  public func blockReward(blockNumber : Nat, totalMined : Nat) : Nat {
    if (totalMined >= AKK_HARD_CAP) { return 0 };
    let halvings = blockNumber / HALVING_INTERVAL;
    // Shift right by halvings (integer divide by 2^halvings)
    // Cap halvings to avoid toNat32 trap for very large block numbers
    let halvingsCapped : Nat32 = Nat32.fromNat(if (halvings > 63) 63 else halvings);
    let reward = BASE_REWARD / (2 ** halvingsCapped.toNat());
    if (reward == 0) { return 0 };
    let remaining : Nat = if (AKK_HARD_CAP > totalMined) { AKK_HARD_CAP - totalMined } else { 0 };
    if (reward > remaining) remaining else reward;
  };

  /// Process one mining block: drain GRIT, run VRF, pick winner, credit AKK.
  /// mintAkk is called with (owner, amount, blockId) to credit the block reward —
  /// blockId is captured before any await so the caller can use it as a dedup key
  /// even if the canister's mutable blockNumber has been updated by a concurrent call.
  /// onAkkCredited is called AFTER minting with (owner, newAkkBalance) for side-effects
  /// like tribe stat updates (only used in non-ledger / draft mode).
  /// Returns true when mining just resumed after a pause (lastBlockWasEmpty transitioned
  /// from true to false), signalling main.mo to reset the 690s block timer from now.
  public func processBlock(
    state : State,
    mintAkk : ?((Principal, Nat, Nat) -> async ()),
    onAkkCredited : ?((Principal, Nat) -> ()),
  ) : async Bool {
    let ic : actor { raw_rand : () -> async Blob } = actor "aaaaa-aa";
    let now = Time.now();
    // Collect active miners and compute GRIT to spend this block
    // gritToSpend = rate * BLOCK_SECONDS / 86400
    let activeMinerIds = state.miners.keys().filter(func(id : Nat) : Bool {
      switch (state.miners.get(id)) {
        case (?m) m.status == #active;
        case null false;
      };
    }).toArray();

    // Track (minerId, gritSpent) for weight calculation
    var totalGritSpent : Nat = 0;
    let spends = List.empty<(Nat, Nat)>(); // (minerId, gritSpent)

    for (id in activeMinerIds.values()) {
      switch (state.miners.get(id)) {
        case null {};
        case (?miner) {
          let gritToSpend = miner.miningRate * BLOCK_SECONDS / 86400;
          let actualSpend = if (miner.gritBalance >= gritToSpend) {
            miner.gritBalance -= gritToSpend;
            gritToSpend;
          } else {
            let all = miner.gritBalance;
            miner.gritBalance := 0;
            miner.status := #exhausted;
            all;
          };
          if (actualSpend > 0) {
            spends.add((id, actualSpend));
            totalGritSpent += actualSpend;
            // Track per-miner GRIT spent
            miner.gritSpent += actualSpend;
            // Track per-user GRIT spent
            let prevGrit : Nat = switch (state.gritSpentByUser.get(miner.owner)) {
              case null 0;
              case (?n) n;
            };
            state.gritSpentByUser.add(miner.owner, prevGrit + actualSpend);
          };
          miner.lastProcessedBlock := state.blockNumber;
        };
      };
    };

    // If no GRIT was spent this block, mark as empty and skip block creation
    if (totalGritSpent == 0) {
      state.lastBlockWasEmpty := true;
      return false;
    };

    // Mining is active this block. If the previous block was empty (mining was paused),
    // return true so main.mo can reset the 690s timer from now.
    var timerReset = false;
    if (state.lastBlockWasEmpty) {
      state.lastBlockWasEmpty := false;
      timerReset := true;
    };

    // Capture the block number NOW — before any await — so the dedup key is stable
    // even if a concurrent runBlockCycle call increments state.blockNumber.
    let thisBlockId = state.blockNumber;
    let reward = blockReward(thisBlockId, state.totalAkkMined);
    var winnerMinerId : ?Nat = null;
    var winnerOwner : ?Principal = null;
    var randVal : Nat64 = 0;

    if (reward > 0) {
      // Get VRF randomness
      let randBytes = await ic.raw_rand();
      let bytes = randBytes.toArray();
      // Convert first 8 bytes to Nat64
      var byteIdx = 0;
      while (byteIdx < 8 and byteIdx < bytes.size()) {
        randVal := (randVal * 256) + Nat64.fromNat(bytes[byteIdx].toNat());
        byteIdx += 1;
      };
      let maxU64 : Nat = 18_446_744_073_709_551_616; // 2^64
      let randNat = randVal.toNat();

      var cumulative : Nat = 0;
      label found for ((mid, spent) in spends.values()) {
        cumulative += spent;
        if (randNat * totalGritSpent < cumulative * maxU64) {
          winnerMinerId := ?mid;
          switch (state.miners.get(mid)) {
            case (?m) {
              winnerOwner := ?m.owner;
              m.blocksMined += 1;
            };
            case null {};
          };
          // Credit AKK to winner
          switch (winnerOwner) {
            case null {};
            case (?owner) {
              // Always update global totals
              state.totalAkkMined += reward;
              let prevWon : Nat = switch (state.totalAkkWonByUser.get(owner)) {
                case null 0;
                case (?n) n;
              };
              state.totalAkkWonByUser.add(owner, prevWon + reward);
              // Mint via injected callback (ledger or internal map)
              // Pass thisBlockId (captured before await) so the callee can use it
              // as a stable dedup key regardless of later state.blockNumber mutations.
              switch (mintAkk) {
                case null {
                  // Default: update internal balance map
                  let prev = switch (state.akkBalances.get(owner)) {
                    case null 0;
                    case (?b) b;
                  };
                  let newAkkBalance = prev + reward;
                  state.akkBalances.add(owner, newAkkBalance);
                  switch (onAkkCredited) {
                    case null {};
                    case (?cb) cb(owner, newAkkBalance);
                  };
                };
                case (?mint) {
                  await mint(owner, reward, thisBlockId);
                };
              };
            };
          };
          break found;
        };
      };
    };

    // Build per-miner participant arrays for block detail record
    let participantPairs = List.empty<(Nat, Principal)>();
    let gritSpentPairs = List.empty<(Nat, Nat)>();
    let weightPairs = List.empty<(Nat, Float)>();
    for ((mid, spent) in spends.values()) {
      switch (state.miners.get(mid)) {
        case (?m) {
          participantPairs.add((mid, m.owner));
          gritSpentPairs.add((mid, spent));
          let weight : Float = if (totalGritSpent > 0) {
            spent.toFloat() / totalGritSpent.toFloat()
          } else 0.0;
          weightPairs.add((mid, weight));
        };
        case null {};
      };
    };

    // Record block
    let record : MiningTypes.BlockRecord = {
      blockNumber       = state.blockNumber;
      timestamp         = now;
      winnerMinerId     = winnerMinerId;
      winnerOwner       = winnerOwner;
      akkReward         = reward;
      totalGritSpent    = totalGritSpent;
      minerParticipants = participantPairs.toArray();
      minerGritSpent    = gritSpentPairs.toArray();
      minerWeights      = weightPairs.toArray();
      vrfValue          = randVal;
    };
    state.blockHistory.add(record);
    state.blockNumber += 1;
    timerReset;
  };

  /// Return current block info (block number, last block time, seconds until next).
  /// Return current block info including whether mining is currently active.
  public func getCurrentBlockInfo(state : State) : {
    blockNumber : Nat;
    lastBlockTime : Int;
    nextBlockIn : Nat;
    isMiningActive : Bool;
  } {
    // Mining is active when at least one miner has status #active AND has GRIT balance > 0
    let isMiningActive = switch (
      state.miners.values().find(
        func(m : MiningTypes.MinerRecord) : Bool {
          m.status == #active and m.gritBalance > 0
        }
      )
    ) {
      case (?_) true;
      case null false;
    };

    // When mining is not active, return nextBlockIn = 0 (paused sentinel)
    if (not isMiningActive) {
      return {
        blockNumber    = state.blockNumber;
        lastBlockTime  = 0;
        nextBlockIn    = 0;
        isMiningActive = false;
      };
    };

    let lastBlockTime : Int = switch (state.blockHistory.last()) {
      case null 0;
      case (?r) r.timestamp;
    };
    let nowSecs : Int = Time.now() / 1_000_000_000;
    let lastSecs : Int = lastBlockTime / 1_000_000_000;
    let elapsed = nowSecs - lastSecs;
    let nextBlockIn : Nat = if (elapsed >= BLOCK_SECONDS.toInt()) {
      0
    } else {
      Int.abs(BLOCK_SECONDS.toInt() - elapsed);
    };
    { blockNumber = state.blockNumber; lastBlockTime; nextBlockIn; isMiningActive };
  };

  /// Update miner creation fees (admin only — caller validation done in the mixin).
  /// Update miner creation fee for a single chain (admin only — caller validation done in the mixin).
  public func setMinerCreationFee(state : State, chain : Text, feeWei : Nat) : () {
    state.minerCreationFees.add(chain, feeWei);
  };

  /// Return current miner creation fees as an immutable view.
  /// Return current miner creation fees for all chains that have at least one allowlisted token.
  /// Chains in the allowlist but without an explicit fee entry return 0.
  public func getMinerCreationFees(
    state : State,
    allowlistTokens : [{ chain : Text }],
  ) : [ChainFeeEntry] {
    let seen = Map.empty<Text, Bool>();
    let result = List.empty<ChainFeeEntry>();
    for (t in allowlistTokens.values()) {
      if (seen.get(t.chain) == null) {
        seen.add(t.chain, true);
        let feeWei : Nat = switch (state.minerCreationFees.get(t.chain)) {
          case null 0;
          case (?f) f;
        };
        result.add({ chain = t.chain; feeWei });
      };
    };
    result.toArray();
  };

  /// Return the most recent `limit` block records (most recent first).
  /// Return the most recent `limit` block records (most recent first).
  public func getBlockHistory(state : State, limit : Nat) : [BlockRecord] {
    let sz = state.blockHistory.size();
    let count = Nat.min(limit, sz);
    if (count == 0) { return [] };
    // blockHistory stores blocks in insertion order (oldest at index 0, newest at end).
    // reverseValues() iterates newest-first; take(count) gives the most recent `count` entries.
    state.blockHistory.reverseValues().take(count).toArray();
  };

  /// Return a page of block records, most recent first.
  /// page=0 → newest pageSize records, page=1 → next pageSize, etc.
  /// Return a page of block records, most recent first.
  /// page=0 → newest pageSize records, page=1 → next pageSize, etc.
  public func getBlockHistoryPage(state : State, page : Nat, pageSize : Nat) : [BlockRecord] {
    if (pageSize == 0) { return [] };
    let sz = state.blockHistory.size();
    if (sz == 0) { return [] };
    // blockHistory stores blocks with newest at the end (List.add appends).
    // We iterate newest-first by reversing, then drop the items already shown
    // in previous pages and take at most pageSize items.
    // page 0 -> items [0 .. pageSize-1] (newest pageSize blocks)
    // page 1 -> items [pageSize .. 2*pageSize-1], etc.
    let skip = page * pageSize;
    if (skip >= sz) { return [] };
    state.blockHistory.reverseValues().drop(skip).take(pageSize).toArray();
  };

  /// Return the total number of block records stored.
  public func getTotalBlockCount(state : State) : Nat {
    state.blockHistory.size();
  };
  /// Add a MintRetryEntry to the pending queue.
  public func enqueueMint(state : State, entry : MintRetryEntry) {
    state.pendingMints.add(entry);
  };

  /// Return all pending mint entries as immutable views.
  public func getPendingMints(state : State) : [MintRetryView] {
    state.pendingMints.map<MintRetryEntry, MintRetryView>(func(e) {
      { blockId = e.blockId; minerId = e.minerId; owner = e.owner; amount = e.amount;
        attempts = e.attempts; lastAttemptTime = e.lastAttemptTime; error = e.error }
    }).toArray();
  };

  /// Return all abandoned mint entries as immutable views.
  public func getAbandonedMints(state : State) : [MintRetryView] {
    state.abandonedMints.map<MintRetryEntry, MintRetryView>(func(e) {
      { blockId = e.blockId; minerId = e.minerId; owner = e.owner; amount = e.amount;
        attempts = e.attempts; lastAttemptTime = e.lastAttemptTime; error = e.error }
    }).toArray();
  };

  /// Return aggregate mint retry stats.
  public func getMintRetryStats(state : State) : { queueDepth : Nat; totalRetried : Nat; totalSucceeded : Nat; totalAbandoned : Nat } {
    {
      queueDepth     = state.pendingMints.size();
      totalRetried   = state.totalMintRetried;
      totalSucceeded = state.totalMintSucceeded;
      totalAbandoned = state.totalMintAbandoned;
    };
  };

  /// Drain the pending mint queue: retry each entry; on success remove it and decrement
  /// the internal AKK buffer; on failure increment attempts or move to abandonedMints.
  /// tryMint is a closure supplied by main.mo that attempts a real ledger mint.
  /// Returns the number of entries successfully drained.
  public func drainPendingMints(
    state   : State,
    tryMint : (Principal, Nat, Nat) -> async Bool,
  ) : async Nat {
    var drained : Nat = 0;
    // Collect entries to process (snapshot before mutation)
    let toRetry = state.pendingMints.toArray();
    for (entry in toRetry.values()) {
      // Skip if already minted
      if (state.mintedBlockIds.contains(entry.blockId)) {
        // Remove from queue without retry — rebuild without this blockId
        let without = state.pendingMints.filter(func(e : MintRetryEntry) : Bool { e.blockId != entry.blockId });
        state.pendingMints.clear();
        for (e in without.values()) { state.pendingMints.add(e) };
        drained += 1;
      } else if (entry.attempts >= MAX_MINT_ATTEMPTS) {
        // Abandon — remove from pending and move to abandonedMints
        let without = state.pendingMints.filter(func(e : MintRetryEntry) : Bool { e.blockId != entry.blockId });
        state.pendingMints.clear();
        for (e in without.values()) { state.pendingMints.add(e) };
        state.abandonedMints.add(entry);
        state.totalMintAbandoned += 1;
      } else {
        let success = await tryMint(entry.owner, entry.amount, entry.blockId);
        entry.attempts += 1;
        entry.lastAttemptTime := Time.now();
        state.totalMintRetried += 1;
        if (success) {
          state.mintedBlockIds.add(entry.blockId);
          // Remove the internal buffer credit now that ledger is authoritative
          let bufBal = switch (state.akkBalances.get(entry.owner)) {
            case null 0; case (?b) b; };
          let newBal = if (bufBal >= entry.amount) { bufBal - entry.amount } else { 0 };
          state.akkBalances.add(entry.owner, newBal);
          let without = state.pendingMints.filter(func(e : MintRetryEntry) : Bool { e.blockId != entry.blockId });
          state.pendingMints.clear();
          for (e in without.values()) { state.pendingMints.add(e) };
          state.totalMintSucceeded += 1;
          drained += 1;
        } else {
          entry.error := "Retry " # entry.attempts.toText() # " failed";
        };
      };
    };
    drained;
  };

};
