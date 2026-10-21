// D4: membership-windowed tribe totals (ScoringLib.tribeWindowedTotals).
//
// The daily tribeSnapshots are written by applyBlock at BLOCK TIME through
// TribeLib.tribeIdAt, so every raw already encodes the membership window: a
// block counts for the tribe the contributor belonged to when the block
// closed. tribeWindowedTotals is a plain read of those immutable raws, which
// makes it the opposite of the current-member sums (getTribeLiveStats /
// getTribeAkkFromHistory): the live sums SHRINK when a member leaves and
// absorb a joiner's entire pre-join history.
//
// Invariants pinned here:
//   - a block's gritSpent / akkWon land in exactly one tribe's windowed total;
//   - a member who LEFT still counts for the blocks mined while in the tribe;
//   - an unknown tribe sums to zero.

import Test "mo:test/async";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import ScoringLib "../lib/scoring";
import TribeLib "../lib/tribe";
import TribeTypes "../types/tribe";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import GritLib "../lib/grit";
import MiningLib "../lib/mining";
import MiningTypes "../types/mining";

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
  displayName      = username;
  bio              = "";
  location         = "";
  born             = "";
  superpowers      = "";
  profilePicture   = "";
  coverImage       = "";
  socials          = [];
  evmAddress       = null;
  hasOgBadge       = false;
  playerBadgeLevel = 0;
  miningStreak     = 0;
  interests        = "";
};

func makeProfileState() : ProfileLib.State {
  let state : ProfileLib.State = { profiles = Map.empty<Principal, ProfileTypes.Profile>() };
  state.profiles.add(OWNER, makeProfile("owner"));
  state.profiles.add(MEMBER, makeProfile("member"));
  state.profiles.add(OTHER, makeProfile("other"));
  state;
};

func createTribe(state : TribeLib.State, profiles : ProfileLib.State, name : Text) : TribeTypes.TribeId {
  switch (TribeLib.createTribe(state, profiles, OWNER, name, "", null, null)) {
    case (#ok(t)) t.id;
    case (#err(e)) Runtime.trap("createTribe: " # debug_show e);
  };
};

func join(state : TribeLib.State, profiles : ProfileLib.State, who : Principal, tribeId : TribeTypes.TribeId) {
  switch (TribeLib.joinTribe(state, profiles, who, tribeId, 0, 0)) {
    case (#ok(_)) {};
    case (#err(e)) Runtime.trap("joinTribe: " # debug_show e);
  };
};

func leave(state : TribeLib.State, who : Principal) {
  switch (TribeLib.leaveTribe(state, who, 0, 0)) {
    case (#ok) {};
    case (#err(e)) Runtime.trap("leaveTribe: " # debug_show e);
  };
};

/// The member's join timestamp — the test runtime has a real clock (Time.now()
/// is 42 here), so blocks must be stamped from the recorded window, not a
/// literal 0.
func joinedAt(state : TribeLib.State, who : Principal) : Int {
  switch (state.membershipHistory.find(func(e : TribeTypes.MembershipEvent) : Bool { Principal.equal(e.member, who) })) {
    case null Runtime.trap("no membership event for " # who.toText());
    case (?e) e.joinAt;
  };
};

/// One block: `minerId` spends `grit` and `winner` is credited `akk`.
func block(minerId : MiningTypes.MinerId, winner : Principal, grit : Nat, akk : Nat, ts : Int) : MiningTypes.BlockRecord = {
  blockNumber       = 1;
  timestamp         = ts;
  winnerMinerId     = ?minerId;
  winnerOwner       = ?winner;
  akkReward         = akk;
  totalGritSpent    = grit;
  minerParticipants = [(minerId, winner)];
  minerGritSpent    = [(minerId, grit)];
  minerWeights      = [(minerId, 1.0)];
  vrfValue          = 0;
};

// ── attribution lands in exactly one tribe ──────────────────────────────────

await Test.test("windowed totals sum the block-time raws of one tribe only", func() : async () {
  let tribeState   = TribeLib.newState();
  let profiles     = makeProfileState();
  let scoringState = ScoringLib.newState();

  let t1 = createTribe(tribeState, profiles, "Tribe One");
  let t2 = createTribe(tribeState, profiles, "Tribe Two");
  join(tribeState, profiles, MEMBER, t1);
  join(tribeState, profiles, OTHER, t2);

  // Blocks stamped at each member's joinAt are inside their windows.
  ScoringLib.applyBlock(scoringState, tribeState, block(1, MEMBER, 500, 700, joinedAt(tribeState, MEMBER)));
  ScoringLib.applyBlock(scoringState, tribeState, block(2, OTHER, 30, 40, joinedAt(tribeState, OTHER)));

  let one = ScoringLib.tribeWindowedTotals(scoringState, t1);
  require(one.totalGrit == 500, "t1 gritSpent is the member's block-time spend");
  require(one.totalAkk == 700, "t1 akkWon is the winner's block reward");

  let two = ScoringLib.tribeWindowedTotals(scoringState, t2);
  require(two.totalGrit == 30, "t2 gritSpent is its own member's spend");
  require(two.totalAkk == 40, "t2 akkWon is its own member's reward");

  let none = ScoringLib.tribeWindowedTotals(scoringState, "no-such-tribe");
  require(none.totalGrit == 0 and none.totalAkk == 0, "unknown tribe sums to zero");
});

// ── the totals are historical: leaving does not subtract ────────────────────

await Test.test("windowed totals keep an ex-member's blocks; live stats drop them", func() : async () {
  let tribeState   = TribeLib.newState();
  let profiles     = makeProfileState();
  let scoringState = ScoringLib.newState();
  let gritState    = GritLib.newState();
  let miningState  = MiningLib.newMiningState();

  let t1 = createTribe(tribeState, profiles, "Tribe One");
  join(tribeState, profiles, MEMBER, t1);

  // The member mines a block while in the tribe.
  ScoringLib.applyBlock(scoringState, tribeState, block(1, MEMBER, 500, 700, joinedAt(tribeState, MEMBER)));

  // The lifetime accumulators the live-stats sum reads (same values the
  // credit path writes for the same block).
  gritState.totalEarned.add(MEMBER, 500);
  miningState.totalAkkWonByUser.add(MEMBER, 700);

  let liveWhileMember = switch (TribeLib.getTribeLiveStats(tribeState, gritState, miningState, t1)) {
    case (?s) s;
    case null Runtime.trap("live stats missing while member");
  };
  require(liveWhileMember.totalGrit == 500 and liveWhileMember.totalAkk == 700, "live stats count the member");

  leave(tribeState, MEMBER);

  let liveAfter = switch (TribeLib.getTribeLiveStats(tribeState, gritState, miningState, t1)) {
    case (?s) s;
    case null Runtime.trap("live stats missing after leave");
  };
  require(liveAfter.totalGrit == 0 and liveAfter.totalAkk == 0, "live stats collapse when the member leaves");

  // The D4 invariant: the windowed total is a read of immutable block-time
  // raws — the ex-member's block still belongs to the tribe's history.
  let windowed = ScoringLib.tribeWindowedTotals(scoringState, t1);
  require(windowed.totalGrit == 500, "windowed grit survives the leave");
  require(windowed.totalAkk == 700, "windowed AKK survives the leave");
});
