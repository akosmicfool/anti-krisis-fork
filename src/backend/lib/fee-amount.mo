// AKK-10: fee-AMOUNT verification.
//
// AKK-4/AKK-8 verify THAT a fee tx paid the collector and bind it to exactly
// one (claimant, burn) pair. This module adds the missing dimension: HOW MUCH
// was paid. The FeePaid event's data field is abi.encode(binding, value):
//   event FeePaid(address indexed payer, bytes binding, uint256 value);
//   data = [offset=0x40, value, bindingLen, ...binding tail]
// → the static uint256 `value` sits at ABI HEAD WORD 1 (see decodeFeePaidValue;
// VALIDATED AGAINST LIVE RECEIPTS 2026-09-03 — the "last word" reading was the
// production incident of that date, yielding binding-tail bytes ~1e77).
//
// Required fee = feePercent × usdValue(burn), priced by the BACKEND oracle —
// never the frontend's number. Because the fee is SIZED on the frontend price
// while we check against the oracle, the check carries a tolerance equal to
// the existing price-deviation gate (±6.9% → 700 bps). The USD requirement is
// converted to wei at the CURRENT native-token price (minimumFeeWei), since
// the fee is paid in the chain's native token. Below minFee → rejected as
// underpaid. A tolerance of 0 makes it an exact floor.

import Float "mo:core/Float";
import Int "mo:core/Int";

module {
  /// Default tolerance in basis points: 700 = 7% — mirrors the frontend-price
  /// deviation gate (6.9% + margin). The frontend fee is sized on the frontend
  /// price; the backend checks against the oracle price, so honest fees can
  /// sit below the oracle-computed ideal by up to the deviation gate.
  public let DEFAULT_TOLERANCE_BPS : Nat = 700;

  /// feePercent (stored as 0.69 = 0.69 %) → integer basis points, rounded to
  /// the nearest bp. 0.69 → 69, 1.0 → 100, 0 → 0.
  public func feeBpsFromPercent(p : Float) : Nat {
    let r = Float.toInt(p * 100.0 + 0.5);
    if (r < 0) { 0 } else { Int.abs(r) };
  };

  /// Minimum acceptable fee in wei (1e18 = 1 native unit):
  /// ceil( usdValue × (feeBps / 10_000) × (1 − toleranceBps / 10_000) ÷ nativeUsdPrice × 1e18 ).
  /// The fee is paid in the chain's NATIVE token: the USD requirement must be
  /// converted at the CURRENT native price (e.g. ~$2400/ETH) — omitting this
  /// division overstates the requirement by the native price (~2400×) and
  /// rejects every honest fee (production incident 2026-09-03, found via the
  /// replica technique against real receipts). Returns 0 when usdValue is 0
  /// (auto-pass), feeBps is 0 (fee disabled), or nativeUsdPrice ≤ 0 (caller
  /// skips the check when the price is unavailable — passed here as ≤0).
  public func minimumFeeWei(usdValue : Float, feeBps : Nat, toleranceBps : Nat, nativeUsdPrice : Float) : Nat {
    if (usdValue <= 0.0 or feeBps == 0 or nativeUsdPrice <= 0.0) { return 0 };
    let requiredUsd = usdValue * (Float.fromInt(feeBps) / 10_000.0);
    let tol = Float.fromInt(toleranceBps) / 10_000.0;
    let withTol = requiredUsd * (1.0 - tol);
    floatToWeiCeil(withTol / nativeUsdPrice);
  };

  /// ceil(x × 1e18) for x ≥ 0. 1e18 is exactly representable as a Float
  /// (10^18 = 2^18 × 5^18, and 5^18 < 2^53), so the only rounding comes from
  /// the product — and ceil errs upward, which is the safe direction for a
  /// minimum threshold. Negative input (float underflow) clamps to 0.
  func floatToWeiCeil(x : Float) : Nat {
    if (x <= 0.0) { return 0 };
    let scaled = x * 1e18;
    let r = Float.ceil(scaled).toInt();
    if (r < 0) { 0 } else { Int.abs(r) };
  };

  /// Decode the FeePaid event's `value` (wei) from a receipt log's data field.
  /// ABI head-encoding of event FeePaid(address indexed payer, bytes binding, uint256 value):
  ///   data = abi.encode(binding, value)
  ///   head = [offset=0x40, value] — the static uint256 sits at WORD 1;
  ///   tail = [bindingLen, ...bytes]. Real claim-fee receipts (validated
  ///   2026-09-03): words [64, value, 96, ...binding]. Reading the LAST word
  ///   yields binding-tail garbage (~1e77) — that was the 09-03 incident.
  /// Returns null for missing/short/non-hex data — callers treat null as
  /// transient (retry), never fraud.
  public func decodeFeePaidValue(dataHex : Text) : ?Nat {
    let chars = dataHex.toArray();
    var start : Nat = 0;
    // Strip 0x/0X prefix if present
    if (chars.size() >= 2 and chars[0] == '0' and (chars[1] == 'x' or chars[1] == 'X')) {
      start := 2;
    };
    let hexLen = chars.size() - start;
    if (hexLen < 64) { return null };
    let wordCount = hexLen / 64;
    func wordAt(w : Nat) : ?Nat {
      var value : Nat = 0;
      var i : Nat = start + w * 64;
      let end = i + 64;
      label decode while (i < start + (w + 1) * 64) {
        let c = chars[i];
        let d = switch (c) {
          case ('0') 0;
          case ('1') 1;
          case ('2') 2;
          case ('3') 3;
          case ('4') 4;
          case ('5') 5;
          case ('6') 6;
          case ('7') 7;
          case ('8') 8;
          case ('9') 9;
          case ('a' or 'A') 10;
          case ('b' or 'B') 11;
          case ('c' or 'C') 12;
          case ('d' or 'D') 13;
          case ('e' or 'E') 14;
          case ('f' or 'F') 15;
          case _ { return null }; // non-hex → unusable data
        };
        value := value * 16 + d;
        i += 1;
      };
      ?value;
    };
    // head word0 must be the dynamic-offset marker (0x40 = 64)
    switch (wordAt(0)) {
      case (?64) {};
      case _ { return null }; // not the expected FeePaid layout
    };
    // Static uint256 is encoded in the HEAD at word 1 — for BOTH the
    // fallback() path (non-empty binding tail follows at word 2) and the
    // receive() path (empty binding: tail = [len=0] at word 2).
    if (wordCount < 2) { return null };
    wordAt(1);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // W4 review fix (F1): the amount check's DECISION, extracted so it is
  // testable and so a zero payment can never be treated as "no check needed".
  //
  // The bypass it closes: the call site used to read
  //     if (requireFeePaidEvent and paid > 0 and usd > 0.0) { ...check... }
  // — a `paid > 0` PRECONDITION. The collector's fallback() emits
  // `FeePaid(payer, binding, msg.value)` with NO minimum (contracts/FeeCollector.sol),
  // and decodeFeePaidValue returns `?0` for a zero word, so a caller could send
  // one 0-value transaction to the collector with a valid binding payload and
  // skip the whole check — full GRIT credited, no platform fee paid, on every
  // credit path. Zero payment is now a FAILURE (0 < any positive floor), not a
  // skip; 1 wei was already rejected, so this restores the intended boundary.
  //
  // Returns the minimum acceptable wei, or null when the check does not apply:
  //   - `usd <= 0.0`         : the claim's value is unknown → documented skip
  //   - `feeBps == 0`        : no fee configured → nothing is due
  //   - `nativePriceUsd <= 0`: price unavailable → documented skip (known
  //                            residual: fee enforcement is best-effort during
  //                            an oracle outage; GRIT issuance itself stays
  //                            fail-closed elsewhere)
  // Callers MUST compare `paid < floor` whenever this returns non-null —
  // including when `paid == 0`.
  public func amountCheckFloor(
    usd : Float,
    feeBps : Nat,
    nativePriceUsd : Float,
    toleranceBps : Nat,
  ) : ?Nat {
    if (usd <= 0.0) { return null };
    if (feeBps == 0) { return null };
    if (nativePriceUsd <= 0.0) { return null };
    let min = minimumFeeWei(usd, feeBps, toleranceBps, nativePriceUsd);
    if (min == 0) { return null };
    ?min;
  };
};
