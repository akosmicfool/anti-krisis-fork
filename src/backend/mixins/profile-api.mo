import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import ScoringLib "../lib/scoring";
import GritLib "../lib/grit";
import MiningLib "../lib/mining";
import TribeLib "../lib/tribe";

mixin (
  profileState : ProfileLib.State,
  scoringState : ScoringLib.State,
  gritState    : GritLib.State,
  miningState  : MiningLib.State,
  tribeState   : TribeLib.State,
) {
  /// Look up the tribe a principal belongs to (null if none).
  func getTribeForPrincipal(p : Principal) : ?Text {
    tribeState.memberTribeMap.get(p);
  };

  /// Get the calling user's own profile, with tribeId populated.
  public shared query ({ caller }) func getMyProfile() : async ?ProfileTypes.PublicProfile {
    ProfileLib.getProfile(profileState, caller, getTribeForPrincipal);
  };

  /// Returns true if the caller already has a profile with a non-empty username set.
  /// Used by the frontend to decide whether to show the first-login username prompt.
  public shared query ({ caller }) func hasUsername() : async Bool {
    ProfileLib.hasUsername(profileState, caller);
  };

  /// Returns true if the given username is not currently held by any other principal.
  public shared query ({ caller }) func isUsernameAvailable(username : Text) : async Bool {
    ProfileLib.isUsernameAvailable(profileState, caller, username);
  };

  /// Fetch any user's public profile by username (read-only, no auth required), with tribeId populated.
  public shared query func getProfileByUsername(username : Text) : async ?ProfileTypes.PublicProfile {
    ProfileLib.getProfileByUsername(profileState, username, getTribeForPrincipal);
  };

  /// Reverse lookup: return the principal that owns a given username, or null if not found.
  public shared query func getPrincipalByUsername(username : Text) : async ?Principal {
    ProfileLib.getPrincipalByUsername(profileState, username);
  };

  /// Recompute and store the player badge level for the calling user based on their current AK69 score.
  /// Badge level is a ratchet — it only increases, never decreases.
  /// Returns #ok on success, #err("Profile not found") if the caller has no profile.
  public shared ({ caller }) func updatePlayerBadge() : async { #ok; #err : Text } {
    let score = ScoringLib.playerScore(scoringState, caller, "alltime");
    if (ProfileLib.updatePlayerBadgeLevel(profileState, caller, score)) {
      #ok;
    } else {
      #err("Profile not found");
    };
  };

  /// Claim the OG NFT badge for the calling user's profile.
  /// The frontend must verify NFT ownership before calling this.
  /// Returns #ok(()) on success, #err("Profile not found") if the caller has no profile.
  public shared ({ caller }) func claimOgBadge() : async { #ok; #err : Text } {
    if (ProfileLib.claimOgBadge(profileState, caller)) {
      #ok;
    } else {
      #err("Profile not found");
    };
  };

  /// Return the mining streak (consecutive active days) for any principal.
  public shared query func getPlayerStreak(p : Principal) : async Nat {
    ProfileLib.getMiningStreak(profileState, p);
  };

  /// Create or update the calling user's profile.
  /// Returns #err with a typed ProfileError variant on validation or uniqueness failure.
  public shared ({ caller }) func saveMyProfile(
    input : ProfileTypes.ProfileInput,
  ) : async { #ok : ProfileTypes.Profile; #err : ProfileTypes.ProfileError } {
    ProfileLib.saveProfile(profileState, caller, input);
  };
};
