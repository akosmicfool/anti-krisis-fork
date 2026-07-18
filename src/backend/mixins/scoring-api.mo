import ScoringLib "../lib/scoring";
import ProfileLib "../lib/profile";
import ScoringTypes "../types/scoring";
import GritLib "../lib/grit";
import MiningLib "../lib/mining";
import TribeLib "../lib/tribe";
import TestingTypes "../types/testing";

mixin (
  state        : ScoringLib.State,
  gritState    : GritLib.State,
  miningState  : MiningLib.State,
  profileState : ProfileLib.State,
  tribeState   : TribeLib.State,
  testingState : TestingTypes.State,
) {
  /// Return top 9 players on the leaderboard for the given timescale.
  /// timescale: "weekly" | "monthly" | "quarterly" | "yearly" | "alltime"
  public shared query func getTopPlayers(timescale : Text) : async [ScoringTypes.PlayerScoreEntry] {
    ScoringLib.getTopPlayers(state, gritState, miningState, profileState, tribeState, timescale);
  };

  /// Return top 6 tribes (min 2 members) on the leaderboard for the given timescale.
  public shared query func getTopTribes(timescale : Text) : async [ScoringTypes.TribeScoreEntry] {
    ScoringLib.getTopTribes(state, tribeState, gritState, miningState, timescale);
  };

  /// Return the AK69 score for a specific player and timescale.
  /// Return the AK69 score for a specific player and timescale.
  /// If the caller is the player and a test override is active, the override is returned instead.
  public shared query ({ caller }) func getPlayerScore(principal : Principal, timescale : Text) : async Float {
    // If there is a test score override for this principal, return it
    switch (testingState.overrides.get(principal)) {
      case (?override) { return override };
      case null {};
    };
    ScoringLib.getPlayerScore(state, principal, timescale, gritState, miningState);
  };

  /// Return the all-time cumulative AK69 score accrued by all players combined.
  public shared query func getTotalAk69Score() : async Float {
    ScoringLib.getTotalAk69Score(state, gritState, miningState);
  };

  /// Return the all-time cumulative AK69 score computed from historical daily snapshots.
  /// More accurate than getTotalAk69Score() when snapshots exist; falls back to live scores.
  public shared query func getHistoryBasedAk69Stockpile() : async Float {
    ScoringLib.getHistoryBasedAk69Stockpile(state, gritState, miningState);
  };

  /// Return the 1-indexed rank of a player (sorted by AK69 score) across all players with a username.
  /// Returns null if the player has no profile/username.
  public shared query func getPlayerRank(principal : Principal, timescale : Text) : async ?Nat {
    ScoringLib.getPlayerRank(state, principal, timescale, gritState, miningState, profileState, tribeState);
  };

  /// Return the 1-indexed rank of a tribe (sorted by AK69 score) across all tribes with >= 2 members.
  /// Returns null if the tribe is not found.
  public shared query func getTribeRank(tribeId : Text, timescale : Text) : async ?Nat {
    ScoringLib.getTribeRank(state, tribeId, timescale, tribeState, gritState, miningState);
  };

  /// Return the AK69 composite score for a specific tribe and timescale.
  /// Uses the same tribeScore logic as the leaderboard — normalised GRIT + AKK
  /// of all members combined vs the network. Returns 0 if tribe not found.
  public shared query func getTribeScore(tribeId : Text, timescale : Text) : async Float {
    switch (TribeLib.getTribe(tribeState, tribeId)) {
      case null  0.0;
      case (?tribe) {
        ScoringLib.tribeScore(state, tribeState, gritState, miningState, tribe, timescale);
      };
    };
  };
};
