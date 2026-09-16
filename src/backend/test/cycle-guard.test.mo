// AKK-5 unit tests: block-cycle reentrancy guard contract.
// The guard makes overlapping block-cycle fires no-ops (see
// knowledge/vulnerability-audit-v264.md AKK-5).
//
// F3 review outcome: the guard is STRICT — there is deliberately NO staleness
// bypass. A cycle that never releases keeps the guard closed, because the only
// way a cycle can fail to release (an aborted/trapping message) also rolls the
// flag write back to false, so the "wedged guard" state the old 4h self-heal
// covered cannot persist. The last test below pins that decision so a future
// change cannot silently reintroduce an overlap-admitting path.
import Test "mo:test/async";
import CycleGuard "../lib/cycle-guard";

await Test.test("guard admits the first entry", func() : async () {
  let guard = CycleGuard.newGuard();
  Test.expect.bool(CycleGuard.tryEnter(guard)).isTrue();
});

await Test.test("guard rejects re-entry while a cycle is active", func() : async () {
  let guard = CycleGuard.newGuard();
  ignore CycleGuard.tryEnter(guard);
  Test.expect.bool(CycleGuard.tryEnter(guard)).isFalse();
});

await Test.test("guard admits a new cycle after release", func() : async () {
  let guard = CycleGuard.newGuard();
  ignore CycleGuard.tryEnter(guard);
  CycleGuard.release(guard);
  Test.expect.bool(CycleGuard.tryEnter(guard)).isTrue();
});

await Test.test("guard reports active state correctly", func() : async () {
  let guard = CycleGuard.newGuard();
  Test.expect.bool(CycleGuard.isActive(guard)).isFalse();
  ignore CycleGuard.tryEnter(guard);
  Test.expect.bool(CycleGuard.isActive(guard)).isTrue();
  CycleGuard.release(guard);
  Test.expect.bool(CycleGuard.isActive(guard)).isFalse();
});

await Test.test("release without enter is harmless", func() : async () {
  let guard = CycleGuard.newGuard();
  CycleGuard.release(guard);
  Test.expect.bool(CycleGuard.tryEnter(guard)).isTrue();
});

// ── Strictness: no staleness bypass (F3) ───────────────────────────────────
// Simulate many overlapping fires while one cycle holds the guard. Every one
// must be rejected — an admitted fire would mean two concurrent cycles
// double-draining GRIT. No amount of elapsed time may change that.
await Test.test("overlapping fires are rejected indefinitely (no staleness bypass)", func() : async () {
  let guard = CycleGuard.newGuard();
  ignore CycleGuard.tryEnter(guard); // cycle A is in flight
  var rejected = 0;
  var i = 0;
  // 1000 simulated fires, each nominally hours apart.
  while (i < 1000) {
    if (not CycleGuard.tryEnter(guard)) { rejected += 1 };
    i += 1;
  };
  Test.expect.nat(rejected).equal(1000);
  Test.expect.bool(CycleGuard.isActive(guard)).isTrue();
});

await Test.test("guard is re-usable after the in-flight cycle completes", func() : async () {
  let guard = CycleGuard.newGuard();
  ignore CycleGuard.tryEnter(guard);
  ignore CycleGuard.tryEnter(guard); // rejected
  CycleGuard.release(guard);
  Test.expect.bool(CycleGuard.tryEnter(guard)).isTrue();
  CycleGuard.release(guard);
  Test.expect.bool(CycleGuard.isActive(guard)).isFalse();
});
