// AKK-7 unit tests: ledger-mint idempotency.
// The ICRC-1 ledger (icrc1-mo, transaction_window default = 24h — verified in
// .mops/icrc1-mo@0.2.1 lib.mo) dedups on the hash of the FULL transfer
// request, including created_at_time. Retry paths must send a DETERMINISTIC
// created_at_time per blockId so every retry hashes identically and the
// ledger's dedup rejects double mints. Because the window is finite, an old
// block's derived ts is clamped forward in whole window-steps — still
// deterministic per (blockId, step).
import Test "mo:test/async";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import LedgerMint "../lib/ledger-mint";

// Int → Nat64 with the same clamping semantics as the lib.
func toNat64(v : Int) : Nat64 {
  if (v <= 0) { return 0 };
  Nat64.fromNat(Int.abs(v));
};

// ── determinism ─────────────────────────────────────────────────────────────

await Test.test("same blockId + same now-ish → identical timestamp (determinism)", func() : async () {
  let a = LedgerMint.mintCreatedAtTime(12345, 1_788_000_000_000_000_000);
  let b = LedgerMint.mintCreatedAtTime(12345, 1_788_000_050_000_000_000);
  Test.expect.nat64(a).equal(b);
});

await Test.test("different RECENT blockIds → different timestamps", func() : async () {
  // Fresh (non-clamped) blocks map to distinct derived slots: pick a now
  // where blocks 1 and 2 are both inside the window (now ≥ block3's slot +
  // margin). Stale or future-derived blocks clamp to a shared window-aligned
  // value — safe, because the dedup hash separates blocks via memo
  // (blockId-encoded), not via ts.
  let now = LedgerMint.MINT_TS_EPOCH_NS + 12 * LedgerMint.BLOCK_SECONDS_NS;
  let a = LedgerMint.mintCreatedAtTime(1, now);
  let b = LedgerMint.mintCreatedAtTime(2, now);
  Test.expect.bool(a != b).isTrue();
});

// ── window-aware clamping ───────────────────────────────────────────────────

await Test.test("old block (Sep 2026 now, block 100): clamped forward, deterministic, inside window", func() : async () {
  let now : Int = 1_788_419_102_888_000_000; // Sep 3 2026
  let ts1 = LedgerMint.mintCreatedAtTime(100, now);
  let ts2 = LedgerMint.mintCreatedAtTime(100, now + 60_000_000_000); // +1 min
  Test.expect.nat64(ts1).equal(ts2); // deterministic across retries
  Test.expect.bool(Nat64.toNat(ts1) > Nat64.toNat(toNat64(now - 86_400_000_000_000))).isTrue();
});

await Test.test("very old block (block 50000): clamped forward, deterministic, inside window", func() : async () {
  let now : Int = 1_788_419_102_888_000_000;
  let t1 = LedgerMint.mintCreatedAtTime(50_000, now); // ≈ 400 days after epoch
  let t2 = LedgerMint.mintCreatedAtTime(50_000, now + 300_000_000_000); // +5 min
  Test.expect.nat64(t1).equal(t2);
  Test.expect.bool(Nat64.toNat(t1) > Nat64.toNat(toNat64(now - 86_400_000_000_000))).isTrue();
});

await Test.test("clamped ts never lands in the future", func() : async () {
  let now : Int = 1_788_419_102_888_000_000;
  let ts = LedgerMint.mintCreatedAtTime(100_000, now);
  Test.expect.bool(Nat64.toNat(ts) <= Nat64.toNat(toNat64(now))).isTrue();
});
