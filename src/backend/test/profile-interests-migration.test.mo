// D14 migration test: the profile record gained `interests : Text` (appended
// LAST), so every stored profile must be re-typed by the migration transform
// with interests = "" and every pre-existing field preserved. A wrong
// migration bricks the next upgrade, so pin the transformation.

import Test "mo:test/async";
import Migration "../migrations/20260918_000000";

func require(cond : Bool, msg : Text) {
  if (not cond) { Runtime.trap("FAIL: " # msg) };
};

await Test.test("D14: migration preserves every profile field and defaults interests to empty", func() : async () {
  let old : Migration.ProfileOld = {
    username = "alice";
    displayName = "Alice";
    bio = "bio";
    location = "Lisbon";
    born = "1990";
    superpowers = "shipping";
    profilePicture = "pic";
    coverImage = "cover";
    socials = [{ name = "x"; url = "https://x.com/alice" }];
    evmAddress = ?"0xabc";
    hasOgBadge = true;
    playerBadgeLevel = 2;
    miningStreak = 7;
  };
  let fresh = Migration.migrationUpgradeProfile(old);
  require(fresh.username == "alice", "username preserved");
  require(fresh.displayName == "Alice", "displayName preserved");
  require(fresh.bio == "bio", "bio preserved");
  require(fresh.location == "Lisbon", "location preserved");
  require(fresh.born == "1990", "born preserved");
  require(fresh.superpowers == "shipping", "superpowers preserved");
  require(fresh.profilePicture == "pic", "profilePicture preserved");
  require(fresh.coverImage == "cover", "coverImage preserved");
  require(fresh.socials.size() == 1 and fresh.socials[0].url == "https://x.com/alice", "socials preserved");
  require(fresh.evmAddress == ?"0xabc", "evmAddress preserved");
  require(fresh.hasOgBadge, "hasOgBadge preserved");
  require(fresh.playerBadgeLevel == 2, "playerBadgeLevel preserved");
  require(fresh.miningStreak == 7, "miningStreak preserved");
  // The appended field must default to empty — the feature did not exist
  // before this version, so no value can be derived from old state.
  require(fresh.interests == "", "interests must default to empty");
});
