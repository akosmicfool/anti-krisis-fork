import AllowlistLib "../lib/allowlist";
import ProfileLib   "../lib/profile";
import ScoringLib   "../lib/scoring";
import GritLib      "../lib/grit";
import MiningLib    "../lib/mining";
import TestingTypes "../types/testing";

mixin (
  testingState : TestingTypes.State,
  adminState   : AllowlistLib.AdminState,
  profileState : ProfileLib.State,
) {
  /// Admin-only: set a test AK69 score override for the caller's own principal.
  /// Updates playerBadgeLevel directly (bypasses ratchet — allows reset to lower levels).
  /// score thresholds: <690 → 0, ≥690 → 1, ≥6900 → 2, ≥69000 → 3
  public shared ({ caller }) func setTestScore(score : Float) : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err("Unauthorized");
    };
    testingState.overrides.add(caller, score);
    // Directly set badge level (bypass ratchet for testing)
    let newLevel : Nat = if (score >= 69000.0) 3
      else if (score >= 6900.0)  2
      else if (score >= 690.0)   1
      else 0;
    switch (ProfileLib.getProfile(profileState, caller, func(_ : Principal) : ?Text { null })) {
      case null {
        #err("Profile not found — save a profile first before testing badge levels");
      };
      case (?existing) {
        profileState.profiles.add(caller, { existing with playerBadgeLevel = newLevel });
        #ok;
      };
    };
  };

  /// Admin-only: clear the test score override for the caller and reset playerBadgeLevel to 0.
  /// After clearing, the real AK69 score will be used again (call updatePlayerBadge() to recompute).
  public shared ({ caller }) func clearTestScore() : async { #ok; #err : Text } {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return #err("Unauthorized");
    };
    testingState.overrides.remove(caller);
    // Reset badge level to 0 — caller should invoke updatePlayerBadge() afterward
    // to restore the real badge level from their actual AK69 score.
    switch (ProfileLib.getProfile(profileState, caller, func(_ : Principal) : ?Text { null })) {
      case null { #err("Profile not found") };
      case (?existing) {
        profileState.profiles.add(caller, { existing with playerBadgeLevel = 0 });
        #ok;
      };
    };
  };

  /// Admin-only query: return the current test score override for the caller, or null if none is set.
  public shared query ({ caller }) func getTestScore() : async ?Float {
    if (not AllowlistLib.isAdmin(adminState, caller)) {
      return null;
    };
    testingState.overrides.get(caller);
  };
};
