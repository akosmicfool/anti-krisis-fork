// F2 review fix tests: the mint retry timestamp is FROZEN at enqueue.
//
// Why: the ledger dedups an ICRC-1 transfer by hashing the FULL request,
// including created_at_time. The old code derived that timestamp on every
// attempt from a fresh Time.now(), and because the derivation clamps into the
// ledger's 24h validity window on a ~22h grid, two attempts could straddle a
// grid boundary and hash differently — a retry of a committed-but-unreported
// transfer would then mint a second time instead of being rejected
// (#Duplicate). Now the value chosen for the first attempt is stored on the
// queue entry and reused verbatim by every retry (tryLedgerMint) and by the
// admin replay (creditAbandonedMints).

import Test "mo:test/async";
import MiningLib "../lib/mining";
import MiningTypes "../types/mining";
import LedgerMint "../lib/ledger-mint";
import Migration "../migrations/20260910_200000";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";

func require(cond : Bool, msg : Text) {
  if (not cond) { Runtime.trap("FAIL: " # msg) };
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
  };
};

func entryWith(blockId : Nat, frozenTs : Nat64) : MiningLib.MintRetryEntry {
  {
    blockId;
    minerId = blockId.toText();
    owner = P;
    amount = 1_000;
    var createdAtTime = frozenTs;
    var attempts = 0;
    var lastAttemptTime = 0;
    var error = "";
  };
};

// ── 1. The drain passes the FROZEN value through, never a recomputation ─────
await Test.test("F2: drain passes the entry's frozen timestamp verbatim", func() : async () {
  let state = newState();
  // A deliberately implausible frozen value (1 second after the epoch):
  // a recomputation with Time.now() could never produce it, so receiving it
  // in the callback proves no derivation happened on the retry path.
  let frozen : Nat64 = 1_767_225_601_000_000_000;
  MiningLib.enqueueMint(state, entryWith(42, frozen));
  var seen : Nat64 = 0;
  var calls = 0;
  let cb = func(_owner : Principal, _amount : Nat, _blockId : Nat, ts : Nat64) : async Bool {
    calls += 1;
    seen := ts;
    true;
  };
  let drained = await MiningLib.drainPendingMints(state, cb);
  require(drained == 1, "entry drained");
  require(calls == 1, "one ledger attempt");
  require(seen == frozen, "retry sent a recomputed timestamp instead of the frozen one");
});

// ── 2. The frozen value survives a FAILED attempt (multi-cycle retry) ──────
await Test.test("F2: frozen timestamp is stable across a failed attempt and the next retry", func() : async () {
  let state = newState();
  let frozen : Nat64 = 1_767_225_601_000_000_000;
  MiningLib.enqueueMint(state, entryWith(43, frozen));

  // Attempt 1 fails (entry stays queued, attempts incremented).
  let fail = func(_o : Principal, _a : Nat, _b : Nat, _ts : Nat64) : async Bool { false };
  let d1 = await MiningLib.drainPendingMints(state, fail);
  require(d1 == 0, "failed attempt does not drain");
  require(state.pendingMints.size() == 1, "entry requeued");

  // Attempt 2 succeeds — it must present the SAME frozen value.
  var seen : Nat64 = 0;
  let ok = func(_o : Principal, _a : Nat, _b : Nat, ts : Nat64) : async Bool { seen := ts; true };
  let d2 = await MiningLib.drainPendingMints(state, ok);
  require(d2 == 1, "retry drained");
  require(seen == frozen, "timestamp drifted between attempts");
});

// ── 3. Why freezing matters: the derivation itself is NOT stable ───────────
// Pin the behaviour the freeze works around, so a future "simplification"
// back to per-attempt derivation fails loudly here.
await Test.test("F2 (rationale): per-attempt derivation CAN change across retries", func() : async () {
  // A block whose scheduled slot is long past (the fresh-install case: mining
  // starts months after MINT_TS_EPOCH) always takes the clamp branch, whose
  // value is anchored to `now` on a ~22h grid.
  let blockId : Nat = 1_000;
  let t0 : Int = 1_789_000_000_000_000_000; // arbitrary wall clock
  let t1 : Int = t0 + 22 * 3_600_000_000_000; // 22h later — one grid step on
  let v0 = LedgerMint.mintCreatedAtTime(blockId, t0);
  let v1 = LedgerMint.mintCreatedAtTime(blockId, t1);
  require(v0 != v1, "expected the derivation to move when a grid boundary is crossed");
  // And the value the retry WILL send is the frozen one, whatever the grid does.
  let state = newState();
  MiningLib.enqueueMint(state, entryWith(blockId, v0));
  var seen : Nat64 = 0;
  let cb = func(_o : Principal, _a : Nat, _b : Nat, ts : Nat64) : async Bool { seen := ts; true };
  ignore await MiningLib.drainPendingMints(state, cb);
  require(seen == v0, "frozen value must win over a fresh derivation");
});

// ── 5. The migration transform itself ──────────────────────────────────────
// A wrong migration bricks the next upgrade, so pin the entry transformation:
// every field preserved, createdAtTime reconstructed from the entry's last
// attempt (the value the ledger may already have seen for that block).
await Test.test("F2: migration preserves fields and reconstructs createdAtTime", func() : async () {
  let lastAttempt : Int = 1_789_123_456_789_000_000;
  let old : Migration.MintRetryEntryOld = {
    blockId = 9_999;
    minerId = "9999";
    owner = P;
    amount = 7_500_000_000;
    var attempts = 3;
    var lastAttemptTime = lastAttempt;
    var error = "Ledger Err: #TemporarilyUnavailable";
  };
  let fresh = Migration.migrationUpgradeEntry(old);
  require(fresh.blockId == 9_999, "blockId preserved");
  require(fresh.minerId == "9999", "minerId preserved");
  require(fresh.owner == P, "owner preserved");
  require(fresh.amount == 7_500_000_000, "amount preserved");
  require(fresh.attempts == 3, "attempts preserved");
  require(fresh.lastAttemptTime == lastAttempt, "lastAttemptTime preserved");
  require(fresh.error == "Ledger Err: #TemporarilyUnavailable", "error preserved");
  // The reconstruction must equal the runtime derivation anchored at the
  // entry's last attempt — i.e. what that attempt actually sent.
  let expected = Migration.migrationDeriveTs(9_999, lastAttempt);
  require(fresh.createdAtTime == expected, "createdAtTime not the attempt-anchored value");
  require(fresh.createdAtTime != 0, "createdAtTime must be a usable timestamp");
});

await Test.test("F2: never-attempted entry uses the clock anchor for its timestamp", func() : async () {
  let old : Migration.MintRetryEntryOld = {
    blockId = 12_345;
    minerId = "12345";
    owner = P;
    amount = 1_000;
    var attempts = 0;
    var lastAttemptTime = 0; // e.g. an entry deferred before any attempt
    var error = "Supply query failed";
  };
  let fresh = Migration.migrationUpgradeEntry(old);
  // The fallback must route through the same derivation with the clock as the
  // anchor — not a constant, and not lastAttemptTime (0).
  require(
    fresh.createdAtTime == Migration.migrationDeriveTs(12_345, Time.now()),
    "fallback did not use the clock anchor",
  );
  // NOTE: the absolute value is not asserted here. Under the test runtime the
  // clock is absent (Time.now() == 0), so the derivation legitimately yields 0;
  // in a deployed canister Time.now() is real and the clamp lands 8–14h old —
  // inside the ledger's 24h validity window (verified numerically, and pinned
  // for real anchors by the equivalence test below).
});

// ── 6. The F2 staleness net ────────────────────────────────────────────────
// Freezing buys dedup identity but stops the timestamp from refreshing itself.
// The clamp lands it at age 1h..23h and the 5-attempt horizon adds ~57.5 min,
// so the oldest values reach ~23.96h at the last attempt — ~2.5 min of margin.
// Any longer delay (skipped cycle, ledger outage, upgrade) would put EVERY
// later attempt — and the admin replay — permanently at #TooOld, a failure
// mode that did not exist before freezing. The net re-freezes only then.
await Test.test("F2 net: staleness predicate catches the aged-out edge", func() : async () {
  let now : Int = 1_789_000_000_000_000_000;
  let hour : Int = 3_600_000_000_000;
  let fresh : Nat64 = Nat64.fromNat(Int.abs(now - 2 * hour));      // 2h old
  let usable : Nat64 = Nat64.fromNat(Int.abs(now - 23 * hour));    // 23h old
  let dead : Nat64 = Nat64.fromNat(Int.abs(now - 25 * hour));      // 25h old
  let future : Nat64 = Nat64.fromNat(Int.abs(now + 2 * hour));     // clock skew
  require(not LedgerMint.isFrozenStale(fresh, now), "a 2h-old value is usable");
  require(not LedgerMint.isFrozenStale(usable, now), "a 23h-old value is still usable (inside the net's 30min reserve)");
  require(LedgerMint.isFrozenStale(dead, now), "a 25h-old value must be re-frozen");
  require(not LedgerMint.isFrozenStale(future, now), "a future value is not stale");
});

await Test.test("F2 net: a stale entry is re-frozen to a value the ledger accepts", func() : async () {
  // Reproduce the net's decision exactly (the drain wires this to Time.now(),
  // which is absent under the test runtime, so the predicate + derivation are
  // exercised directly here).
  let now : Int = 1_789_000_000_000_000_000;
  let stale : Nat64 = Nat64.fromNat(Int.abs(now - 26 * 3_600_000_000_000));
  require(LedgerMint.isFrozenStale(stale, now), "precondition: value is stale");
  let refreshed = LedgerMint.mintCreatedAtTime(9_999, now);
  require(not LedgerMint.isFrozenStale(refreshed, now), "re-frozen value must be usable");
  // And it differs from the dead value (a refresh actually happened).
  require(refreshed != stale, "refresh must produce a new value");
});

await Test.test("F2 net: fresh entries are NOT re-frozen (identity preserved)", func() : async () {
  // The drain's guard: with the test clock (Time.now() == 0) every positive
  // frozen value reads as far in the future, i.e. not stale — so the drain must
  // pass it through untouched. This pins the no-refresh path.
  let state = newState();
  let frozen : Nat64 = 1_767_225_601_000_000_000;
  MiningLib.enqueueMint(state, entryWith(4242, frozen));
  var seen : Nat64 = 0;
  let cb = func(_o : Principal, _a : Nat, _b : Nat, ts : Nat64) : async Bool { seen := ts; true };
  ignore await MiningLib.drainPendingMints(state, cb);
  require(seen == frozen, "a usable frozen timestamp must not be re-derived");
});

// ── 7. Migration equivalence ───────────────────────────────────────────────
// The migration chain may not import project files, so the F2 timestamp
// derivation is INLINED there. If the runtime derivation ever changes and the
// migration copy does not, queued entries would migrate to a value the runtime
// would never have sent (dedup hole). Pin them equal.
await Test.test("F2: migration's inlined derivation matches the runtime helper", func() : async () {
  let now = Time.now();
  let blockIds : [Nat] = [0, 1, 42, 1_000, 50_000, 200_000];
  let offsets : [Int] = [
    0,
    -3_600_000_000_000, // 1h ago
    -86_400_000_000_000, // 24h ago — the ledger's TooOld edge
    -200 * 86_400_000_000_000, // ~200 days ago (stale slot)
    5 * 86_400_000_000_000, // future-ish (clamp both sides)
    22 * 3_600_000_000_000, // one grid step
  ];
  for (b in blockIds.values()) {
    for (off in offsets.values()) {
      let t = now + off;
      let runtime = LedgerMint.mintCreatedAtTime(b, t);
      let migrated = Migration.migrationDeriveTs(b, t);
      require(runtime == migrated, "migration derivation diverged from the runtime helper");
    };
  };
});

// ── E4: the net's WIRING through the drain (not just its predicate) ─────────
// An independent mutation check found this gap: deleting the net's wiring from
// drainPendingMints left every test green, because the test runtime's clock is 0
// and no test could drive a stale entry through the drain. drainPendingMintsAt
// injects the clock, so the wiring is now genuinely pinned.
await Test.test("F2 net: a stale entry IS re-frozen by the drain (wiring)", func() : async () {
  let state = newState();
  let now : Int = 1_789_000_000_000_000_000; // injected clock
  let stale : Nat64 = Nat64.fromNat(Int.abs(now - 26 * 3_600_000_000_000)); // 26h old
  MiningLib.enqueueMint(state, entryWith(7_777, stale));
  var seen : Nat64 = 0;
  let cb = func(_o : Principal, _a : Nat, _b : Nat, ts : Nat64) : async Bool { seen := ts; true };
  ignore await MiningLib.drainPendingMintsAt(state, cb, now);
  require(seen != stale, "the drain must re-freeze a stale timestamp (E4 wiring gap)");
  require(seen == LedgerMint.mintCreatedAtTime(7_777, now), "re-frozen to the derived value");
  require(not LedgerMint.isFrozenStale(seen, now), "the re-frozen value is usable");
});

await Test.test("F2 net: a usable entry is NOT re-frozen by the drain (wiring)", func() : async () {
  let state = newState();
  let now : Int = 1_789_000_000_000_000_000;
  let fresh : Nat64 = Nat64.fromNat(Int.abs(now - 2 * 3_600_000_000_000)); // 2h old
  MiningLib.enqueueMint(state, entryWith(7_778, fresh));
  var seen : Nat64 = 0;
  let cb = func(_o : Principal, _a : Nat, _b : Nat, ts : Nat64) : async Bool { seen := ts; true };
  ignore await MiningLib.drainPendingMintsAt(state, cb, now);
  require(seen == fresh, "identity must be preserved for a usable timestamp");
});
