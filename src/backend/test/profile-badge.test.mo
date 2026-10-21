// Player badge (PLAYER / SUPER PLAYER / ALPHA PLAYER) correctness for EVERY
// profile, not just self-visited ones.
//
// Bug being pinned: the badge level shown to a viewer comes from the STORED
// `playerBadgeLevel`, which is only ever written by `updatePlayerBadge()` —
// invoked when the profile OWNER mounts their own profile page. A player who
// never opened their own profile (e.g. any top player reached from the
// Skoreboard) has a stored level of 0, so their PUBLIC profile showed no badge
// even though their all-time AK69 score already qualifies them for one.
//
// Contract under test: the level a profile DISPLAYS is the stored ratchet
// raised to the tier the current score earns — it can lag the store but must
// never lag the score.
//
// These tests are RED against the pre-fix projection (stored level only).

import Test "mo:test/async";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";

func require(cond : Bool, msg : Text) {
  if (not cond) {
    Runtime.trap("FAIL: " # msg);
  };
};

let OWNER = Principal.fromText("aaaaa-aa");

func makeProfile(username : Text, playerBadgeLevel : Nat) : ProfileTypes.Profile = {
  username;
  displayName = username;
  bio = "";
  location = "";
  born = "";
  superpowers = "";
  profilePicture = "";
  coverImage = "";
  socials = [];
  evmAddress = null;
  hasOgBadge = false;
  playerBadgeLevel;
  miningStreak = 0;
  interests = "";
};

func makeProfileState(level : Nat) : ProfileLib.State {
  let state : ProfileLib.State = { profiles = Map.empty<Principal, ProfileTypes.Profile>() };
  state.profiles.add(OWNER, makeProfile("donovan", level));
  state;
};

await Test.test("badgeLevelForScore maps the all-time score onto the three tiers", func() : async () {
  require(ProfileLib.badgeLevelForScore(0.0) == 0, "score 0 earns no badge");
  require(ProfileLib.badgeLevelForScore(689.9) == 0, "below 690 earns no badge");
  require(ProfileLib.badgeLevelForScore(690.0) == 1, "690 earns PLAYER");
  require(ProfileLib.badgeLevelForScore(6899.0) == 1, "below 6900 stays PLAYER");
  require(ProfileLib.badgeLevelForScore(6900.0) == 2, "6900 earns SUPER PLAYER");
  require(ProfileLib.badgeLevelForScore(68999.0) == 2, "below 69000 stays SUPER PLAYER");
  require(ProfileLib.badgeLevelForScore(69000.0) == 3, "69000 earns ALPHA PLAYER");
});

func storedLevel(state : ProfileLib.State) : Nat {
  switch (state.profiles.get(OWNER)) {
    case null { Runtime.trap("FAIL: profile missing") };
    case (?p) p.playerBadgeLevel;
  };
};

await Test.test("updatePlayerBadgeLevel ratchets: upgrades the store, never downgrades", func() : async () {
  let state = makeProfileState(0);
  require(ProfileLib.updatePlayerBadgeLevel(state, OWNER, 7000.0), "update returns true for an existing profile");
  require(storedLevel(state) == 2, "store ratchets up to SUPER PLAYER");

  // A later score drop must not take the earned tier away.
  require(ProfileLib.updatePlayerBadgeLevel(state, OWNER, 100.0), "update returns true on the downgrade attempt");
  require(storedLevel(state) == 2, "store keeps SUPER PLAYER after the score drops");
});

await Test.test("effectiveBadgeLevel raises the stored ratchet to the earned tier", func() : async () {
  // THE reported bug: qualifying score, but no ratchet write ever ran.
  require(ProfileLib.effectiveBadgeLevel(0, 7000.0) == 2, "stored 0 + score 7000 must show SUPER PLAYER");
  require(ProfileLib.effectiveBadgeLevel(0, 690.0) == 1, "stored 0 + score 690 must show PLAYER");
  require(ProfileLib.effectiveBadgeLevel(0, 69000.0) == 3, "stored 0 + score 69000 must show ALPHA PLAYER");
  // Ratchet preserved: an earned level is never lowered by a later score drop.
  require(ProfileLib.effectiveBadgeLevel(2, 100.0) == 2, "stored 2 + score 100 keeps SUPER PLAYER");
  require(ProfileLib.effectiveBadgeLevel(3, 0.0) == 3, "stored 3 + score 0 keeps ALPHA PLAYER");
  // No qualification, no stored ratchet → nothing to show.
  require(ProfileLib.effectiveBadgeLevel(0, 100.0) == 0, "stored 0 + score 100 shows no badge");
  // The score tier wins wherever it is ahead of the store.
  require(ProfileLib.effectiveBadgeLevel(1, 70000.0) == 3, "score ahead of stored wins");
});

await Test.test("withBadgeScore projects the displayed level onto the public profile", func() : async () {
  let state = makeProfileState(0);
  let found = ProfileLib.getProfileByUsername(state, "donovan", func(_ : Principal) : ?Text { null });
  let pub = switch (found) {
    case null { Runtime.trap("FAIL: profile not found") };
    case (?p) p;
  };
  require(pub.playerBadgeLevel == 0, "raw projection carries the stored level");
  let shown = ProfileLib.withBadgeScore(pub, 7000.0);
  require(shown.playerBadgeLevel == 2, "public profile of a qualifying player must show SUPER PLAYER");
  // The projection must not touch anything else on the profile.
  require(shown.username == "donovan", "username preserved");
  require(shown.hasOgBadge == false, "hasOgBadge preserved");
  require(shown.interests == "", "interests preserved");
});
