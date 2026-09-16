// W1A: atomic claim finalization — status, GRIT credit and economic metadata
// commit together in ONE guarded write; a stale/losing concurrent caller can
// neither credit twice nor rewrite a settled record's receipt metadata.
import Test "mo:test/async";
import GritLib "../lib/grit";
import GritTypes "../types/grit";
import Principal "mo:core/Principal";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let P = Principal.fromText("tw5li-m6k77-xa7ab-7acaa");
let CLAIM_HASH = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

func pendingRecord() : GritTypes.ClaimRecord {
  {
    txHash = CLAIM_HASH;
    feeTxHash = null;
    tokenAddress = "0x0000000000000000000000000000000000000000";
    chain = "base";
    tokenSymbol = "TST";
    tokenDecimals = 18;
    amountBurned = 0.0;
    usdValue = 0.0;
    gritMinted = 0;
    status = #pending;
    timestamp = 0;
    claimant = P;
  };
};

await Test.test("atomic: status + metadata + credit commit together", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, pendingRecord());

  GritLib.updateClaimStatus(state, CLAIM_HASH, #verified, 5_000, null, ?0.5, ?12.34, ?"0xfee");

  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.status == #verified, "status verified");
  require(r.gritMinted == 5_000, "grit recorded");
  require(r.amountBurned == 0.5, "amountBurned committed atomically");
  require(r.usdValue == 12.34, "usdValue committed atomically");
  switch (r.feeTxHash) {
    case (?f) { require(f == "0xfee", "feeTxHash committed atomically") };
    case null { Runtime.trap("feeTxHash missing") };
  };
  require(GritLib.getBalance(state, P) == 5_000, "balance credited once");
});

await Test.test("atomic: null metadata fields leave existing values untouched", func() : async () {
  let state = GritLib.newState();
  var rec = pendingRecord();
  rec := { rec with usdValue = 99.0 };
  GritLib.storePendingClaim(state, rec);

  GritLib.updateClaimStatus(state, CLAIM_HASH, #verified, 1_000, null, null, null, null);

  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.usdValue == 99.0, "null usdValue preserves stored value");
});

await Test.test("atomic: losing concurrent caller cannot rewrite settled metadata", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, pendingRecord());

  // Path A settles first with authoritative metadata.
  GritLib.updateClaimStatus(state, CLAIM_HASH, #verified, 5_000, null, ?0.5, ?12.34, ?"0xfee");

  // Path B arrives stale (thinks the claim is still pending) with its own
  // locally computed metadata — must be a complete no-op.
  GritLib.updateClaimStatus(state, CLAIM_HASH, #verified, 9_999, null, ?999.0, ?999.0, ?"0xstale");

  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.gritMinted == 5_000, "grit NOT overwritten by stale caller");
  require(r.amountBurned == 0.5, "amountBurned NOT overwritten");
  require(r.usdValue == 12.34, "usdValue NOT overwritten");
  switch (r.feeTxHash) {
    case (?f) { require(f == "0xfee", "feeTxHash NOT overwritten") };
    case null { Runtime.trap("feeTxHash missing") };
  };
  require(GritLib.getBalance(state, P) == 5_000, "no second credit");
  require(GritLib.getTotalEarned(state, P) == 5_000, "no double earn");
});

// ── W4 review fix (F2): no zero-credit #verified for an unverified burn ────
// The fee-verification paths prove the FEE, never the burn. A claim whose burn
// was still unindexed (amountBurned 0.0) could therefore be terminalized as
// #verified with gritToCredit 0 — sticky, never expiring, and thereafter
// reported as "already claimed", so the real burn could never be credited.
await Test.test("F2: a zero-credit #verified on an unverified burn is refused", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, pendingRecord()); // amountBurned = 0.0

  // The fee-verification path's exact call shape: credit 0, no metadata update.
  GritLib.updateClaimStatus(state, CLAIM_HASH, #verified, 0, null, null, null, null);

  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.status == #pending, "claim must stay awaiting resolution, not become #verified");
  require(r.gritMinted == 0, "no credit recorded");
  require(state.balances.get(P) == null, "no balance created");
});

await Test.test("F2: a verified burn may still terminalize with a zero credit", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, pendingRecord());
  // A real (if tiny) burn commits its amount in the same guarded write.
  GritLib.updateClaimStatus(state, CLAIM_HASH, #verified, 0, null, ?0.0000001, ?0.01, ?"0xfee");
  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.status == #verified, "a committed burn still resolves normally");
});

// ── W4/F4: claim squatting relief ──────────────────────────────────────────
// A watcher could submit a public burn hash first and lock the genuine burner
// out forever (claims never expire; takeover required the original claimant).
// An UNCREDITED claim is now adoptable — the adopter still has to pass the same
// fee-binding proof, so GRIT can only ever reach the true burn owner.
// two valid, distinct principals (checksums verified by the compiler)
let SQUATTER = Principal.fromText("y6f5k-y5eji-aaaaa-aaaap-yai");
let VICTIM   = Principal.fromText("tw5li-m6k77-xa7ab-7acaa");

func recordFor(txHash : Text, owner : Principal, status : GritTypes.ClaimStatus, grit : Nat, feeHash : ?Text) : GritTypes.ClaimRecord {
  {
    txHash;
    feeTxHash = feeHash;
    tokenAddress = "0x0000000000000000000000000000000000000000";
    chain = "base";
    tokenSymbol = "TST";
    tokenDecimals = 18;
    amountBurned = 1.5;
    usdValue = 3.0;
    gritMinted = grit;
    status;
    timestamp = 0;
    claimant = owner;
  };
};

await Test.test("F4: the real burner can adopt a squatted, uncredited claim", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, recordFor(CLAIM_HASH, SQUATTER, #pending, 0, ?""));
  let ok = GritLib.adoptUncreditedClaim(state, CLAIM_HASH, VICTIM);
  require(ok, "adoption must succeed for an uncredited claim");
  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.claimant == VICTIM, "claimant rebound to the adopter");
  require(r.gritMinted == 0, "still uncredited");
  require(r.status == #pending, "back to #pending so the Pay Fee flow resumes");
});

await Test.test("F4: a squatter's junk fee hash is dropped on adoption", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, recordFor(CLAIM_HASH, SQUATTER, #pendingFee, 0, ?"0xjunk"));
  let ok = GritLib.adoptUncreditedClaim(state, CLAIM_HASH, VICTIM);
  require(ok, "adoption must clear a squatter-supplied fee hash");
  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.feeTxHash == null, "junk fee hash cleared so the adopter pays their own");
  require(r.claimant == VICTIM, "claimant rebound");
});

await Test.test("F4: credited claims can never be adopted", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, recordFor(CLAIM_HASH, VICTIM, #verified, 12_345, ?"0xrealfee"));
  let ok = GritLib.adoptUncreditedClaim(state, CLAIM_HASH, SQUATTER);
  require(not ok, "a verified, credited claim must not be adoptable");
  let r = switch (state.claims.find(func(x : GritTypes.ClaimRecord) : Bool { x.txHash == CLAIM_HASH })) {
    case (?r) { r };
    case null { Runtime.trap("claim missing") };
  };
  require(r.claimant == VICTIM, "owner unchanged");
  require(r.gritMinted == 12_345, "credit untouched");
});

await Test.test("F4: a claim with any credit recorded is not adoptable", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, recordFor(CLAIM_HASH, VICTIM, #pending, 1, null));
  require(not GritLib.adoptUncreditedClaim(state, CLAIM_HASH, SQUATTER), "gritMinted > 0 blocks adoption");
});

await Test.test("F4: adoption is a no-op for the existing claimant and unknown hashes", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, recordFor(CLAIM_HASH, VICTIM, #pending, 0, null));
  require(not GritLib.adoptUncreditedClaim(state, CLAIM_HASH, VICTIM), "same caller: nothing to adopt");
  require(not GritLib.adoptUncreditedClaim(state, "0xdeadbeef", VICTIM), "unknown hash: false");
});
