// FIX-16 (audit v341): the burn time-window gate is ENFORCED.
//
// setLaunchGate (mixins/allowlist-api.mo) has always written the admin
// time-window fields, but nothing ever read them — config theater. The
// decision now lives in ONE pure helper, AllowlistLib.burnWindowOpen, which
// BOTH paid entry points call next to their launch-time gate:
// initiateClaim (mixins/grit-api.mo) and createMiner (mixins/mining-api.mo).
//
// Semantics pinned here:
//   - gate disabled                   → open (the window is opt-in)
//   - enabled, now inside [start,end] → open (both bounds inclusive)
//   - enabled, now before start       → closed
//   - enabled, now after end          → closed
//   - enabled, inverted/degenerate    → CLOSED (fail closed: a malformed
//     window must never read as permanently open)
//
// No test in this repo can import a mixin (actor context + RPC deps), so the
// unit under test is the REAL production helper the mixins call — the
// decision itself, not a mirror. The two call sites are the one-line
// `if (not AllowlistLib.burnWindowOpen(gate, Time.now()))` guards beside the
// launch gate in each mixin.

import Test "mo:test/async";
import AllowlistLib "../lib/allowlist";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

/// GateState fixture. Times are Unix epoch MILLISECONDS (the unit the admin
/// setter and the frontend use); burnWindowOpen takes Time.now() in ns.
func gateOf(enabled : Bool, startMs : Int, endMs : Int) : AllowlistLib.GateState {
  {
    var gateEnabled = enabled;
    var gateStartTime = startMs;
    var gateEndTime = endMs;
    var launchTimeEnabled = false;
    var launchTime = 0;
    var nftGateEnabled = false;
  };
};

// A concrete window: 1_700_000_000_000 ms .. 1_700_003_600_000 ms (1h wide).
let START_MS : Int = 1_700_000_000_000;
let END_MS : Int = 1_700_003_600_000;
let START_NS : Int = START_MS * 1_000_000;
let END_NS : Int = END_MS * 1_000_000;
let MID_NS : Int = START_NS + 1_800_000_000_000; // +30 min (ns)

// ── disabled gate = open, whatever the stored times say ─────────────────────
await Test.test("window: a disabled gate is open", func() : async () {
  require(
    AllowlistLib.burnWindowOpen(gateOf(false, 0, 0), 0),
    "disabled gate (untouched defaults) must be open",
  );
  require(
    AllowlistLib.burnWindowOpen(gateOf(false, START_MS, END_MS), MID_NS),
    "disabled gate must be open even with a configured window",
  );
  // Disabled WINS over a malformed window: a stale/inverted window that is
  // switched off must not block anything.
  require(
    AllowlistLib.burnWindowOpen(gateOf(false, END_MS, START_MS), MID_NS),
    "disabled gate must be open even with an inverted window",
  );
});

// ── enabled gate = open exactly inside the window (bounds inclusive) ────────
await Test.test("window: an enabled gate is open inside the window", func() : async () {
  let gate = gateOf(true, START_MS, END_MS);
  require(AllowlistLib.burnWindowOpen(gate, MID_NS), "midpoint of the window is open");
  require(AllowlistLib.burnWindowOpen(gate, START_NS), "the start boundary itself is open");
  require(AllowlistLib.burnWindowOpen(gate, END_NS), "the end boundary itself is open");
  require(
    AllowlistLib.burnWindowOpen(gate, START_NS + 1),
    "one ns after the start is open",
  );
});

// ─ before the start = closed ───────────────────────────────────────────────
await Test.test("window: before the start the gate is closed", func() : async () {
  let gate = gateOf(true, START_MS, END_MS);
  require(not AllowlistLib.burnWindowOpen(gate, START_NS - 1), "one ns before the start is closed");
  require(not AllowlistLib.burnWindowOpen(gate, 0), "epoch (long before the start) is closed");
});

// ── after the end = closed ──────────────────────────────────────────────────
await Test.test("window: after the end the gate is closed", func() : async () {
  let gate = gateOf(true, START_MS, END_MS);
  require(not AllowlistLib.burnWindowOpen(gate, END_NS + 1), "one ns after the end is closed");
});

// ── malformed / inverted window = closed (fail closed) ──────────────────────
await Test.test("window: an inverted or degenerate window is closed", func() : async () {
  require(
    not AllowlistLib.burnWindowOpen(gateOf(true, END_MS, START_MS), MID_NS),
    "start > end must be closed, never open-ended",
  );
  require(
    not AllowlistLib.burnWindowOpen(gateOf(true, START_MS, START_MS), START_NS),
    "start == end must be closed",
  );
  // The shape an admin leaves behind by enabling with empty times: closed,
  // not "always open" and not "always closed from epoch" only by accident.
  require(
    not AllowlistLib.burnWindowOpen(gateOf(true, 0, 0), 0),
    "enabled with zeroed times must be closed",
  );
});