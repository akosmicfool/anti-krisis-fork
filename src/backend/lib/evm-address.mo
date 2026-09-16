// W1B: EVM address validation.
//
// One validator shared by `setFeeRecipient`, `setFeeCollectorAddress` and
// the atomic secure-config (`applySecureFeeConfig`). Canonical form is
// `0x` + 40 hex characters, stored LOWERCASE — the fee-verification path
// compares addresses case-insensitively against receipt data, but a single
// canonical stored form removes the entire class of case-mismatch bugs.
//
// Today these setters store raw text with zero validation: a mistyped or
// malformed collector address silently routes fee-verification against
// garbage and every claim fails with no admin-visible diagnosis.

module {
  public type ValidateResult = { #ok : Text; #err : Text };

  func isHexDigit(c : Char) : Bool {
    (c >= '0' and c <= '9') or (c >= 'a' and c <= 'f') or (c >= 'A' and c <= 'F');
  };

  /// Validate an EVM address (`0x` + 40 hex, case-insensitive).
  /// Returns the canonical LOWERCASE form on success.
  public func validate(address : Text) : ValidateResult {
    let chars = address.chars();
    // Must start with 0x
    switch (chars.next(), chars.next()) {
      case (?'0', ?'x') {};
      case _ { return #err("EVM address must start with 0x") };
    };
    var count = 0;
    var lower = "0x";
    for (c in chars) {
      if (not isHexDigit(c)) {
        return #err("EVM address contains a non-hex character");
      };
      count += 1;
      lower := lower # Char.toText(toLowerHex(c));
    };
    if (count != 40) {
      return #err("EVM address must be 40 hex characters after 0x (got " # Nat.toText(count) # ")");
    };
    #ok(lower);
  };

  func toLowerHex(c : Char) : Char {
    if (c >= 'A' and c <= 'F') {
      // 'A'..'F' → 'a'..'f'
      Char.fromNat32((Char.toNat32(c) + 32));
    } else {
      c;
    };
  };
};
