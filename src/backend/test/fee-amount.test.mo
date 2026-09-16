// AKK-10 unit tests: fee-AMOUNT verification math + FeePaid value decoding.
// Decoder and minimum-fee math are validated against REAL receipts from the
// 2026-09-03 incident (data words [64, value, 96, ...binding]: the value is
// the ABI-HEAD uint256 at word 1 — not the last word).
import Test "mo:test/async";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import FeeAmount "../lib/fee-amount";

func requireValue(r : ?Nat) : Nat {
  switch (r) {
    case (?v) v;
    case null { Runtime.trap("expected a decoded value, got null") };
  };
};

// ── feeBpsFromPercent ───────────────────────────────────────────────────────

await Test.test("0.69 percent becomes 69 basis points", func() : async () {
  Test.expect.nat(FeeAmount.feeBpsFromPercent(0.69)).equal(69);
});

await Test.test("1 percent becomes 100 basis points", func() : async () {
  Test.expect.nat(FeeAmount.feeBpsFromPercent(1.0)).equal(100);
});

await Test.test("0 percent becomes 0 basis points (check auto-passes)", func() : async () {
  Test.expect.nat(FeeAmount.feeBpsFromPercent(0.0)).equal(0);
});

// ── minimumFeeWei (native-price-aware) ──────────────────────────────────────

await Test.test("minimum fee converts USD at the native price", func() : async () {
  // $10 × 0.0069 × 0.93 = $0.06417 → at $2000/ETH = 3.2085e-5 ETH
  // = 3.2085e13 wei; float repr lands just below the boundary → ceil = 32_085_000_000_001
  Test.expect.nat(FeeAmount.minimumFeeWei(10.0, 69, 700, 2000.0)).equal(32_085_000_000_001);
});

await Test.test("minimum fee is zero when the native price is unavailable", func() : async () {
  Test.expect.nat(FeeAmount.minimumFeeWei(10.0, 69, 700, 0.0)).equal(0);
});

await Test.test("minimum fee is zero when usdValue is zero", func() : async () {
  Test.expect.nat(FeeAmount.minimumFeeWei(0.0, 69, 700, 2000.0)).equal(0);
});

await Test.test("minimum fee is zero when the fee is disabled", func() : async () {
  Test.expect.nat(FeeAmount.minimumFeeWei(10.0, 0, 700, 2000.0)).equal(0);
});

// ── decodeFeePaidValue (ABI-head layout, validated on real receipts) ───────

// 64-hex-char word helpers (padding verified: 64 chars each)
let W_OFFSET = "0000000000000000000000000000000000000000000000000000000000000040"; // dynamic offset marker 64
let W_ZERO   = "0000000000000000000000000000000000000000000000000000000000000000";
let W_ONE    = "0000000000000000000000000000000000000000000000000000000000000001";
let W_1E9    = "000000000000000000000000000000000000000000000000000000003B9ACA00"; // 0x3B9ACA00 = 1e9
let W_1E18   = "0000000000000000000000000000000000000000000000000DE0B6B3A7640000"; // 1e18 wei (0x0DE0B6B3A7640000; 48 zeros + 16 hex digits = 64 chars)
let W_96     = "0000000000000000000000000000000000000000000000000000000000000060"; // binding length 96

func dataWithWords(words : [Text]) : Text {
  var t = "0x";
  for (w in words.values()) { t #= w };
  t;
};

await Test.test("decodes value at word 1 from the real-fee layout [64, value, 96, binding...]", func() : async () {
  // Shape observed in every real claim-fee receipt (2026-09-03 incident).
  let data = dataWithWords([W_OFFSET, W_1E9, W_96, W_ZERO, W_ZERO, W_ZERO, W_ZERO, W_ZERO, W_ZERO]);
  Test.expect.nat(requireValue(FeeAmount.decodeFeePaidValue(data))).equal(1_000_000_000);
});

await Test.test("decodes 1e18 from a minimal head [64, value]", func() : async () {
  let data = dataWithWords([W_OFFSET, W_1E18]);
  Test.expect.nat(requireValue(FeeAmount.decodeFeePaidValue(data))).equal(1_000_000_000_000_000_000);
});

await Test.test("rejects data whose head word is not the 64-offset marker", func() : async () {
  let data = dataWithWords([W_ONE, W_ZERO, W_ZERO]);
  Test.expect.option(FeeAmount.decodeFeePaidValue(data), Nat.toText, Nat.equal).isNull();
});

await Test.test("rejects a lone head word with no value word", func() : async () {
  let data = dataWithWords([W_OFFSET]);
  Test.expect.option(FeeAmount.decodeFeePaidValue(data), Nat.toText, Nat.equal).isNull();
});

await Test.test("rejects data shorter than one word", func() : async () {
  Test.expect.option(FeeAmount.decodeFeePaidValue("0x1234"), Nat.toText, Nat.equal).isNull();
});

await Test.test("rejects non-hex payload", func() : async () {
  Test.expect.option(FeeAmount.decodeFeePaidValue(dataWithWords([W_OFFSET, "ZZZZZZZZZZZZZZZZ"])), Nat.toText, Nat.equal).isNull();
});

// ── W4 review fix (F1): the amount check must RUN for a zero payment ───────
// The bypass: the guard used `paid > 0` as a PRECONDITION, so a 0-value call
// to the collector (its fallback() emits FeePaid(..., msg.value) with no
// minimum, and a zero word decodes to ?0) skipped the check and still credited
// full GRIT. These pin the contract the call site now relies on: whenever a fee
// is actually due, a floor comes back — so `paid < floor` rejects 0.
await Test.test("F1: a positive floor is returned whenever a fee is due", func() : async () {
  let case1 = FeeAmount.amountCheckFloor(100.0, 69, 2400.0, 700);
  Test.expect.bool(case1 != null).isTrue();
  switch (case1) {
    case (?floor) {
      // The floor is strictly positive, so ANY zero payment fails the check.
      Test.expect.bool(floor > 0).isTrue();
      Test.expect.bool(0 < floor).isTrue(); // paid == 0 must be rejected
    };
    case null { Runtime.trap("FAIL: a due fee produced no floor (F1 regression)") };
  };
});

await Test.test("F1: the check is skipped only for the documented cases", func() : async () {
  // Unknown claim value → skip (documented fail-open)
  Test.expect.bool(FeeAmount.amountCheckFloor(0.0, 69, 2400.0, 700) == null).isTrue();
  // No fee configured → nothing is due
  Test.expect.bool(FeeAmount.amountCheckFloor(100.0, 0, 2400.0, 700) == null).isTrue();
  // Native price unavailable → skip (documented residual)
  Test.expect.bool(FeeAmount.amountCheckFloor(100.0, 69, 0.0, 700) == null).isTrue();
});

await Test.test("F1: one wei is rejected and the floor is scale-correct", func() : async () {
  let floor = switch (FeeAmount.amountCheckFloor(1_000.0, 69, 2_500.0, 700)) {
    case (?f) { f };
    case null { Runtime.trap("no floor") };
  };
  // 1 wei must always be under the floor (the smallest nonzero payment a
  // caller could make is still rejected), and a plain under-payment must be too.
  Test.expect.bool(1 < floor).isTrue();
  Test.expect.bool(1_000_000 < floor).isTrue(); // 0.000000000001 ETH is far below 0.69% of $1,000
});
