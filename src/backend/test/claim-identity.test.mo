// W1A: canonical burn/fee transaction-hash identity.
// RED tests — lib does not exist yet.
//
// Invariant: one on-chain transaction MUST resolve to exactly one claim
// identity regardless of hex spelling (0x prefix, upper/lower case).
// Every claim lookup/store/compare goes through these functions.

import Test "mo:test/async";
import ClaimIdentity "../lib/claim-identity";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let LOWER64 = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
let UPPER64 = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
let MIXED64 = "0123456789aBcDeF0123456789AbCdEf0123456789ABCDEF0123456789abcdef";

// ── canonical form ───────────────────────────────────────────────────────────
await Test.test("canonical: 0x + lowercase is canonical and unchanged", func() : async () {
  let c = switch (ClaimIdentity.canonicalTxHash("0x" # LOWER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected err: " # e) };
  };
  require(c == "0x" # LOWER64, "canonical should be 0x+lower");
});

await Test.test("canonical: uppercase spelling folds to lower", func() : async () {
  let c = switch (ClaimIdentity.canonicalTxHash("0x" # UPPER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected err: " # e) };
  };
  require(c == "0x" # LOWER64, "upper must fold to lower");
});

await Test.test("canonical: mixed-case spelling folds to lower", func() : async () {
  let c = switch (ClaimIdentity.canonicalTxHash("0x" # MIXED64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected err: " # e) };
  };
  require(c == "0x" # LOWER64, "mixed must fold to lower");
});

await Test.test("canonical: prefixless spelling gets 0x prepended", func() : async () {
  let c = switch (ClaimIdentity.canonicalTxHash(LOWER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected err: " # e) };
  };
  require(c == "0x" # LOWER64, "prefixless gets 0x prepended");
});

await Test.test("canonical: all spellings map to ONE identity", func() : async () {
  let a = switch (ClaimIdentity.canonicalTxHash("0x" # UPPER64)) { case (#ok(c)) { c }; case (#err(e)) { Runtime.trap(e) } };
  let b = switch (ClaimIdentity.canonicalTxHash(MIXED64)) { case (#ok(c)) { c }; case (#err(e)) { Runtime.trap(e) } };
  let c = switch (ClaimIdentity.canonicalTxHash("0x" # LOWER64)) { case (#ok(c)) { c }; case (#err(e)) { Runtime.trap(e) } };
  require(a == b and b == c, "all casings converge");
});

// ── validation rejects garbage BEFORE any outcall ────────────────────────────
await Test.test("validate: rejects wrong length (63 chars)", func() : async () {
  let short = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde";
  switch (ClaimIdentity.canonicalTxHash(short)) {
    case (#ok(_)) { Runtime.trap("63 chars must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("validate: rejects wrong length (65 chars)", func() : async () {
  let long = "0x" # LOWER64 # "0";
  switch (ClaimIdentity.canonicalTxHash(long)) {
    case (#ok(_)) { Runtime.trap("65 chars must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("validate: rejects non-hex characters", func() : async () {
  let bad = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdeg";
  switch (ClaimIdentity.canonicalTxHash(bad)) {
    case (#ok(_)) { Runtime.trap("non-hex must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("validate: rejects empty string", func() : async () {
  switch (ClaimIdentity.canonicalTxHash("")) {
    case (#ok(_)) { Runtime.trap("empty must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("validate: rejects bare 0x", func() : async () {
  switch (ClaimIdentity.canonicalTxHash("0x")) {
    case (#ok(_)) { Runtime.trap("bare 0x must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("validate: accepts 0X prefix and canonicalizes", func() : async () {
  let c = switch (ClaimIdentity.canonicalTxHash("0X" # LOWER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("0X should be accepted: " # e) };
  };
  require(c == "0x" # LOWER64, "0X folds to 0x+lower");
});

await Test.test("validate: ff/FF bytes survive (regression: old 0xFF-sentinel bug)", func() : async () {
  let body = "ff" # "123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde";
  // 2 + 62 = 64 hex chars ✓
  switch (ClaimIdentity.canonicalTxHash("0x" # body)) {
    case (#ok(c)) {
      require(c == "0x" # body, "ff preserved lowercase");
    };
    case (#err(e)) { Runtime.trap("ff hex rejected: " # e) };
  };
  switch (ClaimIdentity.canonicalTxHash("0x" # "FF" # "123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde")) {
    case (#ok(c)) {
      require(c == "0x" # body, "FF folds to ff");
    };
    case (#err(e)) { Runtime.trap("FF hex rejected: " # e) };
  };
});

// ── same-claim semantics (the replay-kill) ──────────────────────────────────
func sameIdentity(h1 : Text, h2 : Text) : Bool {
  switch (ClaimIdentity.canonicalTxHash(h1), ClaimIdentity.canonicalTxHash(h2)) {
    case (#ok(c1), #ok(c2)) { c1 == c2 };
    case _ { false };
  };
};

await Test.test("same-claim: checksummed vs lower", func() : async () {
  require(sameIdentity("0x" # MIXED64, "0x" # LOWER64), "mixed vs lower");
});

await Test.test("same-claim: prefixless vs 0x", func() : async () {
  require(sameIdentity(LOWER64, "0x" # LOWER64), "prefixless vs 0x");
});

await Test.test("same-claim: different hashes stay distinct", func() : async () {
  let other = "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  require(not sameIdentity("0x" # LOWER64, other), "distinct hashes stay distinct");
});

// ── fee-tx hashes: same identity, empty allowed as sentinel ─────────────────
await Test.test("fee hash: canonicalization identical to burn hash", func() : async () {
  let c = switch (ClaimIdentity.canonicalOptionalFeeHash("0x" # UPPER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected: " # e) };
  };
  require(c == "0x" # LOWER64, "fee hash folds identically");
});

await Test.test("fee hash: empty accepted as deferred-fee sentinel", func() : async () {
  switch (ClaimIdentity.canonicalOptionalFeeHash("")) {
    case (#ok("")) {};
    case (#ok(_)) { Runtime.trap("empty should stay empty") };
    case (#err(e)) { Runtime.trap("empty fee must be accepted: " # e) };
  };
});

await Test.test("fee hash: invalid non-empty rejected", func() : async () {
  switch (ClaimIdentity.canonicalOptionalFeeHash("not-a-hash")) {
    case (#ok(_)) { Runtime.trap("garbage fee hash must be rejected") };
    case (#err(_)) {};
  };
});

// W1A regression (session review): retryFeeClaim canonicalizes both hashes
// but performed its lookup with the RAW spelling — an UPPERCASE retry against
// a canonical-lowercase stored claim missed ('Claim not found') despite the
// claim existing. Lookup must use the canonical form, as recheckClaimByHash
// already does. These tests pin the invariant at the identity-lib level: the
// canonical form of ANY spelling equals the canonical form of the stored
// record, so canon-based lookups find the claim for every spelling.
await Test.test("regression: retry path — every spelling canonicalizes to the stored record", func() : async () {
  let stored = switch (ClaimIdentity.canonicalTxHash("0x" # LOWER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected: " # e) };
  };
  // Retry submitted with UPPERCASE (no 0x) must resolve to the same record
  let retryUpper = switch (ClaimIdentity.canonicalTxHash(UPPER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected: " # e) };
  };
  require(retryUpper == stored, "UPPERCASE retry finds the stored claim");
  // Retry submitted with MIXED case (0x-prefixed) must resolve identically
  let retryMixed = switch (ClaimIdentity.canonicalTxHash("0x" # MIXED64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected: " # e) };
  };
  require(retryMixed == stored, "mixed-case retry finds the stored claim");
  // Fee hash spelled differently must likewise match a canonical stored fee
  let feeStored = switch (ClaimIdentity.canonicalOptionalFeeHash("0x" # LOWER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected: " # e) };
  };
  let feeRetry = switch (ClaimIdentity.canonicalOptionalFeeHash(UPPER64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap("unexpected: " # e) };
  };
  require(feeRetry == feeStored, "fee-hash retry finds the stored fee");
});
