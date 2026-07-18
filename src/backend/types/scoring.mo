import TribeTypes "tribe";
import Common "common";
import Map "mo:core/Map";

module {
  public type Timescale = { #weekly; #monthly; #quarterly; #yearly; #alltime };

  /// One day's raw stats for a single player.
  public type DailyPlayerSnapshot = {
    dayKey     : Text;        // "YYYY-MM-DD" UTC
    principal  : Principal;
    gritEarned : Nat;         // GRIT credited to this player on this day
    akkWon     : Nat;         // AKK won by this player on this day
  };

  /// One day's network-wide totals.
  public type DailyNetworkSnapshot = {
    dayKey          : Text;
    totalGritEarned : Nat;
    totalAkkWon     : Nat;
  };

  /// Output for the players leaderboard.
  public type PlayerScoreEntry = {
    rank        : Nat;
    principal   : Principal;
    username    : Text;
    displayName : Text;
    tribeId     : ?TribeTypes.TribeId;
    tribeName   : Text;
    score       : Float;  // AK69 score × 100 for display
  };

  /// Output for the tribes leaderboard.
  public type TribeScoreEntry = {
    rank        : Nat;
    tribeId     : TribeTypes.TribeId;
    tribeName   : Text;
    memberCount : Nat;
    score       : Float;
  };

  public type State = {
    // Map from dayKey → DailyNetworkSnapshot
    networkSnapshots : Map.Map<Text, DailyNetworkSnapshot>;
    // Map from "dayKey|principal" → DailyPlayerSnapshot
    playerSnapshots  : Map.Map<Text, DailyPlayerSnapshot>;
    // Running cumulative stats per player (last known total GRIT & AKK)
    // Used to compute per-day deltas.
    playerLastTotals : Map.Map<Principal, { grit : Nat; akk : Nat }>;
    // Running cumulative network totals (last snapshot)
    lastNetworkTotals : { var grit : Nat; var akk : Nat };
  };
};
