// AKK-6 unit tests: 21M supply cap enforced on EVERY mint path.
// The primary mint clamps against icrc1_total_supply; the retry paths
// (drainPendingMints / tryLedgerMint) and creditAbandonedMints historically
// minted UNCAPPED, and the primary path proceeded UNCAPPED when the supply
// query threw. All paths must use one shared cap-clamp helper, and a failed
// supply query must defer to the retry queue rather than mint blind.
import Test "mo:test/async";
import LedgerMint "../lib/ledger-mint";

// ── clampToCap ──────────────────────────────────────────────────────────────

await Test.test("clamp: amount under remaining supply passes through", func() : async () {
  Test.expect.nat(LedgerMint.clampToCap(15_000_000_000, 1_000_000_000_000)).equal(15_000_000_000);
});

await Test.test("clamp: amount over remaining supply is reduced to remaining", func() : async () {
  Test.expect.nat(LedgerMint.clampToCap(15_000_000_000, 1_000)).equal(1_000);
});

await Test.test("clamp: zero remaining → zero (mint nothing)", func() : async () {
  Test.expect.nat(LedgerMint.clampToCap(15_000_000_000, 0)).equal(0);
});

// ── capDecision: the shared gate ────────────────────────────────────────────

await Test.test("capDecision: under cap → mint with full amount", func() : async () {
  Test.expect.nat(LedgerMint.capDecision(1_000_000, 100_000, 15_000_000_000)).equal(15_000_000_000);
});

await Test.test("capDecision: near cap → clamp to remaining", func() : async () {
  Test.expect.nat(LedgerMint.capDecision(2_099_999_999_999_999, 2_100_000_000_000_000, 15_000_000_000)).equal(1);
});

await Test.test("capDecision: at cap → mint zero", func() : async () {
  Test.expect.nat(LedgerMint.capDecision(2_100_000_000_000_000, 2_100_000_000_000_000, 15_000_000_000)).equal(0);
});

// ── mintCreatedAtTime (AKK-7 surface lives here too: shared call sites) ────

await Test.test("mint timestamp is deterministic per blockId", func() : async () {
  let a = LedgerMint.mintCreatedAtTime(7, 1_788_000_000_000_000_000);
  let b = LedgerMint.mintCreatedAtTime(7, 1_788_000_060_000_000_000);
  Test.expect.nat64(a).equal(b);
});