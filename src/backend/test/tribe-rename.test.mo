// D3: a tribe rename (the slug migration in editTribe) must rewrite
// membershipHistory, not just the tribe maps.
//
// Invariant: every consumer of membershipHistory keys on `event.tribeId`:
//   - tribeIdAt            → block attribution (scores/ranks would freeze at
//     the old id after a rename);
//   - closeMembershipEvent → a leave cannot close an old-id open event, so
//     post-leave blocks keep being attributed;
//   - getTribeBurnSummary  → the tribe's burn totals lose every pre-rename burn.
// The migration must carry the events over to the new tribeId and preserve the
// join/leave windows verbatim.
//
// These tests are RED against the pre-D3 migration (events stayed on old-name).

import Test "mo:test/async";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import TribeLib "../lib/tribe";
import TribeTypes "../types/tribe";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import GritLib "../lib/grit";
import GritTypes "../types/grit";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let OWNER  = Principal.fromText("tw5li-m6k77-xa7ab-7acaa");
let MEMBER = Principal.fromText("5xeni-lmkoa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaq");
let OTHER  = Principal.fromText("y6f5k-y5eji-aaaaa-aaaap-yai");

func makeProfile(username : Text) : ProfileTypes.Profile = {
  username;
  displayName    = username;
  bio            = "";
  location       = "";
  born           = "";
  superpowers    = "";
  profilePicture = "";
  coverImage     = "";
  socials        = [];
  evmAddress     = null;
  hasOgBadge     = false;
  playerBadgeLevel = 0;
  miningStreak   = 0;
  interests      = "";
};

func makeProfileState() : ProfileLib.State {
  let state : ProfileLib.State = { profiles = Map.empty<Principal, ProfileTypes.Profile>() };
  state.profiles.add(OWNER, makeProfile("owner"));
  state.profiles.add(MEMBER, makeProfile("member"));
  state.profiles.add(OTHER, makeProfile("other"));
  state;
};

func createOldNameTribe(state : TribeLib.State, profiles : ProfileLib.State) : TribeTypes.TribeId {
  switch (TribeLib.createTribe(state, profiles, OWNER, "Old Name", "", null, null)) {
    case (#ok(t)) t.id;
    case (#err(e)) Runtime.trap("createTribe: " # debug_show e);
  };
};

func joinMember(state : TribeLib.State, profiles : ProfileLib.State, tribeId : TribeTypes.TribeId) {
  switch (TribeLib.joinTribe(state, profiles, MEMBER, tribeId, 0, 0)) {
    case (#ok(_)) {};
    case (#err(e)) Runtime.trap("joinTribe: " # debug_show e);
  };
};

func joinOther(state : TribeLib.State, profiles : ProfileLib.State, tribeId : TribeTypes.TribeId) {
  switch (TribeLib.joinTribe(state, profiles, OTHER, tribeId, 0, 0)) {
    case (#ok(_)) {};
    case (#err(e)) Runtime.trap("joinTribe(OTHER): " # debug_show e);
  };
};

func leaveMember(state : TribeLib.State) {
  switch (TribeLib.leaveTribe(state, MEMBER, 0, 0)) {
    case (#ok) {};
    case (#err(e)) Runtime.trap("leaveTribe: " # debug_show e);
  };
};

/// Rename via the same code path production uses (TribeLib.editTribe).
func renameTribe(state : TribeLib.State, oldId : TribeTypes.TribeId, newName : Text) : TribeTypes.TribeId {
  switch (TribeLib.editTribe(state, OWNER, oldId, ?newName, null, null, null)) {
    case (#ok(t)) t.id;
    case (#err(e)) Runtime.trap("editTribe: " # debug_show e);
  };
};

func memberEvent(state : TribeLib.State) : TribeTypes.MembershipEvent {
  switch (state.membershipHistory.find(func(e : TribeTypes.MembershipEvent) : Bool { Principal.equal(e.member, MEMBER) })) {
    case null Runtime.trap("no membership event for MEMBER");
    case (?e) e;
  };
};

func attributedTribeId(state : TribeLib.State, ts : Int) : TribeTypes.TribeId {
  switch (TribeLib.tribeIdAt(state, MEMBER, ts)) {
    case (?tid) tid;
    case null Runtime.trap("no tribe attribution at ts " # debug_show ts);
  };
};

// ── attribution follows the rename ──────────────────────────────────────────

await Test.test("rename: open membership event migrates and tribeIdAt returns the NEW id", func() : async () {
  let state    = TribeLib.newState();
  let profiles = makeProfileState();
  let oldId    = createOldNameTribe(state, profiles);
  require(oldId == "old-name", "slug comes from the name");
  joinMember(state, profiles, oldId);

  // A second, unrelated tribe: the rename must not touch its events.
  let otherId = switch (TribeLib.createTribe(state, profiles, OWNER, "Other Tribe", "", null, null)) {
    case (#ok(t)) t.id;
    case (#err(e)) Runtime.trap("createTribe(OTHER): " # debug_show e);
  };
  joinOther(state, profiles, otherId);

  let joined = memberEvent(state);
  require(attributedTribeId(state, joined.joinAt) == oldId, "pre-rename attribution is the old id");

  let newId = renameTribe(state, oldId, "New Name");
  require(newId == "new-name", "slug migrated to the new name");

  // D3: this is the line that used to point at the dead old id.
  require(attributedTribeId(state, joined.joinAt) == newId, "post-rename attribution is the new id");
  let stale = state.membershipHistory.filter(func(e : TribeTypes.MembershipEvent) : Bool { e.tribeId == oldId });
  require(stale.size() == 0, "no membership event keeps the old tribeId");
  switch (state.membershipHistory.find(func(e : TribeTypes.MembershipEvent) : Bool { Principal.equal(e.member, OTHER) })) {
    case (?e) require(e.tribeId == otherId, "unrelated tribe's event left untouched");
    case null Runtime.trap("OTHER membership event missing");
  };

  // A leave after the rename must close the migrated open event.
  leaveMember(state);
  let closed = memberEvent(state);
  require(closed.tribeId == newId, "closed event carries the new id");
  switch (closed.leaveAt) {
    case (?la) {
      // The window is closed: blocks at/after leaveAt attribute to no tribe.
      switch (TribeLib.tribeIdAt(state, MEMBER, la)) {
        case null {};
        case (?tid) Runtime.trap("post-leave attribution still " # tid);
      };
    };
    case null Runtime.trap("leaveAt not set — closeMembershipEvent missed the migrated open event");
  };
  switch (closed.leaveDay) {
    case (?_) {};
    case null Runtime.trap("leaveDay not set — closeMembershipEvent missed the migrated open event");
  };
});

// ── burn totals survive the rename ──────────────────────────────────────────

await Test.test("rename: pre-rename burn claims stay attributed to the renamed tribe", func() : async () {
  let state    = TribeLib.newState();
  let profiles = makeProfileState();
  let grit     = GritLib.newState();
  let oldId    = createOldNameTribe(state, profiles);
  joinMember(state, profiles, oldId);
  let joined = memberEvent(state);

  // A verified burn inside the membership window (claim day == join day).
  let claim : GritTypes.ClaimRecord = {
    txHash        = "0xd3";
    feeTxHash     = null;
    tokenAddress  = "0xakk";
    chain         = "base";
    tokenSymbol   = "AKK";
    tokenDecimals = 18;
    amountBurned  = 1.0;
    usdValue      = 42.0;
    gritMinted    = 0;
    status        = #verified;
    timestamp     = joined.joinAt;
    claimant      = MEMBER;
  };
  GritLib.storePendingClaim(grit, claim);

  let newId = renameTribe(state, oldId, "New Name");
  let summary = GritLib.getTribeBurnSummary(grit, newId, state.membershipHistory);
  require(summary.size() == 1, "one symbol aggregated for the renamed tribe");
  let (sym, total) = summary[0];
  require(sym == "AKK", "symbol preserved");
  require(total == 42.0, "pre-rename burn counted under the new tribeId");

  // The old id must not keep a ghost attribution.
  let staleSummary = GritLib.getTribeBurnSummary(grit, oldId, state.membershipHistory);
  require(staleSummary.size() == 0, "old tribeId has no burn attribution left");
});

// ── the migration preserves closed windows verbatim ─────────────────────────

await Test.test("rename: a closed membership window keeps its join/leave times", func() : async () {
  let state    = TribeLib.newState();
  let profiles = makeProfileState();
  let oldId    = createOldNameTribe(state, profiles);
  joinMember(state, profiles, oldId);
  leaveMember(state);

  let before = memberEvent(state);
  let joinDayBefore  = before.joinDay;
  let joinAtBefore   = before.joinAt;
  let leaveDayBefore = switch (before.leaveDay) {
    case (?d) d;
    case null Runtime.trap("precondition: leaveDay set");
  };
  let leaveAtBefore = switch (before.leaveAt) {
    case (?t) t;
    case null Runtime.trap("precondition: leaveAt set");
  };

  let newId = renameTribe(state, oldId, "New Name");
  let after = memberEvent(state);
  require(after.tribeId == newId, "closed event migrated to the new id");
  require(after.joinDay == joinDayBefore, "joinDay preserved");
  require(after.joinAt == joinAtBefore, "joinAt preserved");
  switch (after.leaveDay) {
    case (?d) require(d == leaveDayBefore, "leaveDay preserved");
    case null Runtime.trap("leaveDay dropped by the migration");
  };
  switch (after.leaveAt) {
    case (?t) require(t == leaveAtBefore, "leaveAt preserved");
    case null Runtime.trap("leaveAt dropped by the migration");
  };
});