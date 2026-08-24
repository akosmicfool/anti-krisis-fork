import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import ScoringTypes "../types/scoring";
import TribeTypes "../types/tribe";
import MiningTypes "../types/mining";
import MiningLib "mining";
import TribeLib "tribe";
import ProfileLib "profile";

module {

  public type State = ScoringTypes.State;

  public func newState() : State {
    {
      networkSnapshots = Map.empty();
      playerSnapshots  = Map.empty();
      tribeSnapshots   = Map.empty();
    };
  };

  // ─── Time helpers ───────────────────────────────────────────────────────────

  /// Derive UTC dayKey ("YYYY-MM-DD") from a nanosecond timestamp.
  func dayKey(ts : Int) : Text {
    let secs = ts / 1_000_000_000;
    let days = secs / 86_400;
    let z = days + 719_468;
    let era = (if (z >= 0) z else z - 146_096) / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + (if (mp < 10) 3 else -9);
    let yr = y + (if (m <= 2) 1 else 0);
    let ys = yr.toText();
    let ms = if (m < 10) "0" # m.toText() else m.toText();
    let ds = if (d < 10) "0" # d.toText() else d.toText();
    ys # "-" # ms # "-" # ds;
  };

  public func currentDayKey() : Text {
    dayKey(Time.now());
  };

  func digitVal(c : Char) : Int {
    switch (c) {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
      case '5' 5; case '6' 6; case '7' 7; case '8' 8; case '9' 9;
      case _ -1;
    };
  };

  /// Convert a UTC dayKey ("YYYY-MM-DD") to the nanosecond timestamp of that
  /// day's 00:00:00 UTC. Returns 0 for malformed input.
  public func dayKeyToTs(day : Text) : Int {
    var pos : Nat = 0;
    var y : Int = 0;
    var m : Int = 0;
    var d : Int = 0;
    var ok = true;
    for (c in day.chars()) {
      let v = digitVal(c);
      if (v < 0) {
        if (pos != 4 and pos != 7) { ok := false };
      } else if (pos <= 3) {
        y := y * 10 + v;
      } else if (pos == 5 or pos == 6) {
        m := m * 10 + v;
      } else if (pos == 8 or pos == 9) {
        d := d * 10 + v;
      } else {
        ok := false;
      };
      pos += 1;
    };
    if (not ok or pos != 10 or m < 1 or m > 12 or d < 1 or d > 31) { return 0 };
    // days_from_civil (Howard Hinnant)
    let yy = if (m <= 2) y - 1 else y;
    let era = (if (yy >= 0) yy else yy - 399) / 400;
    let yoe = yy - era * 400;
    let mp0 = (if (m > 2) m - 3 else m + 9);
    let doy = (153 * mp0 + 2) / 5 + d - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    let days = era * 146_097 + doe - 719_468;
    days * 86_400 * 1_000_000_000;
  };

  /// Seconds until the next 00:00:00 UTC (minimum 1).
  public func secondsUntilNextUtcMidnight() : Nat {
    let secs = Time.now() / 1_000_000_000;
    let secOfDay = Int.abs(secs % 86_400);
    let rem = 86_400 - secOfDay;
    if (rem <= 0) 86_400 else rem;
  };

  func compositeKey(day : Text, p : Principal) : Text {
    day # "|" # p.toText();
  };

  func compositeTribeKey(day : Text, tribeId : TribeTypes.TribeId) : Text {
    day # "|" # tribeId;
  };

  // ─── Core formula ───────────────────────────────────────────────────────────

  /// AK69 daily score: equal-weight normalized GRIT spent and normalized AKK won,
  /// scaled ×100. Returns 0 whenever the corresponding network total is 0.
  public func dailyScore(
    playerGritSpent : Nat,
    playerAkkWon    : Nat,
    netGritSpent    : Nat,
    netAkkWon       : Nat,
  ) : Float {
    let normGrit : Float = if (netGritSpent == 0) 0.0
      else playerGritSpent.toFloat() / netGritSpent.toFloat();
    let normAkk : Float = if (netAkkWon == 0) 0.0
      else playerAkkWon.toFloat() / netAkkWon.toFloat();
    (0.5 * normGrit + 0.5 * normAkk) * 100.0;
  };

  // ─── Attribution ────────────────────────────────────────────────────────────

  func addPlayerRaw(state : State, day : Text, p : Principal, gritDelta : Nat, akkDelta : Nat) {
    let key = compositeKey(day, p);
    let snap = switch (state.playerSnapshots.get(key)) {
      case null  { { dayKey = day; principal = p; gritSpent = gritDelta; akkWon = akkDelta } };
      case (?s)  { { dayKey = day; principal = p; gritSpent = s.gritSpent + gritDelta; akkWon = s.akkWon + akkDelta } };
    };
    state.playerSnapshots.add(key, snap);
  };

  func addNetworkRaw(state : State, day : Text, gritDelta : Nat, akkDelta : Nat) {
    let snap = switch (state.networkSnapshots.get(day)) {
      case null  { { dayKey = day; totalGritSpent = gritDelta; totalAkkWon = akkDelta } };
      case (?n)  { { dayKey = day; totalGritSpent = n.totalGritSpent + gritDelta; totalAkkWon = n.totalAkkWon + akkDelta } };
    };
    state.networkSnapshots.add(day, snap);
  };

  func addTribeRaw(state : State, day : Text, tribeId : TribeTypes.TribeId, gritDelta : Nat, akkDelta : Nat) {
    let key = compositeTribeKey(day, tribeId);
    let snap = switch (state.tribeSnapshots.get(key)) {
      case null  { { dayKey = day; tribeId; gritSpent = gritDelta; akkWon = akkDelta } };
      case (?s)  { { dayKey = day; tribeId; gritSpent = s.gritSpent + gritDelta; akkWon = s.akkWon + akkDelta } };
    };
    state.tribeSnapshots.add(key, snap);
  };

  /// Attribute one mined block to players, the network, and tribes (timestamp-
  /// prorated via membership windows). Idempotent per unique block; safe to call
  /// again only if the same raws were subtracted first — rebuild clears instead.
  public func applyBlock(
    state      : State,
    tribeState : TribeLib.State,
    block      : MiningTypes.BlockRecord,
  ) {
    let day = dayKey(block.timestamp);

    addNetworkRaw(state, day, block.totalGritSpent, block.akkReward);

    for ((mid, spent) in block.minerGritSpent.values()) {
      var owner : ?Principal = null;
      label find for ((pmid, powner) in block.minerParticipants.values()) {
        if (pmid == mid) { owner := ?powner; break find };
      };
      switch (owner) {
        case null {};
        case (?p) {
          addPlayerRaw(state, day, p, spent, 0);
          switch (TribeLib.tribeIdAt(tribeState, p, block.timestamp)) {
            case null {};
            case (?tid) { addTribeRaw(state, day, tid, spent, 0) };
          };
        };
      };
    };

    switch (block.winnerOwner) {
      case null {};
      case (?winner) {
        if (block.akkReward > 0) {
          addPlayerRaw(state, day, winner, 0, block.akkReward);
          switch (TribeLib.tribeIdAt(tribeState, winner, block.timestamp)) {
            case null {};
            case (?tid) { addTribeRaw(state, day, tid, 0, block.akkReward) };
          };
        };
      };
    };
  };

  /// Wipe all score snapshots and rebuild every day from mining block history.
  /// Fully synchronous (block records are local, no awaits).
  public func rebuildAllFromBlockHistory(
    state       : State,
    tribeState  : TribeLib.State,
    miningState : MiningLib.State,
  ) {
    state.networkSnapshots.clear();
    state.playerSnapshots.clear();
    state.tribeSnapshots.clear();
    for (block in miningState.blockHistory.values()) {
      applyBlock(state, tribeState, block);
    };
  };

  // ─── Windows ────────────────────────────────────────────────────────────────

  /// Day keys for a rolling window ending today (today included, oldest first
  /// order irrelevant for summation). Unknown/alltime → [].
  func windowDays(timescale : Text) : [Text] {
    let days : Nat = switch (timescale) {
      case "daily"      1;
      case "weekly"     7;
      case "monthly"    30;
      case "quarterly"  90;
      case "yearly"     365;
      case _            0;
    };
    if (days == 0) { return [] };
    let now = Time.now();
    let results = List.empty<Text>();
    var i : Nat = 0;
    while (i < days) {
      let ts = now - (i : Nat) * 86_400_000_000_000;
      results.add(dayKey(ts));
      i += 1;
    };
    results.toArray();
  };

  // ─── Scores ─────────────────────────────────────────────────────────────────

  /// Sum of daily scores for a player over the given timescale.
  /// Missing days contribute 0. No live-balance fallback: scores reflect only
  /// real attributed mining activity.
  public func playerScore(
    state     : State,
    p         : Principal,
    timescale : Text,
  ) : Float {
    if (timescale == "alltime") {
      var total : Float = 0.0;
      for ((_, snap) in state.playerSnapshots.entries()) {
        if (Principal.equal(snap.principal, p)) {
          switch (state.networkSnapshots.get(snap.dayKey)) {
            case null {};
            case (?net) {
              total += dailyScore(snap.gritSpent, snap.akkWon, net.totalGritSpent, net.totalAkkWon);
            };
          };
        };
      };
      return total;
    };
    var total : Float = 0.0;
    for (day in windowDays(timescale).values()) {
      switch (state.networkSnapshots.get(day)) {
        case null {};
        case (?net) {
          switch (state.playerSnapshots.get(compositeKey(day, p))) {
            case null {};
            case (?snap) {
              total += dailyScore(snap.gritSpent, snap.akkWon, net.totalGritSpent, net.totalAkkWon);
            };
          };
        };
      };
    };
    total;
  };

  /// Sum of daily scores for a tribe over the given timescale. Tribe raws were
  /// attributed at block time with timestamp-prorated membership, so this is a
  /// plain read path — no membership scanning at query time.
  public func tribeScore(
    state     : State,
    tribeId   : TribeTypes.TribeId,
    timescale : Text,
  ) : Float {
    if (timescale == "alltime") {
      var total : Float = 0.0;
      for ((_, snap) in state.tribeSnapshots.entries()) {
        if (snap.tribeId == tribeId) {
          switch (state.networkSnapshots.get(snap.dayKey)) {
            case null {};
            case (?net) {
              total += dailyScore(snap.gritSpent, snap.akkWon, net.totalGritSpent, net.totalAkkWon);
            };
          };
        };
      };
      return total;
    };
    var total : Float = 0.0;
    for (day in windowDays(timescale).values()) {
      switch (state.networkSnapshots.get(day)) {
        case null {};
        case (?net) {
          switch (state.tribeSnapshots.get(compositeTribeKey(day, tribeId))) {
            case null {};
            case (?snap) {
              total += dailyScore(snap.gritSpent, snap.akkWon, net.totalGritSpent, net.totalAkkWon);
            };
          };
        };
      };
    };
    total;
  };

  // ─── Leaderboards ───────────────────────────────────────────────────────────

  /// Top 9 players (username required, score > 0) for the given timescale.
  public func getTopPlayers(
    state        : State,
    profileState : ProfileLib.State,
    tribeState   : TribeLib.State,
    timescale    : Text,
  ) : [ScoringTypes.PlayerScoreEntry] {
    let scored = List.empty<(Float, Principal)>();
    for ((ownerKey, pr) in profileState.profiles.entries()) {
      if (pr.username != "") {
        let s = playerScore(state, ownerKey, timescale);
        if (s > 0.0) { scored.add((s, ownerKey)) };
      };
    };
    let sorted = scored.sort(
      func((a, _) : (Float, Principal), (b, _) : (Float, Principal)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    ).toArray();

    let limit = if (sorted.size() < 9) sorted.size() else 9;
    var i : Nat = 0;
    let results = List.empty<ScoringTypes.PlayerScoreEntry>();
    while (i < limit) {
      let (score, p) = sorted[i];
      let (username, displayName) = switch (ProfileLib.getProfile(profileState, p, func(pp : Principal) : ?Text { tribeState.memberTribeMap.get(pp) })) {
        case null  ("", "");
        case (?pr) {
          let uname = pr.username;
          let dname = if (pr.displayName != "") pr.displayName else uname;
          (uname, dname);
        };
      };
      let tribeId : ?TribeTypes.TribeId = tribeState.memberTribeMap.get(p);
      let tribeName = switch (tribeId) {
        case null  "Solo";
        case (?tid) switch (TribeLib.getTribe(tribeState, tid)) {
          case null  "Solo";
          case (?t)  t.name;
        };
      };
      results.add({
        rank = i + 1;
        principal = p;
        username;
        displayName;
        tribeId;
        tribeName;
        score;
      });
      i += 1;
    };
    results.toArray();
  };

  /// Top 6 tribes (≥ 2 members) for the given timescale.
  public func getTopTribes(
    state      : State,
    tribeState : TribeLib.State,
    timescale  : Text,
  ) : [ScoringTypes.TribeScoreEntry] {
    let scored = List.empty<(Float, TribeTypes.Tribe)>();
    for ((_, record) in tribeState.tribes.entries()) {
      let tribe = TribeLib.toView(record);
      if (tribe.memberCount >= 2) {
        scored.add((tribeScore(state, tribe.id, timescale), tribe));
      };
    };
    let sorted = scored.sort(
      func((a, _) : (Float, TribeTypes.Tribe), (b, _) : (Float, TribeTypes.Tribe)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    ).toArray();

    let limit = if (sorted.size() < 6) sorted.size() else 6;
    var i : Nat = 0;
    let results = List.empty<ScoringTypes.TribeScoreEntry>();
    while (i < limit) {
      let (score, tribe) = sorted[i];
      results.add({
        rank = i + 1;
        tribeId = tribe.id;
        tribeName = tribe.name;
        memberCount = tribe.memberCount;
        score;
      });
      i += 1;
    };
    results.toArray();
  };

  /// Single player's score for a given timescale.
  public func getPlayerScore(
    state     : State,
    p         : Principal,
    timescale : Text,
  ) : Float {
    playerScore(state, p, timescale);
  };

  /// 1-indexed rank of a player among ALL players with a username (zero-score
  /// players included), sorted descending. Null if the player has no username.
  public func getPlayerRank(
    state        : State,
    p            : Principal,
    timescale    : Text,
    profileState : ProfileLib.State,
    _tribeState  : TribeLib.State,
  ) : ?Nat {
    switch (ProfileLib.getProfile(profileState, p, func(_ : Principal) : ?Text { null })) {
      case null { return null };
      case (?pr) { if (pr.username == "") { return null } };
    };

    let scored = List.empty<(Float, Principal)>();
    for ((ownerKey, pr) in profileState.profiles.entries()) {
      if (pr.username != "") {
        scored.add((playerScore(state, ownerKey, timescale), ownerKey));
      };
    };
    let sorted = scored.sort(
      func((a, _) : (Float, Principal), (b, _) : (Float, Principal)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    ).toArray();

    var rank : Nat = 1;
    for ((_, pp) in sorted.values()) {
      if (Principal.equal(pp, p)) { return ?rank };
      rank += 1;
    };
    null;
  };

  /// 1-indexed rank of a tribe across ALL tribes with ≥ 2 members.
  /// Null if the tribe is not found.
  public func getTribeRank(
    state      : State,
    tribeId    : TribeTypes.TribeId,
    timescale  : Text,
    tribeState : TribeLib.State,
  ) : ?Nat {
    if (TribeLib.getTribe(tribeState, tribeId) == null) { return null };

    let scored = List.empty<(Float, TribeTypes.TribeId)>();
    for ((_, record) in tribeState.tribes.entries()) {
      let tribe = TribeLib.toView(record);
      if (tribe.memberCount >= 2) {
        scored.add((tribeScore(state, tribe.id, timescale), tribe.id));
      };
    };
    let sorted = scored.sort(
      func((a, _) : (Float, TribeTypes.TribeId), (b, _) : (Float, TribeTypes.TribeId)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    ).toArray();

    var rank : Nat = 1;
    for ((_, tid) in sorted.values()) {
      if (tid == tribeId) { return ?rank };
      rank += 1;
    };
    null;
  };

  // ─── Aggregate / stockpile ──────────────────────────────────────────────────

  /// Sum of every player's all-time AK69 score (cumulative daily scores from
  /// genesis). This is the network-wide stockpile and grows as days accrue.
  public func getTotalAk69Score(state : State) : Float {
    var total : Float = 0.0;
    for ((_, snap) in state.playerSnapshots.entries()) {
      switch (state.networkSnapshots.get(snap.dayKey)) {
        case null {};
        case (?net) {
          total += dailyScore(snap.gritSpent, snap.akkWon, net.totalGritSpent, net.totalAkkWon);
        };
      };
    };
    total;
  };

  /// Retained endpoint name for frontend compatibility. Semantics updated:
  /// returns the cumulative Σ(all-time player scores) stockpile.
  public func getHistoryBasedAk69Stockpile(state : State) : Float {
    getTotalAk69Score(state);
  };

  // ─── Streak maintenance ─────────────────────────────────────────────────────

  /// Update mining streaks based on the completed UTC day's player snapshots.
  /// Called once per day at UTC rollover. Mirrors legacy semantics: a player
  /// who spent GRIT on the completed day extends their streak if they were
  /// active the day before, otherwise starts a new streak of 1.
  public func updateStreaksForCompletedDay(
    state        : State,
    profileState : ProfileLib.State,
    completedDay : Text,
  ) {
    for ((_, snap) in state.playerSnapshots.entries()) {
      if (snap.dayKey == completedDay and snap.gritSpent > 0) {
        let prevActive = switch (state.playerSnapshots.get(compositeKey(prevDay(completedDay), snap.principal))) {
          case null false;
          case (?prev) prev.gritSpent > 0;
        };
        let current = ProfileLib.getMiningStreak(profileState, snap.principal);
        let next : Nat = if (prevActive) current + 1 else 1;
        ignore ProfileLib.updateMiningStreak(profileState, snap.principal, next);
      };
    };
  };

  func prevDay(day : Text) : Text {
    dayKey(dayKeyToTs(day) - 1_000_000_000);
  };

  /// Run at (or shortly after) UTC midnight: refresh streaks for the day that
  /// just ended. Safe to call multiple times per day (idempotent outcome for
  /// the completed day because streak writes derive deterministically from
  /// snapshots and the prior streak ratchet).
  public func onUtcRollover(state : State, profileState : ProfileLib.State) {
    let completed = dayKey(Time.now() - 1_000_000_000);
    updateStreaksForCompletedDay(state, profileState, completed);
  };
};
