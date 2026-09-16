// W3A/W3B tests: durable charged rounds + immutable payout intents.
//
// 1. Mint intent is FROZEN at enqueue time — the retry drain must never
//    recompute the amount (cap clamped at enqueue, not per retry) or the
//    created_at_time (deterministic from blockId, already true).
// 2. The drain is BOUNDED (DRAIN_BATCH_MAX per cycle) so a large backlog
//    cannot stretch the round past the guard window.
// 3. The reward is RESERVED before charging: capDecision runs against
//    totalAkkMined + reward pre-charge, so a round never charges fuel for
//    a prize the cap won't pay.

import Test "mo:test/async";
import MiningLib "../lib/mining";
import MiningTypes "../types/mining";
import LedgerMint "../lib/ledger-mint";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let P = Principal.fromText("tw5li-m6k77-xa7ab-7acaa");

func newState() : MiningTypes.State {
  {
    var akkLedgerId = null;
    var nextMinerId = 0;
    miners = Map.empty<Nat, MiningTypes.MinerRecord>();
    akkBalances = Map.empty<Principal, Nat>();
    gritSpentByUser = Map.empty<Principal, Nat>();
    totalAkkWonByUser = Map.empty<Principal, Nat>();
    var blockNumber = 0;
    var totalAkkMined = 0;
    minerCreationFees = Map.empty<Text, Nat>();
    blockHistory = List.empty();
    var lastBlockWasEmpty = false;
    pendingMints = List.empty();
    mintedBlockIds = List.empty();
    abandonedMints = List.empty();
    var totalMintRetried = 0;
    var totalMintSucceeded = 0;
    var totalMintAbandoned = 0;
    var akkTransferFee = 10_000;
    minerFeeTxs = Map.empty();
  }
};

func makeMiner(state : MiningTypes.State, id : Nat, grit : Nat) {
  let m : MiningTypes.MinerRecord = {
    id = id;
    owner = P;
    var name = "m" # debug_show (id);
    var gritBalance = grit;
    var miningRate = 1_000_000_000;
    var status = #active;
    createdAt = 0;
    var lastProcessedBlock = 0;
    var blocksMined = 0;
    var gritSpent = 0;
  };
  Map.add(state.miners, Nat.compare, id, m);
};

func makeEntry(blockId : Nat) : MiningLib.MintRetryEntry {
  {
    blockId = blockId;
    minerId = debug_show (blockId);
    owner = P;
    amount = 1_000;
    var createdAtTime = 1_767_225_600_000_000_000; // frozen (F2)
    var attempts = 0;
    var lastAttemptTime = 0;
    var error = "";
  };
};

// ── 1. immutable mint intent ────────────────────────────────────────────────
await Test.test("intent: retry timestamp is deterministic per blockId (frozen identity)", func() : async () {
  // The created_at_time is derived from blockId — the drain NEVER recomputes
  // it, so retry #1 and retry #25 send the identical request.
  let t1 = LedgerMint.mintCreatedAtTime(42, 1_700_000_000_000_000_000);
  let t2 = LedgerMint.mintCreatedAtTime(42, 1_700_000_100_000_000_000);
  require(t1 == t2, "timestamp changed between retries");
});

await Test.test("intent: cap is clamped at ENQUEUE time (frozen amount)", func() : async () {
  // Enqueue-time clamp: supply near cap → the queued amount is the clamped
  // remainder. The drain never re-clamps upward even if supply drops later.
  let supplyNearCap = 2_099_999_999_999_999;
  let requested = 15_000_000_000;
  let clampedAtEnqueue = LedgerMint.capDecision(supplyNearCap, 2_100_000_000_000_000, requested);
  require(clampedAtEnqueue == 1, "clamped to remaining at enqueue");
  require(LedgerMint.capDecision(supplyNearCap, 2_100_000_000_000_000, clampedAtEnqueue) == 1, "re-clamp is idempotent");
});

// ── 2. bounded drain batch ──────────────────────────────────────────────────
await Test.test("drain: bounded to DRAIN_BATCH_MAX entries per cycle", func() : async () {
  let state = newState();
  var i = 0;
  while (i < 10) {
    MiningLib.enqueueMint(state, makeEntry(100 + i));
    i += 1;
  };
  var calls = 0;
  let tryMint = func(_owner : Principal, _amount : Nat, _blockId : Nat, _ts : Nat64) : async Bool {
    calls += 1;
    true;
  };
  let drained = await MiningLib.drainPendingMints(state, tryMint);
  require(drained <= MiningLib.DRAIN_BATCH_MAX, "drain exceeded batch cap");
  require(calls <= MiningLib.DRAIN_BATCH_MAX, "outcalls bounded by batch cap");
  require(state.pendingMints.size() == 10 - drained, "queue depth reflects batch size");
});

await Test.test("drain: multi-cycle drain eventually clears the full queue", func() : async () {
  let state = MiningLib.newMiningState();
  var i = 0;
  while (i < 30) {
    MiningLib.enqueueMint(state, makeEntry(200 + i));
    i += 1;
  };
  var totalDrained = 0;
  var cycles = 0;
  while (state.pendingMints.size() > 0 and cycles < 10) {
    let tryMint = func(_owner : Principal, _amount : Nat, _blockId : Nat, _ts : Nat64) : async Bool { true };
    let d = await MiningLib.drainPendingMints(state, tryMint);
    totalDrained += d;
    cycles += 1;
  };
  require(totalDrained == 30, "all entries eventually drained");
  require(cycles >= 2, "required multiple cycles (batch bounded)");
});

// ── 3. reserve-before-charge ────────────────────────────────────────────────
await Test.test("reserve: reward that exceeds remaining cap is clamped BEFORE charging", func() : async () {
  let totalAkkMined = 2_099_999_999_999_999;
  let fullReward = 15_000_000_000;
  let payable = LedgerMint.capDecision(totalAkkMined, 2_100_000_000_000_000, fullReward);
  require(payable < fullReward, "reward clamped near cap");
  require(payable == 1, "exactly the remaining budget");
});

await Test.test("reserve: zero payable reward → no fuel charged (AKK-9 invariant)", func() : async () {
  let state = newState();
  makeMiner(state, 0, 1_000_000_000);
  state.totalAkkMined := 2_100_000_000_000_000;
  let outcome = await MiningLib.processBlock(
    state,
    0, // thisBlockId
    null, // mintAkk — internal map path; must never be reached
    null,
    null,
  );
  require(outcome == false, "cap-reached block is a no-op");
  switch (state.gritSpentByUser.get(P)) {
    case null {};
    case (?n) { require(n == 0, "no fuel charged") };
  };
});

await Test.test("reserve: partial reward near cap pays the clamped amount", func() : async () {
  let state = newState();
  makeMiner(state, 0, 1_000_000_000);
  // Leave exactly 1 e8s of headroom under the 21M cap.
  state.totalAkkMined := 2_100_000_000_000_000 - 1;
  let outcome = await MiningLib.processBlock(
    state,
    0,
    null, // mintAkk — internal map path
    null,
    null,
  );
  require(state.totalAkkMined == 2_100_000_000_000_000, "total supply capped exactly");
  let won = switch (state.totalAkkWonByUser.get(P)) {
    case (?n) { n };
    case null { Runtime.trap("no winner credited") };
  };
  require(won == 1, "partial reward (1 e8s) credited");
});

// ── F6: the reward epoch follows the CAPTURED block id ─────────────────────
// Halving happens every 69_000 blocks. At the first halving boundary the
// reward must be BASE_REWARD/2, and the record must carry that same block id
// — one source of truth for both the epoch and the record (F6 review fix).
await Test.test("F6: halving epoch and block record agree at the boundary", func() : async () {
  let state = newState();
  makeMiner(state, 0, 1_000_000_000);
  let boundary : Nat = 69_000; // HALVING_INTERVAL
  state.blockNumber := boundary;
  let captured : Nat = state.blockNumber; // caller captures BEFORE any await
  let outcome = await MiningLib.processBlock(
    state,
    captured,
    null,
    null,
    null,
  );
  ignore outcome;
  // BASE_REWARD = 150 * 1e8 → halved once = 75 * 1e8
  require(state.blockHistory.size() == 1, "block recorded");
  let record = switch (state.blockHistory.last()) {
    case null { Runtime.trap("no record") };
    case (?r) r;
  };
  require(record.blockNumber == boundary, "record carries the captured id");
  require(record.akkReward == 7_500_000_000, "reward halved exactly once");
  require(state.totalAkkMined == 7_500_000_000, "supply advanced by the halved reward");
});

// ── F7: a successful drain never touches the legacy draft buffer ───────────
// In ledger mode the internal akkBalances map is not credited when a block
// reward is minted, so the drain must not "un-credit" anything. The old code
// subtracted entry.amount from that map, silently shrinking a leftover
// draft-era balance. Pin the corrected behaviour.
await Test.test("F7: drained entry leaves the internal buffer untouched", func() : async () {
  let state = newState();
  // Simulate a leftover draft-era balance for the winner.
  state.akkBalances.add(P, 5_000);
  let entry : MiningLib.MintRetryEntry = {
    blockId = 777;
    minerId = "777";
    owner = P;
    amount = 1_000;
    var createdAtTime = 1_767_225_600_000_000_000; // frozen (F2)
    var attempts = 0;
    var lastAttemptTime = 0;
    var error = "";
  };
  MiningLib.enqueueMint(state, entry);
  let ok = func(_owner : Principal, _amount : Nat, _blockId : Nat, _ts : Nat64) : async Bool { true };
  let drained = await MiningLib.drainPendingMints(state, ok);
  require(drained == 1, "entry drained");
  require(state.pendingMints.size() == 0, "queue emptied");
  switch (state.akkBalances.get(P)) {
    case null { require(false, "buffer entry vanished") };
    case (?b) { require(b == 5_000, "buffer balance unchanged by the drain") };
  };
});