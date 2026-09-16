// W1A: canonical transaction-hash identity.
//
// ONE on-chain transaction must resolve to exactly ONE claim identity no
// matter how its hash is spelled (0x/0X/no prefix, any casing). Every claim
// lookup, store and comparison in grit.mo / grit-api.mo goes through the
// canonical form produced here, so a re-spelled burn or fee hash cannot
// create a second claim, re-credit GRIT, or slip past the AKK-2/AKK-8
// duplicate guards.
//
// Canonical form: "0x" + 64 lowercase hex chars (32 bytes).
//
// Design constraints:
// - Strict validation BEFORE normalization: malformed input is rejected at
//   the claim boundary — before any HTTP outcall is spent on it.
// - 0xFF is a legitimate byte value (regression guard: an earlier parser
//   used 0xFF as an invalid-digit sentinel and silently dropped bindings
//   whose hashes contained an ff byte — production incident 2026-09-04).
// - The fee hash may be "" (deferred-fee flow); non-empty fee hashes must
//   be valid transaction hashes.

import Char "mo:core/Char";
import Text "mo:core/Text";

module {
  public type CanonicalResult = { #ok : Text; #err : Text };

  /// Normalize a transaction hash to the canonical identity.
  /// Accepts: 0x/0X/no prefix, any casing, exactly 64 hex chars.
  public func canonicalTxHash(input : Text) : CanonicalResult {
    let chars = Text.toArray(input);
    let n = chars.size();
    if (n == 0) {
      return #err("tx hash is empty");
    };
    // Split prefix (0x / 0X) if present.
    var start : Nat = 0;
    if (n >= 2 and chars[0] == '0' and (chars[1] == 'x' or chars[1] == 'X')) {
      start := 2;
    };
    let m = n - start;
    if (m != 64) {
      return #err("tx hash must be 64 hex chars (32 bytes), got " # debug_show (m));
    };
    let out = [var '0', 'x',
      '0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0',
      '0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0',
      '0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0',
      '0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'];
    var i : Nat = 0;
    while (i < 64) {
      let c = chars[start + i];
      switch (toLowerHex(c)) {
        case null {
          return #err("tx hash contains non-hex character");
        };
        case (?lc) {
          out[2 + i] := lc;
        };
      };
      i += 1;
    };
    var s = "";
    for (c in out.vals()) {
      s := s # Text.fromChar(c);
    };
    #ok(s);
  };

  /// Canonicalize a fee-tx hash: "" is the deferred-fee sentinel and passes
  /// through; anything non-empty must be a valid transaction hash.
  public func canonicalOptionalFeeHash(input : Text) : CanonicalResult {
    if (input.size() == 0) {
      return #ok("");
    };
    canonicalTxHash(input);
  };

  /// Lowercase a single hex char; null if not hex.
  func toLowerHex(c : Char) : ?Char {
    switch (c) {
      case ('0') { ?'0' };
      case ('1') { ?'1' };
      case ('2') { ?'2' };
      case ('3') { ?'3' };
      case ('4') { ?'4' };
      case ('5') { ?'5' };
      case ('6') { ?'6' };
      case ('7') { ?'7' };
      case ('8') { ?'8' };
      case ('9') { ?'9' };
      case ('a') { ?'a' };
      case ('b') { ?'b' };
      case ('c') { ?'c' };
      case ('d') { ?'d' };
      case ('e') { ?'e' };
      case ('f') { ?'f' };
      case ('A') { ?'a' };
      case ('B') { ?'b' };
      case ('C') { ?'c' };
      case ('D') { ?'d' };
      case ('E') { ?'e' };
      case ('F') { ?'f' };
      case (_) { null };
    };
  };
};
