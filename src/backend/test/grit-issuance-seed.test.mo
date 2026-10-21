// GRIT issuance-rate boot semantics (2026-10-20 incident).
//
// Live `g4i7o` was set to 100,000,000,000 GRIT/$1 and locked with
// setLaunched(). The next backend upgrade ran main.mo's unconditional boot
// seed (`adminState.gritIssuanceRate := 1_000_000_000_000`) and silently
// rewrote the locked value to 1T — with no admin path back, because
// setGritIssuanceRate traps once isLaunched is true.
//
// These tests pin the two halves of the fix:
//   1. the boot seed only fills a PRISTINE field (never an admin override,
//      never a launched canister), and
//   2. a one-time, seedVersion-gated repair replaces the legacy 1T value that
//      older boots forced everywhere — leaving deliberate non-default rates
//      alone.

import Test "mo:test/async";
import AllowlistLib "../lib/allowlist";
import Principal "mo:core/Principal";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  }
};

func newAdminState(rate : Nat, launched : Bool) : AllowlistLib.AdminState {
  {
    admins = AllowlistLib.emptyAdmins();
    var feeRecipient = null;
    var feePercent = 0.69;
    var gritIssuanceRate = rate;
    var bootstrapPrincipalSet = true;
    var isLaunched = launched;
  }
};

let LAUNCH_RATE = 100_000_000_000;
let LEGACY_RATE = 1_000_000_000_000;

// ── boot seed ───────────────────────────────────────────────────────────────

await Test.test("seed: fresh canister (0, unlaunched) gets the 100B launch default", func() : async () {
  let st = newAdminState(0, false);
  AllowlistLib.seedGritIssuanceRate(st);
  require(st.gritIssuanceRate == LAUNCH_RATE, "pristine field must seed 100B");
});

await Test.test("seed: never overrides an admin-set rate before launch", func() : async () {
  let st = newAdminState(5_000_000_000, false);
  AllowlistLib.seedGritIssuanceRate(st);
  require(st.gritIssuanceRate == 5_000_000_000, "admin override must survive a boot");
});

await Test.test("seed: never writes a launched canister (the reported bug)", func() : async () {
  // The exact live state after the incident: launched, holding 1T.
  let st = newAdminState(LEGACY_RATE, true);
  AllowlistLib.seedGritIssuanceRate(st);
  require(st.gritIssuanceRate == LEGACY_RATE, "boot must not touch a launched rate");
  // And a launched canister already at 100B stays at 100B.
  let good = newAdminState(LAUNCH_RATE, true);
  AllowlistLib.seedGritIssuanceRate(good);
  require(good.gritIssuanceRate == LAUNCH_RATE, "launched 100B must be untouched");
});

// ── one-time legacy repair ──────────────────────────────────────────────────

await Test.test("repair: launched canister stomped to 1T is restored to 100B", func() : async () {
  let st = newAdminState(LEGACY_RATE, true);
  let repaired = AllowlistLib.repairLegacyBootDefaultRate(st);
  require(repaired, "must report the repair");
  require(st.gritIssuanceRate == LAUNCH_RATE, "locked rate must be 100B");
});

await Test.test("repair: unlaunched canister stuck at the legacy default is restored", func() : async () {
  // A draft that survived a push keeps the old boot value; the admin panel
  // must show the launch value there too.
  let st = newAdminState(LEGACY_RATE, false);
  ignore AllowlistLib.repairLegacyBootDefaultRate(st);
  require(st.gritIssuanceRate == LAUNCH_RATE, "draft legacy value must be 100B");
});

await Test.test("repair: deliberate non-default rates are untouched", func() : async () {
  let custom = newAdminState(50_000_000_000, true);
  let repaired = AllowlistLib.repairLegacyBootDefaultRate(custom);
  require(not repaired, "no repair for a custom rate");
  require(custom.gritIssuanceRate == 50_000_000_000, "custom rate must survive");
});

await Test.test("repair: idempotent — a second boot changes nothing", func() : async () {
  let st = newAdminState(LEGACY_RATE, true);
  ignore AllowlistLib.repairLegacyBootDefaultRate(st);
  let repairedAgain = AllowlistLib.repairLegacyBootDefaultRate(st);
  AllowlistLib.seedGritIssuanceRate(st);
  require(not repairedAgain, "second repair must be a no-op");
  require(st.gritIssuanceRate == LAUNCH_RATE, "value stays 100B");
});

// ── incident replay ────────────────────────────────────────────────────────

await Test.test("incident replay: 100B locked, old boot stomps to 1T, new boot repairs to 100B", func() : async () {
  // 1. Owner sets 100B (setGritIssuanceRate) and locks (setLaunched).
  let st = newAdminState(LEGACY_RATE, false);
  st.gritIssuanceRate := LAUNCH_RATE;
  st.isLaunched := true;

  // 2. Old boot code (v340–v379) ran this line unconditionally on upgrade.
  st.gritIssuanceRate := LEGACY_RATE;

  // 3. New boot: guarded seed + one-time repair.
  AllowlistLib.seedGritIssuanceRate(st);
  ignore AllowlistLib.repairLegacyBootDefaultRate(st);

  require(st.gritIssuanceRate == LAUNCH_RATE, "incident must end at 100B");
  require(st.isLaunched, "launch lock must survive");
});
