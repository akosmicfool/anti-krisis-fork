// FIX-6 (audit v341): per-caller cap on claims awaiting verification.
//
// initiateClaim stores a claim record for ANY 64-hex hash BEFORE any proof,
// and claims never expire — so free unauthenticated spam grew state without
// bound and kept the 15s recheck sweep verifying the spammer's records
// forever. The cap gates only genuinely NEW records: at
// PENDING_CLAIMS_PER_CALLER claims still awaiting resolution (#pending /
// #pendingFee), a further initiateClaim is rejected with
// CLAIM_LIMIT_REACHED, while resurrection/adoption of EXISTING records
// (which add no row) keep working at any count. Terminal records
// (#verified / #failed) never count — they consumed their slot by resolving.
//
// No test in this repo can import a mixin (it needs the actor context and the
// mixin's RPC/outcall dependencies), so the decision initiateClaim applies
// (mixins/grit-api.mo, inside `if (not resurrected and not adopted)`, right
// before storePendingClaim) is mirrored here in pure form on the exact lib
// primitives it calls — countAwaitingClaims + PENDING_CLAIMS_PER_CALLER — and
// every rule is pinned without an RPC. Precedent: miner-fee-binding.test.mo
// mirrors the createMiner gate decision the same way.

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
let Q = Principal.fromText("y6f5k-y5eji-aaaaa-aaaap-yai");

/// The exact user-facing rejection initiateClaim returns once the caller's
/// awaiting claims reach the cap. This literal MUST match the mixin's return
/// in mixins/grit-api.mo — it is the contract the frontend surfaces.
let LIMIT_MSG = "CLAIM_LIMIT_REACHED: you already have 10 claims awaiting verification — wait for them to settle or use Re-check in Burn History.";

/// Mirror of the gate initiateClaim applies before storing a NEW record.
func claimGate(state : GritLib.State, caller : Principal) : { #ok; #err : Text } {
  if (GritLib.countAwaitingClaims(state, caller) >= GritLib.PENDING_CLAIMS_PER_CALLER) {
    #err(LIMIT_MSG)
  } else {
    #ok;
  };
};

func expectOk(gate : { #ok; #err : Text }, msg : Text) {
  switch (gate) {
    case (#ok) {};
    case (#err(e)) { Runtime.trap("FAIL: " # msg # " — got \"" # e # "\"") };
  };
};

func expectLimit(gate : { #ok; #err : Text }, msg : Text) {
  switch (gate) {
    case (#err(e)) {
      if (e != LIMIT_MSG) {
        Runtime.trap("FAIL: " # msg # " — got \"" # e # "\", expected \"" # LIMIT_MSG # "\"");
      };
    };
    case (#ok) { Runtime.trap("FAIL: " # msg # " — expected CLAIM_LIMIT_REACHED") };
  };
};

func claim(txHash : Text, claimant : Principal, status : GritTypes.ClaimStatus) : GritTypes.ClaimRecord {
  {
    txHash;
    feeTxHash = null;
    tokenAddress = "0x0000000000000000000000000000000000000000";
    chain = "base";
    tokenSymbol = "TST";
    tokenDecimals = 18;
    amountBurned = 0.0;
    usdValue = 0.0;
    gritMinted = 0;
    status;
    timestamp = 0;
    claimant;
  };
};

/// Distinct 64-hex hash per index (no parsing happens on this path — the
/// counter only has to keep identities apart).
func hashOf(i : Nat) : Text {
  let digits : [Text] = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
  var n = i;
  var tail = "";
  var k = 0;
  while (k < 16) {
    tail := digits[n % 16] # tail;
    n := n / 16;
    k += 1;
  };
  "0x" # "000000000000000000000000000000000000000000000000" # tail;
};

/// Store `n` awaiting claims for `caller`, hashes `from`..`from+n-1`,
/// alternating #pending/#pendingFee when `mixed` — BOTH statuses must count.
func seedAwaiting(state : GritLib.State, caller : Principal, from : Nat, n : Nat, mixed : Bool) {
  var i = 0;
  while (i < n) {
    let status : GritTypes.ClaimStatus = if (mixed and i % 2 == 1) #pendingFee else #pending;
    GritLib.storePendingClaim(state, claim(hashOf(from + i), caller, status));
    i += 1;
  };
};

// ── the cap boundary ────────────────────────────────────────────────────────
await Test.test("cap: 10 awaiting claims (mixed #pending/#pendingFee) block the 11th", func() : async () {
  let state = GritLib.newState();
  seedAwaiting(state, P, 0, 9, true);
  require(GritLib.countAwaitingClaims(state, P) == 9, "9 awaiting claims counted");
  expectOk(claimGate(state, P), "a 10th claim is accepted below the cap");
  // The gate sits BEFORE storePendingClaim, so this is what the accepted 10th
  // initiateClaim would have stored — both #pending and #pendingFee count.
  GritLib.storePendingClaim(state, claim(hashOf(9), P, #pending));
  require(GritLib.countAwaitingClaims(state, P) == 10, "10 awaiting claims counted");
  expectLimit(claimGate(state, P), "the 11th claim is rejected at the cap");
});

await Test.test("cap: terminal claims (#verified / #failed) never count toward the cap", func() : async () {
  let state = GritLib.newState();
  seedAwaiting(state, P, 0, 3, false);
  GritLib.storePendingClaim(state, claim(hashOf(10), P, #verified));
  GritLib.storePendingClaim(state, claim(hashOf(11), P, #failed));
  GritLib.storePendingClaim(state, claim(hashOf(12), P, #verified));
  require(GritLib.countAwaitingClaims(state, P) == 3, "only awaiting records count");
  expectOk(claimGate(state, P), "terminal records must not consume cap slots");
});

// ── scoping ─────────────────────────────────────────────────────────────────
await Test.test("cap: per-caller — a different caller is unaffected", func() : async () {
  let state = GritLib.newState();
  seedAwaiting(state, P, 0, 10, false);
  seedAwaiting(state, Q, 100, 4, false);
  expectLimit(claimGate(state, P), "P is at the cap");
  expectOk(claimGate(state, Q), "Q's independent count is below the cap");
  require(GritLib.countAwaitingClaims(state, Q) == 4, "Q counted separately");
});

// ── slots free on resolution ────────────────────────────────────────────────
await Test.test("cap: after one awaiting claim verifies, a new claim is accepted again", func() : async () {
  let state = GritLib.newState();
  seedAwaiting(state, P, 0, 10, false);
  expectLimit(claimGate(state, P), "at the cap before resolution");
  GritLib.updateClaimStatus(state, hashOf(0), #verified, 1_000, null, ?0.5, ?12.0, null, null);
  require(GritLib.countAwaitingClaims(state, P) == 9, "verified claim no longer awaits");
  expectOk(claimGate(state, P), "the slot freed by verification admits a new claim");
  GritLib.storePendingClaim(state, claim(hashOf(50), P, #pending));
  require(GritLib.countAwaitingClaims(state, P) == 10, "replacement back at the cap");
  expectLimit(claimGate(state, P), "the cap re-applies at 10 awaiting");
  // A definitively failed claim frees its slot the same way.
  GritLib.updateClaimStatus(state, hashOf(1), #failed, 0, null, null, null, null, null);
  require(GritLib.countAwaitingClaims(state, P) == 9, "failed claim no longer awaits");
  expectOk(claimGate(state, P), "the slot freed by failure admits a new claim");
});

// ── recovery paths add no row, so the cap must not block them ───────────────
await Test.test("cap: resurrecting an existing #failed claim works at the cap (no new row)", func() : async () {
  let state = GritLib.newState();
  seedAwaiting(state, P, 0, 10, false);
  GritLib.storePendingClaim(state, claim(hashOf(20), P, #failed));
  expectLimit(claimGate(state, P), "caller is at the cap");
  let before = state.claims.size();
  let resurrected = GritLib.resurrectFailedClaim(state, hashOf(20), P, "0xfee20", 1_000);
  require(resurrected, "resurrection must succeed at the cap");
  require(state.claims.size() == before, "resurrection adds no row");
  require(GritLib.countAwaitingClaims(state, P) == 11, "the resurrected claim now awaits — cap gates NEW rows only");
  expectLimit(claimGate(state, P), "a genuinely new record is still rejected");
});

await Test.test("cap: adopting an existing uncredited claim works at the cap (no new row)", func() : async () {
  let state = GritLib.newState();
  GritLib.storePendingClaim(state, claim(hashOf(30), Q, #pending));
  seedAwaiting(state, P, 0, 10, false);
  expectLimit(claimGate(state, P), "adopter is at the cap");
  let before = state.claims.size();
  let adopted = GritLib.adoptUncreditedClaim(state, hashOf(30), P);
  require(adopted, "adoption must succeed at the cap");
  require(state.claims.size() == before, "adoption adds no row");
  require(GritLib.countAwaitingClaims(state, P) == 11, "adopted claim now counts for the adopter");
});