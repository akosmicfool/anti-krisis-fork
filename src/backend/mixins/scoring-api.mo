import ScoringLib "../lib/scoring";
import ProfileLib "../lib/profile";
import ScoringTypes "../types/scoring";
import TribeLib "../lib/tribe";
import TestingTypes "../types/testing";

mixin (
  state        : ScoringLib.State,
  profileState : ProfileLib.State,
  tribeState   : TribeLib.State,
  testingState : TestingTypes.State,
) {
  /// Return top 9 players on the leaderboard for the given timescale.
  /// timescale: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "alltime"
  public shared query func getTopPlayers(timescale : Text) : async [ScoringTypes.PlayerScoreEntry] {
    ScoringLib.getTopPlayers(state, profileState, tribeState, timescale);
  };

  /// Return top 6 tribes (min 2 members) on the leaderboard for the given timescale.
  public shared query func getTopTribes(timescale : Text) : async [ScoringTypes.TribeScoreEntry] {
    ScoringLib.getTopTribes(state, tribeState, timescale);
  };

  /// Total number of registered players (profiles with a non-empty username).
  /// Not capped by the top-9 leaderboard window.
  public shared query func getPlayerCount() : async Nat {
    ScoringLib.playerCount(profileState);
  };

  /// Total number of tribes on the network (any member count).
  /// Not capped by the top-6 leaderboard window.
  public shared query func getTribeCount() : async Nat {
    ScoringLib.tribeCount(tribeState);
  };

  /// Return the AK69 score for a specific player and timescale.
  /// If a test override is active for this principal, the override is returned instead.
  public shared query ({ caller }) func getPlayerScore(principal : Principal, timescale : Text) : async Float {
    switch (testingState.overrides.get(principal)) {
      case (?override) { return override };
      case null {};
    };
    ScoringLib.getPlayerScore(state, principal, timescale);
  };

  /// Return the cumulative AK69 stockpile: sum of every player's all-time
  /// score (daily scores from genesis). Grows as days accrue.
  public shared query func getTotalAk69Score() : async Float {
    ScoringLib.getTotalAk69Score(state);
  };

  /// Return the 1-indexed rank of a player (sorted by AK69 score) across all players with a username.
  /// Returns null if the player has no profile/username.
  public shared query func getPlayerRank(principal : Principal, timescale : Text) : async ?Nat {
    ScoringLib.getPlayerRank(state, principal, timescale, profileState, tribeState);
  };

  /// Return the 1-indexed rank of a tribe (sorted by AK69 score) across all tribes with >= 2 members.
  /// Returns null if the tribe is not found.
  public shared query func getTribeRank(tribeId : Text, timescale : Text) : async ?Nat {
    ScoringLib.getTribeRank(state, tribeId, timescale, tribeState);
  };

  /// Return the AK69 composite score for a specific tribe and timescale.
  /// Uses block-time attributed tribe raws vs network totals. Returns 0 if tribe not found.
  public shared query func getTribeScore(tribeId : Text, timescale : Text) : async Float {
    switch (TribeLib.getTribe(tribeState, tribeId)) {
      case null  0.0;
      case (?tribe) {
        ScoringLib.tribeScore(state, tribe.id, timescale);
      };
    };
  };

  /// Membership-windowed by block-time attribution; unlike
  /// getTribeLiveStats/getTribeAkkFromHistory which sum over CURRENT members only.
  /// Sums the daily tribe raws (alltime) — a member who left still counts for the
  /// blocks they mined while in the tribe, and a joiner's pre-join blocks do not.
  /// Returns { totalGrit = 0; totalAkk = 0 } when the tribe does not exist.
  public shared query func getTribeWindowedTotals(
    tribeId : Text,
  ) : async { totalGrit : Nat; totalAkk : Nat } {
    switch (TribeLib.getTribe(tribeState, tribeId)) {
      case null { { totalGrit = 0; totalAkk = 0 } };
      case (?tribe) {
        ScoringLib.tribeWindowedTotals(state, tribe.id);
      };
    };
  };
};
