// W1B: admin-surface hardening + secure-config readiness.
//
// 1. `addAdmin` must reject the anonymous principal (`aaaaa-aa`) — every
//    anonymous caller would pass `isAdmin` if it ever landed in the list
//    (Medium severity / very-low likelihood, privileged action required —
//    but the rejection is one line and closes the footgun permanently).
// 2. EVM address validation: `0x` + 40 hex chars, case-insensitive input,
//    stored lowercase. `setFeeRecipient` / `setFeeCollectorAddress` /
//    the atomic secure-config all share this validator — a malformed or
//    mistyped collector address today silently routes fee-verification
//    against garbage.
// 3. The atomic secure-config (`applySecureFeeConfig`) validates
//    recipient==collector, both valid EVM addresses, then commits recipient,
//    collector AND the FeePaid arm TOGETHER. Today's three separate setters
//    allow an intermediate state where the collector is armed but
//    feeRecipient still points at an EOA — the exact state the FeeState
//    comment warns "would fail every claim" — and each reset (4 and
//    counting) has required the manual 3-call ritual with no validation.

import Test "mo:test/async";
import AllowlistLib "../lib/allowlist";
import FeeConfig "../lib/fee-config";
import EvmAddress "../lib/evm-address";
import Principal "mo:core/Principal";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let ANON = Principal.fromText("aaaaa-aa");
let REAL_ADMIN = Principal.fromText("tw5li-m6k77-xa7ab-7acaa");
let REAL_USER = Principal.fromText("pxtku-i4koa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaq");

func newAdminState() : AllowlistLib.AdminState {
  {
    admins = AllowlistLib.emptyAdmins();
    var feeRecipient = null;
    var feePercent = 0.69;
    var gritIssuanceRate = 100_000_000_000;
    var bootstrapPrincipalSet = false;
    var isLaunched = false;
  }
};

func newFeeState() : FeeConfig.FeeState {
  { var collectorAddress = ""; var requireFeePaidEvent = false };
};

// ── 1. anonymous-admin rejection ────────────────────────────────────────────
await Test.test("addAdmin rejects the anonymous principal", func() : async () {
  let st = newAdminState();
  AllowlistLib.addAdmin(st, REAL_ADMIN);
  AllowlistLib.addAdmin(st, ANON); // must be a silent no-op now
  require(AllowlistLib.getAdmins(st).size() == 1, "anonymous must NOT be added");
});

await Test.test("addAdmin still accepts real principals", func() : async () {
  let st = newAdminState();
  AllowlistLib.addAdmin(st, REAL_ADMIN);
  AllowlistLib.addAdmin(st, REAL_USER);
  require(AllowlistLib.getAdmins(st).size() == 2, "two real admins");
});

await Test.test("an anonymous principal can never pass isAdmin after rejection", func() : async () {
  let st = newAdminState();
  AllowlistLib.addAdmin(st, REAL_ADMIN);
  AllowlistLib.addAdmin(st, ANON);
  require(not AllowlistLib.isAdmin(st, ANON), "anonymous is not admin");
});

// ── 2. EVM address validation ───────────────────────────────────────────────
await Test.test("evm: accepts 0x + 40 hex, mixed case, stores lowercase", func() : async () {
  let mixed = "0x6cBB3d6c1E4b1cD2A1F8dEB7A9fC25EaB9e1AaCD";
  switch (EvmAddress.validate(mixed)) {
    case (#ok(lower)) {
      require(lower == "0x6cbb3d6c1e4b1cd2a1f8deb7a9fc25eab9e1aacd", "stored lowercase");
    };
    case (#err(e)) { Runtime.trap("valid address rejected: " # e) };
  };
});

await Test.test("evm: rejects wrong length", func() : async () {
  switch (EvmAddress.validate("0x1234")) {
    case (#ok(_)) { Runtime.trap("short address accepted") };
    case (#err(_)) {};
  };
});

await Test.test("evm: rejects missing 0x prefix", func() : async () {
  switch (EvmAddress.validate("6cbb3d6c1e4b1cd2a1f8deb7a9fc25eab9e1aacd")) {
    case (#ok(_)) { Runtime.trap("prefixless accepted") };
    case (#err(_)) {};
  };
});

await Test.test("evm: rejects non-hex characters", func() : async () {
  switch (EvmAddress.validate("0x6cBB3d6c1E4b1cD2A1F8dEB7A9fC25EaB9e1AaCG")) {
    case (#ok(_)) { Runtime.trap("non-hex accepted") };
    case (#err(_)) {};
  };
});

await Test.test("evm: rejects empty string", func() : async () {
  switch (EvmAddress.validate("")) {
    case (#ok(_)) { Runtime.trap("empty accepted") };
    case (#err(_)) {};
  };
});

// ── 3. atomic secure fee config ─────────────────────────────────────────────
await Test.test("secure-config: commits recipient+collector+arm together when valid", func() : async () {
  let admin = newAdminState();
  let fee = newFeeState();
  let collector = "0x6cBB3d6c1E4b1cD2A1F8dEB7A9fC25EaB9e1AaCD";
  switch (AllowlistLib.applySecureFeeConfig(admin, fee, collector, collector)) {
    case (#ok(_)) {};
    case (#err(e)) { Runtime.trap("valid config rejected: " # e) };
  };
  switch (admin.feeRecipient) {
    case (?r) { require(r == "0x6cbb3d6c1e4b1cd2a1f8deb7a9fc25eab9e1aacd", "recipient committed") };
    case null { Runtime.trap("recipient missing") };
  };
  require(fee.collectorAddress == "0x6cbb3d6c1e4b1cd2a1f8deb7a9fc25eab9e1aacd", "collector committed");
  require(fee.requireFeePaidEvent, "FeePaid armed");
});

await Test.test("secure-config: rejects recipient != collector (mismatch = squat-able)", func() : async () {
  let admin = newAdminState();
  let fee = newFeeState();
  switch (AllowlistLib.applySecureFeeConfig(admin, fee, "0x6cBB3d6c1E4b1cD2A1F8dEB7A9fC25EaB9e1AaCD", "0x1111111111111111111111111111111111111111")) {
    case (#ok(_)) { Runtime.trap("mismatch accepted") };
    case (#err(_)) {};
  };
  // nothing committed
  switch (admin.feeRecipient) {
    case null {};
    case (?_) { Runtime.trap("recipient must not be committed on rejection") };
  };
  require(fee.collectorAddress == "", "collector must not be committed on rejection");
  require(not fee.requireFeePaidEvent, "arm must not be committed on rejection");
});

await Test.test("secure-config: rejects malformed addresses atomically", func() : async () {
  let admin = newAdminState();
  let fee = newFeeState();
  switch (AllowlistLib.applySecureFeeConfig(admin, fee, "0xBAD", "0xBAD")) {
    case (#ok(_)) { Runtime.trap("malformed accepted") };
    case (#err(_)) {};
  };
  require(not fee.requireFeePaidEvent, "nothing armed on rejection");
});

await Test.test("secure-config: un-arming is allowed for the owner (disarm-only path)", func() : async () {
  // The single-setter setFeePaidCheckEnabled(false) stays available for
  // emergencies; the atomic path arms. Model both here via the lib.
  let admin = newAdminState();
  let fee = newFeeState();
  let collector = "0x6cBB3d6c1E4b1cD2A1F8dEB7A9fC25EaB9e1AaCD";
  switch (AllowlistLib.applySecureFeeConfig(admin, fee, collector, collector)) {
    case (#ok(_)) {};
    case (#err(e)) { Runtime.trap("rejected: " # e) };
  };
  require(fee.requireFeePaidEvent, "armed");
  FeeConfig.disarm(fee);
  require(not fee.requireFeePaidEvent, "disarmed");
  // recipient/collector survive a disarm — they are deployment facts, not
  // part of the armed flag.
  switch (admin.feeRecipient) {
    case (?_) {};
    case null { Runtime.trap("recipient lost on disarm") };
  };
});
