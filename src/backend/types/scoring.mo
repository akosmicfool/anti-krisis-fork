import TribeTypes "tribe";
import Map "mo:core/Map";

module {
  public type Timescale = { #daily; #weekly; #monthly; #quarterly; #yearly; #alltime };

  /// One day's raw contribution stats for a single player, attributed from
  /// mining block history. GRIT is what the player SPENT on mining that day;
  /// AKK is what the player WON that day. Both are immutable once written.
  public type DailyPlayerSnapshot = {
    dayKey     : Text;        // "YYYY-MM-DD" UTC
    principal  : Principal;
    gritSpent  : Nat;
    akkWon     : Nat;
  };

  /// One day's network-wide totals (same attribution rules as above).
  public type DailyNetworkSnapshot = {
    dayKey          : Text;
    totalGritSpent  : Nat;
    totalAkkWon     : Nat;
  };

  /// One day's raw contribution stats for a single tribe: sums of member
  /// contributions for blocks mined while the member was in the tribe
  /// (timestamp-prorated at block time).
  public type DailyTribeSnapshot = {
    dayKey    : Text;
    tribeId   : TribeTypes.TribeId;
    gritSpent : Nat;
    akkWon    : Nat;
  };

  /// Output for the players leaderboard.
  public type PlayerScoreEntry = {
    rank        : Nat;
    principal   : Principal;
    username    : Text;
    displayName : Text;
    tribeId     : ?TribeTypes.TribeId;
    tribeName   : Text;
    score       : Float;  // AK69 score (already scaled ×100 by dailyScore)
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
    // Map from compositeKey "dayKey|principal" → DailyPlayerSnapshot
    playerSnapshots  : Map.Map<Text, DailyPlayerSnapshot>;
    // Map from compositeTribeKey "dayKey|tribeId" → DailyTribeSnapshot
    tribeSnapshots   : Map.Map<Text, DailyTribeSnapshot>;
  };
};
