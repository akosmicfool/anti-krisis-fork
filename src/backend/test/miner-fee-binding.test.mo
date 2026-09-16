// Miner creation fee — binding decode + shortfall + consumed-set (miner-creation-fee-plan step 1/5).
// RED tests — the lib surface does not exist yet.
//
// Invariants under test:
//   1. The MINE-tagged payload decodes ONLY for the caller's own principal,
//      byte-exact. A claim-shaped payload (32-byte burn-hash trailer) must be
//      REJECTED by the miner decoder — a paid claim fee can never be replayed
//      as a creation fee (and parseFeeBinding already rejects MINE payloads).
//   2. The amount decision is exact-or-more: shortfall is null iff paid >=
//      required, including paid == 0 (which must NOT skip the check).
//   3. The consumed-fee set makes every fee tx single-use, keyed by the
//      canonical (0x + lowercase) hash spelling — W1A identity rules.

import Test "mo:test/async";
import VerifyLib "../lib/verification";
import MiningLib "../lib/mining";
import ClaimIdentity "../lib/claim-identity";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let PRINCIPAL = "w7x7r-cok77-xa";
let OTHER_PRINCIPAL = "aaaaa-aa";

func hexOfText(t : Text) : Text {
  let digits = "0123456789abcdef";
  var out = "";
  for (c in t.chars()) {
    let n = Nat32.toNat(Char.toNat32(c));
    out #= Text.fromChar(Text.toArray(digits)[n / 16]);
    out #= Text.fromChar(Text.toArray(digits)[n % 16]);
  };
  out;
};

let PRINCIPAL_HEX = hexOfText(PRINCIPAL); // 28 hex chars
let MINE_TAG_HEX = "4d494e45"; // "MINE"
// Miner payload: 0x || len byte || principal || "MINE"
let MINER_BINDING = "0x" # "0e" # PRINCIPAL_HEX # MINE_TAG_HEX;
// Claim payload: 0x || len byte || principal || 32-byte burn hash
let BURN64 = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
let CLAIM_SHAPED = "0x" # "0e" # PRINCIPAL_HEX # BURN64;

// ── 1. decode: accept the MINE shape ────────────────────────────────────────

await Test.test("decode: valid MINE payload for own principal is #ok", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding(MINER_BINDING, PRINCIPAL)) {
    case (#ok) {};
    case (#err(e)) { Runtime.trap("expected ok, got: " # e) };
  };
});

await Test.test("decode: uppercase hex spelling accepted (case-folded)", func() : async () {
  let upper = "0X" # "0E" # PRINCIPAL_HEX # "4D494E45";
  switch (VerifyLib.decodeMinerFeeBinding(upper, PRINCIPAL)) {
    case (#ok) {};
    case (#err(e)) { Runtime.trap("expected ok, got: " # e) };
  };
});

// ── 2. decode: reject wrong principals ─────────────────────────────────────

await Test.test("decode: different principal is rejected", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding(MINER_BINDING, OTHER_PRINCIPAL)) {
    case (#ok) { Runtime.trap("wrong principal must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("decode: mixed-case principal text is rejected (byte-exact rule)", func() : async () {
  // The canonical-text rule from claims: compare byte-exactly, no folding.
  switch (VerifyLib.decodeMinerFeeBinding(MINER_BINDING, "W7X7R-COK77-XA")) {
    case (#ok) { Runtime.trap("case-folded principal must be rejected") };
    case (#err(_)) {};
  };
});

// ── 3. decode: cross-use prevention ────────────────────────────────────────

await Test.test("decode: claim-shaped payload (32-byte trailer) is REJECTED", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding(CLAIM_SHAPED, PRINCIPAL)) {
    case (#ok) { Runtime.trap("claim-shaped payload must not satisfy the miner gate") };
    case (#err(_)) {};
  };
});

await Test.test("decode: MINE payload is rejected by the CLAIM decoder (parseFeeBinding)", func() : async () {
  switch (VerifyLib.parseFeeBinding(MINER_BINDING)) {
    case (?_) { Runtime.trap("miner payload must not decode as a claim binding") };
    case (null) {};
  };
});

await Test.test("decode: wrong tag (MIN3) is rejected", func() : async () {
  let forged = "0x" # "0e" # PRINCIPAL_HEX # "4d493345";
  switch (VerifyLib.decodeMinerFeeBinding(forged, PRINCIPAL)) {
    case (#ok) { Runtime.trap("forged tag must be rejected") };
    case (#err(_)) {};
  };
});

// ── 4. decode: malformed layouts ───────────────────────────────────────────

await Test.test("decode: truncated payload is rejected", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding("0x" # "0e" # PRINCIPAL_HEX # "4d49", PRINCIPAL)) {
    case (#ok) { Runtime.trap("truncated payload must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("decode: oversized trailer is rejected", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding(MINER_BINDING # "00", PRINCIPAL)) {
    case (#ok) { Runtime.trap("oversized payload must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("decode: non-hex bytes are rejected", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding("0x" # "zz" # PRINCIPAL_HEX # MINE_TAG_HEX, PRINCIPAL)) {
    case (#ok) { Runtime.trap("non-hex payload must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("decode: empty payload is rejected", func() : async () {
  switch (VerifyLib.decodeMinerFeeBinding("0x", PRINCIPAL)) {
    case (#ok) { Runtime.trap("empty payload must be rejected") };
    case (#err(_)) {};
  };
});

await Test.test("decode: implausible principal length byte is rejected", func() : async () {
  // len byte 3 < 5 → layout check must fail before any compare
  switch (VerifyLib.decodeMinerFeeBinding("0x" # "03" # "aabbcc" # MINE_TAG_HEX, PRINCIPAL)) {
    case (#ok) { Runtime.trap("implausible length must be rejected") };
    case (#err(_)) {};
  };
});

// ── 5. shortfall decision ──────────────────────────────────────────────────

await Test.test("shortfall: zero paid on a positive requirement is a full shortfall", func() : async () {
  switch (VerifyLib.minerFeeShortfall(0, 1_000_000_000_000_000)) {
    case (null) { Runtime.trap("0 paid must shortfall") };
    case (?d) { require(d == 1_000_000_000_000_000, "shortfall = required") };
  };
});

await Test.test("shortfall: exact payment is null (no shortfall)", func() : async () {
  switch (VerifyLib.minerFeeShortfall(1_000_000_000_000_000, 1_000_000_000_000_000)) {
    case (null) {};
    case (?d) { Runtime.trap("exact payment must not shortfall, got " # Nat.toText(d)) };
  };
});

await Test.test("shortfall: overpayment is null", func() : async () {
  switch (VerifyLib.minerFeeShortfall(2_000_000_000_000_000, 1_000_000_000_000_000)) {
    case (null) {};
    case (?d) { Runtime.trap("overpayment must not shortfall, got " # Nat.toText(d)) };
  };
});

await Test.test("shortfall: 1 wei under is a shortfall of 1", func() : async () {
  switch (VerifyLib.minerFeeShortfall(999_999_999_999_999, 1_000_000_000_000_000)) {
    case (?1) {};
    case (_) { Runtime.trap("1 wei under must shortfall by 1") };
  };
});

// ── 6. consumed-fee set ────────────────────────────────────────────────────

await Test.test("consumed: fresh state has no consumed fees", func() : async () {
  let s = MiningLib.newMiningState();
  require(not MiningLib.isMinerFeeConsumed(s, "base", "0x" # BURN64), "fresh state must have nothing consumed");
});

await Test.test("consumed: consume marks exactly that hash", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.consumeMinerFee(s, "base", "0x" # BURN64);
  require(MiningLib.isMinerFeeConsumed(s, "base", "0x" # BURN64), "consumed hash must read back");
  require(not MiningLib.isMinerFeeConsumed(s, "base", "0x" # "ff" # BURN64), "a different hash stays unconsumed");
});

await Test.test("consumed: W1A identity — any spelling maps to the canonical entry", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.consumeMinerFee(s, "base", "0x" # BURN64);
  // prefixless + uppercase spellings are the SAME fee tx
  require(MiningLib.isMinerFeeConsumed(s, "base", BURN64), "prefixless spelling must hit");
  require(MiningLib.isMinerFeeConsumed(s, "base", "0x0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789ABCDEF"), "mixed-case spelling must hit");
});

await Test.test("consumed: per-chain keying — same hash on another chain is independent", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.consumeMinerFee(s, "base", "0x" # BURN64);
  require(MiningLib.isMinerFeeConsumed(s, "base", "0x" # BURN64), "same chain+hash hits");
  require(not MiningLib.isMinerFeeConsumed(s, "celo", "0x" # BURN64), "other chain stays unconsumed");
});

// ── 7. minerFeeRequired — the per-chain decision helper ────────────────────
// D1 note: null here means "free ON THIS CHAIN", not "the gate is off". The
// whole gate is armed-anywhere, enforced in the createMiner mixin via
// anyMinerFeeArmed + minerFeeRequired (see §8 — the composite rules).

await Test.test("gate: unconfigured chain means FREE (null)", func() : async () {
  let s = MiningLib.newMiningState();
  switch (MiningLib.minerFeeRequired(s, "base")) {
    case (null) {};
    case (?f) { Runtime.trap("unconfigured chain must be free, got " # Nat.toText(f)) };
  };
});

await Test.test("gate: fee 0 means FREE (null)", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 0);
  switch (MiningLib.minerFeeRequired(s, "base")) {
    case (null) {};
    case (?f) { Runtime.trap("fee 0 must be free, got " # Nat.toText(f)) };
  };
});

await Test.test("gate: positive fee means GATED (?fee)", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 1_000_000_000_000_000);
  switch (MiningLib.minerFeeRequired(s, "base")) {
    case (null) { Runtime.trap("positive fee must gate") };
    case (?f) { require(f == 1_000_000_000_000_000, "required fee round-trips") };
  };
});

await Test.test("gate: a fee on one chain does not gate another", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 1_000_000_000_000_000);
  switch (MiningLib.minerFeeRequired(s, "celo")) {
    case (null) {};
    case (?f) { Runtime.trap("celo must stay free, got " # Nat.toText(f)) };
  };
});

// ── 7a. F1 hardening: fees only armable on allowlisted chains ──────────────

await Test.test("F1: zero supported tokens => fee-setting disallowed", func() : async () {
  require(not MiningLib.setMinerCreationFeeAllowed(0), "no tokens = no fee");
});

await Test.test("F1: one supported token => fee-setting allowed", func() : async () {
  require(MiningLib.setMinerCreationFeeAllowed(1), "supported chain = armable");
});

// ── 7b. the composite verifier (pure — recipient + payload) ────────────────

func tx(from : Text, to : Text, input : Text) : VerifyLib.TxByHash {
  { from = from; to = to; input = input };
};

let COLLECTOR = "0x6cbb77116ee10a41a3f7680a2a0bca0bcabcacd2";
let PAYER = "0x1111111111111111111111111111111111111111";

await Test.test("verifyMinerFee: direct payment to the wallet with MINE payload is #ok", func() : async () {
  switch (VerifyLib.verifyMinerFeeBinding(tx(PAYER, COLLECTOR, MINER_BINDING), COLLECTOR, PRINCIPAL, null)) {
    case (#ok) {};
    case (#err(e)) { Runtime.trap("expected ok, got: " # e) };
  };
});

await Test.test("verifyMinerFee: wrong recipient with no event is rejected", func() : async () {
  switch (VerifyLib.verifyMinerFeeBinding(tx(PAYER, "0x9999999999999999999999999999999999999999", MINER_BINDING), COLLECTOR, PRINCIPAL, null)) {
    case (#ok) { Runtime.trap("wrong recipient must fail") };
    case (#err(_)) {};
  };
});

await Test.test("verifyMinerFee: relayed payment (tx.to != wallet) is accepted via the collector event", func() : async () {
  switch (VerifyLib.verifyMinerFeeBinding(tx(PAYER, "0x9999999999999999999999999999999999999999", "0x"), COLLECTOR, PRINCIPAL, ?MINER_BINDING)) {
    case (#ok) {};
    case (#err(e)) { Runtime.trap("relay-tolerant path must accept, got: " # e) };
  };
});

await Test.test("verifyMinerFee: relayed payment with a foreign principal in the event is rejected", func() : async () {
  switch (VerifyLib.verifyMinerFeeBinding(tx(PAYER, "0x9999999999999999999999999999999999999999", "0x"), COLLECTOR, PRINCIPAL, ?("0x" # "0e" # hexOfText(OTHER_PRINCIPAL) # MINE_TAG_HEX))) {
    case (#ok) { Runtime.trap("event naming another principal must fail") };
    case (#err(_)) {};
  };
});

await Test.test("verifyMinerFee: claim-shaped calldata to the wallet is rejected", func() : async () {
  switch (VerifyLib.verifyMinerFeeBinding(tx(PAYER, COLLECTOR, CLAIM_SHAPED), COLLECTOR, PRINCIPAL, null)) {
    case (#ok) { Runtime.trap("claim-shaped calldata must fail the miner gate") };
    case (#err(_)) {};
  };
});

// ── 7c. canonical hash helper parity (shared with claims) ──────────────────

await Test.test("canonicalTxHash: uppercase folds (the rule the consumed set relies on)", func() : async () {
  let a = switch (ClaimIdentity.canonicalTxHash("0x" # BURN64)) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap(e) };
  };
  let b = switch (ClaimIdentity.canonicalTxHash("0X0123456789ABCDEF0123456789abcdef0123456789abcdef0123456789ABCDEF")) {
    case (#ok(c)) { c };
    case (#err(e)) { Runtime.trap(e) };
  };
  require(a == b, "both spellings converge to one identity");
});

// ── 8. D1: the gate is not caller-elected ─────────────────────────────────
//
// anyMinerFeeArmed is the "is the gate on anywhere" predicate the createMiner
// gate keys on. When it is true, creation is never free: feeChain must be
// Some AND name an armed chain. Only a fully unarmed fee map (the owner's
// launch switch) leaves creation free.

await Test.test("armed: fresh state has the gate unarmed", func() : async () {
  let s = MiningLib.newMiningState();
  require(not MiningLib.anyMinerFeeArmed(s), "no fee entries must leave the gate unarmed");
});

await Test.test("armed: a single positive fee arms the gate", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 6_900_000_000_000);
  require(MiningLib.anyMinerFeeArmed(s), "one positive entry must arm the gate");
});

await Test.test("armed: a fee reset to 0 disarms the gate", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 6_900_000_000_000);
  require(MiningLib.anyMinerFeeArmed(s), "armed after the first set");
  MiningLib.setMinerCreationFee(s, "base", 0);
  require(not MiningLib.anyMinerFeeArmed(s), "0 must disarm — the launch switch stays off");
});

await Test.test("armed: 0 on one chain plus a positive fee on another keeps the gate armed", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 0);
  MiningLib.setMinerCreationFee(s, "celo", 6_900_000_000_000);
  require(MiningLib.anyMinerFeeArmed(s), "one positive entry anywhere arms the gate globally");
});

// The decision the createMiner gate implements (mixins/mining-api.mo ~L107),
// duplicated in pure form so each rule is pinned without an RPC: armed-anywhere
// + no chain ⇒ reject; + unarmed/unknown chain ⇒ reject; + armed chain ⇒ the
// required fee; nothing armed ⇒ free (regardless of what the caller passed).
type GateDecision = { #free; #err : Text; #required : Nat };

func gateDecision(s : MiningLib.State, feeChain : ?Text) : GateDecision {
  if (not MiningLib.anyMinerFeeArmed(s)) { return #free };
  let chain = switch (feeChain) {
    case null { return #err("MINER_FEE_TX_REQUIRED") };
    case (?c) { c };
  };
  switch (MiningLib.minerFeeRequired(s, chain)) {
    case null { #err("MINER_FEE_CHAIN_UNSUPPORTED") };
    case (?f) { #required(f) };
  };
};

func expectError(d : GateDecision, needle : Text, msg : Text) {
  switch (d) {
    case (#err(e)) {
      if (not e.contains(#text needle)) {
        Runtime.trap(msg # " — got err \"" # e # "\"");
      };
    };
    case (_) { Runtime.trap(msg # " — expected an error decision") };
  };
};

await Test.test("D1: nothing armed — free even with a null feeChain (launch switch off)", func() : async () {
  let s = MiningLib.newMiningState();
  switch (gateDecision(s, null)) {
    case (#free) {};
    case (_) { Runtime.trap("unarmed gate must be free") };
  };
});

await Test.test("D1: nothing armed — free even when a chain name is passed", func() : async () {
  let s = MiningLib.newMiningState();
  switch (gateDecision(s, ?"base")) {
    case (#free) {};
    case (_) { Runtime.trap("unarmed gate must be free") };
  };
});

await Test.test("D1: armed anywhere + null feeChain is REJECTED (the caller-elected bypass)", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 6_900_000_000_000);
  expectError(gateDecision(s, null), "MINER_FEE_TX_REQUIRED", "null feeChain on an armed gate must be rejected");
});

await Test.test("D1: armed anywhere + an unconfigured chain name is REJECTED (misspelling bypass)", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 6_900_000_000_000);
  expectError(gateDecision(s, ?"basee"), "MINER_FEE_CHAIN_UNSUPPORTED", "an unarmed chain name must be rejected");
});

await Test.test("D1: armed elsewhere + an explicitly-0 chain name is REJECTED", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 6_900_000_000_000);
  MiningLib.setMinerCreationFee(s, "celo", 0); // present but unarmed
  expectError(gateDecision(s, ?"celo"), "MINER_FEE_CHAIN_UNSUPPORTED", "a fee map entry of 0 is not an armed chain");
});

await Test.test("D1: armed anywhere + an armed chain returns the configured fee", func() : async () {
  let s = MiningLib.newMiningState();
  MiningLib.setMinerCreationFee(s, "base", 6_900_000_000_000);
  switch (gateDecision(s, ?"base")) {
    case (#required(f)) { require(f == 6_900_000_000_000, "the armed chain's fee is the gate") };
    case (_) { Runtime.trap("an armed chain must yield a required fee") };
  };
});
