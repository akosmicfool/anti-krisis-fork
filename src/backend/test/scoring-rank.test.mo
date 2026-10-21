// Ranking order everywhere must be DESCENDING: rank 1 = HIGHEST AK69 score.
//
// Bug being pinned: the four ranking comparators in lib/scoring.mo sorted
// ASCENDING (they returned #less when the FIRST element was SMALLER) while the
// frontend Skoreboard re-sorts descending. The two rankings therefore
// disagreed: the Skoreboard's #1 player showed a worse rank on their profile.
//
// Invariants pinned here:
//   - getPlayerRank: highest all-time score is ?1 (same for getTopPlayers ranks);
//   - zero-score players sit BELOW every scored player;
//   - getTribeRank / getTopTribes: highest-scoring two-member tribe is rank 1.
//
// These tests are RED against the pre-fix (ascending) comparators.

import Test "mo:test/async";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import ScoringLib "../lib/scoring";
import ScoringTypes "../types/scoring";
import TribeLib "../lib/tribe";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

func requireRank(r : ?Nat, want : Nat, msg : Text) {
  switch (r) {
    case (?n) require(n == want, msg # " (expected " # debug_show want # ", got " # debug_show n # ")");
    case null Runtime.trap("FAIL: " # msg # " (expected " # debug_show want # ", got null)");
  };
};

func requireRankAtLeast(r : ?Nat, floor : Nat, msg : Text) {
  switch (r) {
    case (?n) require(n >= floor, msg # " (expected >= " # debug_show floor # ", got " # debug_show n # ")");
    case null Runtime.trap("FAIL: " # msg # " (expected >= " # debug_show floor # ", got null)");
  };
};

// Principal literals proven by the passing suite (a malformed literal traps at
// runtime with "invalid principal. Did you mean ...").
let TOP   = Principal.fromText("tw5li-m6k77-xa7ab-7acaa");
let MID   = Principal.fromText("y6f5k-y5eji-aaaaa-aaaap-yai");
let LOW   = Principal.fromText("5xeni-lmkoa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaq");
let ZERO1 = Principal.fromText("aaaaa-aa");
let ZERO2 = Principal.fromText("pxtku-i4koa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaa-aaaaq");

func makeProfile(username : Text) : ProfileTypes.Profile = {
  username;
  displayName      = username;
  bio              = "";
  location         = "";
  born             = "";
  superpowers      = "";
  profilePicture   = "";
  coverImage      = "";
  socials          = [];
  evmAddress       = null;
  hasOgBadge       = false;
  playerBadgeLevel = 0;
  miningStreak     = 0;
  interests        = "";
};

/// Five registered players: three with positive scores, two with no snapshots
/// at all (score 0.0).
func makeProfileState() : ProfileLib.State {
  let state : ProfileLib.State = { profiles = Map.empty<Principal, ProfileTypes.Profile>() };
  state.profiles.add(TOP,   makeProfile("top"));
  state.profiles.add(MID,   makeProfile("mid"));
  state.profiles.add(LOW,   makeProfile("low"));
  state.profiles.add(ZERO1, makeProfile("zero-one"));
  state.profiles.add(ZERO2, makeProfile("zero-two"));
  state;
};

/// One day with network totals (1000, 1000); dailyScore scales ×100:
/// TOP (1000, 1000) → 100.0, MID (500, 500) → 50.0, LOW (100, 100) → 10.0.
/// The alltime read path matches player snapshots on snap.principal, so the
/// map keys only need to be unique.
func makeScores() : ScoringLib.State {
  let state = ScoringLib.newState();
  let net : ScoringTypes.DailyNetworkSnapshot = {
    dayKey = "2026-01-01";
    totalGritSpent = 1000;
    totalAkkWon = 1000;
  };
  state.networkSnapshots.add("2026-01-01", net);

  let top : ScoringTypes.DailyPlayerSnapshot = { dayKey = "2026-01-01"; principal = TOP; gritSpent = 1000; akkWon = 1000 };
  let mid : ScoringTypes.DailyPlayerSnapshot = { dayKey = "2026-01-01"; principal = MID; gritSpent = 500;  akkWon = 500 };
  let low : ScoringTypes.DailyPlayerSnapshot = { dayKey = "2026-01-01"; principal = LOW; gritSpent = 100;  akkWon = 100 };
  state.playerSnapshots.add("2026-01-01|top", top);
  state.playerSnapshots.add("2026-01-01|mid", mid);
  state.playerSnapshots.add("2026-01-01|low", low);
  state;
};

func createTribe(state : TribeLib.State, profiles : ProfileLib.State, owner : Principal, name : Text) : Text {
  switch (TribeLib.createTribe(state, profiles, owner, name, "", null, null)) {
    case (#ok(t)) t.id;
    case (#err(e)) Runtime.trap("createTribe: " # debug_show e);
  };
};

func join(state : TribeLib.State, profiles : ProfileLib.State, who : Principal, tribeId : Text) {
  switch (TribeLib.joinTribe(state, profiles, who, tribeId, 0, 0)) {
    case (#ok(_)) {};
    case (#err(e)) Runtime.trap("joinTribe: " # debug_show e);
  };
};

/// Two two-member tribes with distinct scores: alpha (TOP + MID) 80.0,
/// beta (ZERO1 + ZERO2) 20.0. Tribe alltime scores read tribeSnapshots on
/// snap.tribeId, so the map keys only need to be unique.
func makeWorld() : (ScoringLib.State, ProfileLib.State, TribeLib.State, Text, Text) {
  let scores   = makeScores();
  let profiles = makeProfileState();
  let tribes   = TribeLib.newState();

  let alpha = createTribe(tribes, profiles, TOP, "Alpha Tribe");
  join(tribes, profiles, MID, alpha);
  join(tribes, profiles, TOP, alpha);
  let beta = createTribe(tribes, profiles, ZERO1, "Beta Tribe");
  join(tribes, profiles, ZERO2, beta);
  join(tribes, profiles, ZERO1, beta);

  let alphaSnap : ScoringTypes.DailyTribeSnapshot = { dayKey = "2026-01-01"; tribeId = alpha; gritSpent = 800; akkWon = 800 };
  let betaSnap  : ScoringTypes.DailyTribeSnapshot = { dayKey = "2026-01-01"; tribeId = beta;  gritSpent = 200; akkWon = 200 };
  scores.tribeSnapshots.add("2026-01-01|" # alpha, alphaSnap);
  scores.tribeSnapshots.add("2026-01-01|" # beta, betaSnap);

  (scores, profiles, tribes, alpha, beta);
};

// ── player ranks are descending ─────────────────────────────────────────────

await Test.test("getPlayerRank: highest all-time score is rank 1", func() : async () {
  let (scores, profiles, tribes, _, _) = makeWorld();
  requireRank(ScoringLib.getPlayerRank(scores, TOP, "alltime", profiles, tribes), 1, "top scorer (100.0) must rank 1");
  requireRank(ScoringLib.getPlayerRank(scores, MID, "alltime", profiles, tribes), 2, "middle scorer (50.0) must rank 2");
  requireRank(ScoringLib.getPlayerRank(scores, LOW, "alltime", profiles, tribes), 3, "lowest scorer (10.0) must rank 3");
});

// ── the emitted leaderboard agrees: rank 1 = top, descending scores ─────────

await Test.test("getTopPlayers: rank 1 is the top scorer and scores strictly decrease", func() : async () {
  let (scores, profiles, tribes, _, _) = makeWorld();
  let entries = ScoringLib.getTopPlayers(scores, profiles, tribes, "alltime");

  require(entries.size() == 3, "exactly the three scored players are listed (score > 0 filter)");
  require(entries[0].rank == 1, "first entry carries rank 1");
  require(Principal.equal(entries[0].principal, TOP), "first entry is the top scorer");
  require(entries[1].rank == 2 and entries[2].rank == 3, "emitted ranks follow the descending order");
  require(entries[0].score > entries[1].score, "scores strictly decreasing (100.0 > 50.0)");
  require(entries[1].score > entries[2].score, "scores strictly decreasing (50.0 > 10.0)");
});

// ── zero-score players rank below every scored player ───────────────────────

await Test.test("getPlayerRank: zero-score players sit below every scored player", func() : async () {
  let (scores, profiles, tribes, _, _) = makeWorld();
  requireRankAtLeast(ScoringLib.getPlayerRank(scores, ZERO1, "alltime", profiles, tribes), 4, "zero-one must rank below the three scored players");
  requireRankAtLeast(ScoringLib.getPlayerRank(scores, ZERO2, "alltime", profiles, tribes), 4, "zero-two must rank below the three scored players");
});

// ── tribe ranks are descending too ──────────────────────────────────────────

await Test.test("tribe rankings: highest tribal score is rank 1", func() : async () {
  let (scores, _, tribes, alpha, beta) = makeWorld();
  requireRank(ScoringLib.getTribeRank(scores, alpha, "alltime", tribes), 1, "higher-scoring tribe (80.0) must rank 1");
  requireRank(ScoringLib.getTribeRank(scores, beta, "alltime", tribes), 2, "lower-scoring tribe (20.0) must rank 2");

  let entries = ScoringLib.getTopTribes(scores, tribes, "alltime");
  require(entries.size() == 2, "both two-member tribes are listed");
  require(entries[0].rank == 1, "first entry carries rank 1");
  require(entries[0].tribeId == alpha, "first entry is the top tribe");
  require(entries[1].tribeId == beta, "second entry is the lower-scoring tribe");
  require(entries[0].score > entries[1].score, "tribe scores strictly decreasing (80.0 > 20.0)");
});
