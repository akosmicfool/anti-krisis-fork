import Map "mo:core/Map";
import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import ScoringTypes "../types/scoring";
import TribeTypes "../types/tribe";
import ProfileLib "profile";
import GritLib "grit";
import MiningLib "mining";
import TribeLib "tribe";

module {
  public type State = {
    // Map from dayKey → DailyNetworkSnapshot
    networkSnapshots : Map.Map<Text, ScoringTypes.DailyNetworkSnapshot>;
    // Map from compositeKey "dayKey|principal" → DailyPlayerSnapshot
    playerSnapshots  : Map.Map<Text, ScoringTypes.DailyPlayerSnapshot>;
    // Map from principal → last known cumulative {grit, akk}
    playerLastTotals : Map.Map<Principal, { grit : Nat; akk : Nat }>;
    // Last network-wide cumulative totals (to compute daily delta)
    lastNetworkTotals : { var grit : Nat; var akk : Nat };
  };

  public func newState() : State {
    {
      networkSnapshots  = Map.empty();
      playerSnapshots   = Map.empty();
      playerLastTotals  = Map.empty();
      lastNetworkTotals = { var grit = 0; var akk = 0 };
    };
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /// Derive UTC dayKey ("YYYY-MM-DD") from a nanosecond timestamp.
  func dayKey(ts : Int) : Text {
    let secs = ts / 1_000_000_000;
    let days = secs / 86_400;
    // Compute year / month / day from days since Unix epoch (1970-01-01)
    // Using the algorithm from https://howardhinnant.github.io/date_algorithms.html
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
    // Format with zero-padding
    let ys = yr.toText();
    let ms = if (m < 10) "0" # m.toText() else m.toText();
    let ds = if (d < 10) "0" # d.toText() else d.toText();
    ys # "-" # ms # "-" # ds;
  };

  func compositeKey(day : Text, p : Principal) : Text {
    day # "|" # p.toText();
  };

  // ─── Daily Snapshot ─────────────────────────────────────────────────────────

  /// Take a daily snapshot. Call once per day (UTC-aligned).
  /// Reads current balances from gritState and miningState, computes deltas,
  /// and stores per-player and network snapshots. Also updates miningStreak on profiles.
  /// Take a daily snapshot. Call once per day (UTC-aligned).
  /// Reads current balances from gritState and miningState, computes deltas,
  /// and stores per-player and network snapshots. Also updates miningStreak on profiles.
  public func takeDailySnapshot(
    state        : State,
    gritState    : GritLib.State,
    miningState  : MiningLib.State,
    profileState : ?ProfileLib.State,
  ) {
    let now = Time.now();
    let day = dayKey(now);

    // 1. Compute network-level totals right now
    // Network GRIT: sum all current GRIT balances
    var networkGrit : Nat = 0;
    var networkAkk  : Nat = 0;
    for ((_, bal) in gritState.balances.entries()) {
      networkGrit += bal;
    };
    // Network AKK: sum all-time earned (never decreases on withdrawal)
    for ((_, earned) in miningState.totalAkkWonByUser.entries()) {
      networkAkk += earned;
    };

    // 2. Compute network daily delta
    let prevNetGrit = state.lastNetworkTotals.grit;
    let prevNetAkk  = state.lastNetworkTotals.akk;
    let netGritDelta : Nat = if (networkGrit >= prevNetGrit) { let d : Int = networkGrit - prevNetGrit; if (d >= 0) Int.abs(d) else 0 } else 0;
    let netAkkDelta  : Nat = if (networkAkk  >= prevNetAkk)  { let d : Int = networkAkk  - prevNetAkk;  if (d >= 0) Int.abs(d) else 0 } else 0;

    // 3. Store network snapshot for this day (always overwrite — idempotent for today)
    state.networkSnapshots.add(day, {
      dayKey          = day;
      totalGritEarned = netGritDelta;
      totalAkkWon     = netAkkDelta;
    });
    state.lastNetworkTotals.grit := networkGrit;
    state.lastNetworkTotals.akk  := networkAkk;

    // 4. Per-player snapshots: iterate all known principals
    // Collect principals from GRIT balances, AKK all-time earned, and existing snapshots
    let principals = List.empty<Principal>();
    for ((p, _) in gritState.balances.entries()) {
      principals.add(p);
    };
    // Add AKK earners not already in list
    for ((p, _) in miningState.totalAkkWonByUser.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
        principals.add(p);
      };
    };

    for (p in principals.values()) {
      let gritNow = GritLib.getBalance(gritState, p);
      // Use all-time AKK earned (never decreases on withdrawal)
      let akkNow  = MiningLib.getAkkEarned(miningState, p);

      let prev = switch (state.playerLastTotals.get(p)) {
        case null  { { grit = 0; akk = 0 } };
        case (?t)  t;
      };
      let gritDelta : Nat = if (gritNow >= prev.grit) { let d : Int = gritNow - prev.grit; if (d >= 0) Int.abs(d) else 0 } else 0;
      let akkDelta  : Nat = if (akkNow  >= prev.akk)  { let d : Int = akkNow  - prev.akk;  if (d >= 0) Int.abs(d) else 0 } else 0;

      state.playerSnapshots.add(
        compositeKey(day, p),
        { dayKey = day; principal = p; gritEarned = gritDelta; akkWon = akkDelta },
      );
      state.playerLastTotals.add(p, { grit = gritNow; akk = akkNow });

      // Update mining streak if profileState is provided
      switch (profileState) {
        case null {};
        case (?ps) {
          if (gritDelta > 0) {
            // Check if they had activity yesterday
            let yesterdayTs = now - 86_400_000_000_000;
            let yesterday = dayKey(yesterdayTs);
            let hadYesterday = switch (state.playerSnapshots.get(compositeKey(yesterday, p))) {
              case null false;
              case (?ys) ys.gritEarned > 0;
            };
            let currentStreak = ProfileLib.getMiningStreak(ps, p);
            let newStreak : Nat = if (hadYesterday) currentStreak + 1 else 1;
            ignore ProfileLib.updateMiningStreak(ps, p, newStreak);
          };
          // If gritDelta == 0, streak stays unchanged (will be reset next active day)
        };
      };
    };
  };


  // ─── Bootstrap / Init ────────────────────────────────────────────────────────

  /// Take a snapshot for today if one has not been taken yet.
  /// Call once at actor init so the leaderboard is never empty after an upgrade.
  public func takeSnapshotIfNeeded(
    state        : State,
    gritState    : GritLib.State,
    miningState  : MiningLib.State,
    profileState : ?ProfileLib.State,
  ) {
    let today = dayKey(Time.now());
    if (state.networkSnapshots.get(today) == null) {
      takeDailySnapshot(state, gritState, miningState, profileState);
    };
  };

  // ─── Score Computation ───────────────────────────────────────────────────────

  /// Return the list of dayKeys in the rolling window for the given timescale.
  func dayKeysForTimescale(timescale : Text) : [Text] {
    let now = Time.now();
    let days : Nat = switch (timescale) {
      case "weekly"    7;
      case "monthly"   30;
      case "quarterly" 90;
      case "yearly"    365;
      case _           0;   // 0 = alltime handled separately
    };
    if (days == 0) { return [] }; // alltime: caller iterates all
    let results = List.empty<Text>();
    var i : Nat = 0;
    while (i < days) {
      let ts = now - (i : Nat).toInt() * 86_400_000_000_000;
      results.add(dayKey(ts));
      i += 1;
    };
    results.toArray();
  };

  /// Compute AK69 score for a player over a given timescale.
  /// Compute AK69 score for a player over a given timescale.
  /// Falls back to live balances when no snapshots are available (bootstrap).
  public func playerScore(
    state     : State,
    p         : Principal,
    timescale : Text,
    gritState : GritLib.State,
    miningState : MiningLib.State,
  ) : Float {
    // If no snapshots exist at all, compute a live bootstrap score
    let hasSnapshots = state.playerSnapshots.size() > 0;
    if (not hasSnapshots) {
      return liveScore(state, p, gritState, miningState);
    };

    if (timescale == "alltime") {
      // For alltime we always use live totals so that:
      // (a) withdrawals never shrink the AKK component (totalAkkWonByUser only grows)
      // (b) GRIT reflects the current network balance
      // This is identical to liveScore but is kept explicit here for clarity.
      return liveScore(state, p, gritState, miningState);
    };

    // Rolling-window timescales: sum daily snapshots over the window
    let keys = dayKeysForTimescale(timescale);
    var total : Float = 0.0;
    for (day in keys.values()) {
      let snap = state.playerSnapshots.get(compositeKey(day, p));
      let net  = state.networkSnapshots.get(day);
      switch (snap, net) {
        case (?s, ?n) {
          total += dailyScore(s.gritEarned, s.akkWon, n.totalGritEarned, n.totalAkkWon);
        };
        case _ {};
      };
    };
    // If no snapshot data for this player over the rolling window, fall back to live
    if (total == 0.0) {
      return liveScore(state, p, gritState, miningState);
    };
    total;
  };

  /// Compute AK69 daily score for a single player.
  /// Returns 0 if network totals are 0 to avoid division by zero.
  func dailyScore(
    playerGrit : Nat,
    playerAkk  : Nat,
    netGrit    : Nat,
    netAkk     : Nat,
  ) : Float {
    let normGrit : Float = if (netGrit == 0) 0.0
      else playerGrit.toFloat() / netGrit.toFloat();
    let normAkk : Float = if (netAkk == 0) 0.0
      else playerAkk.toFloat() / netAkk.toFloat();
    (0.5 * normGrit + 0.5 * normAkk) * 100.0;
  };


  /// Bootstrap live score: compute a synthetic daily score from current balances
  /// against total network balances. Used when no daily snapshots exist yet.
  /// Bootstrap live score: compute a synthetic daily score from current balances
  /// against total network balances. Used when no daily snapshots exist yet.
  func liveScore(
    _state      : State,
    p           : Principal,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
  ) : Float {
    let playerGrit = GritLib.getBalance(gritState, p);
    // Use all-time AKK earned so score never drops after a withdrawal
    let playerAkk  = MiningLib.getAkkEarned(miningState, p);
    if (playerGrit == 0 and playerAkk == 0) return 0.0;
    var netGrit : Nat = 0;
    // Network GRIT: sum all current GRIT balances
    for ((_, bal) in gritState.balances.entries()) { netGrit += bal };
    // Network AKK: normalise against all-time earned totals so that withdrawals
    // by any player do not distort the ratio for everyone else.
    var netAkk : Nat = 0;
    for ((_, earned) in miningState.totalAkkWonByUser.entries()) { netAkk += earned };
    dailyScore(playerGrit, playerAkk, netGrit, netAkk);
  };

  // ─── Leaderboards ────────────────────────────────────────────────────────────

  /// Return top 9 players sorted by AK69 score descending for the given timescale.
  /// Return top 9 players sorted by AK69 score descending for the given timescale.
  public func getTopPlayers(
    state        : State,
    gritState    : GritLib.State,
    miningState  : MiningLib.State,
    profileState : ProfileLib.State,
    tribeState   : TribeLib.State,
    timescale    : Text,
  ) : [ScoringTypes.PlayerScoreEntry] {
    // Collect all principals that have any snapshot data
    let principals = List.empty<Principal>();
    for ((_, snap) in state.playerSnapshots.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(snap.principal, q) }) == null) {
        principals.add(snap.principal);
      };
    };
    // Also pick up players with GRIT balances but no snapshots yet (bootstrap)
    for ((p, _) in gritState.balances.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
        principals.add(p);
      };
    };
    // Also pick up players with AKK balances but no snapshots yet (bootstrap)
    for ((p, _) in miningState.akkBalances.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
        principals.add(p);
      };
    };
    // Also pick up players with historical AKK earnings (may have withdrawn current balance)
    for ((p, _) in miningState.totalAkkWonByUser.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
        principals.add(p);
      };
    };

    // Score each principal — only include players who have a non-empty username
    let scored = List.empty<(Float, Principal)>();
    for (p in principals.values()) {
      // Only include if the player has a profile with a non-empty username
      switch (ProfileLib.getProfile(profileState, p, func(pp : Principal) : ?Text { tribeState.memberTribeMap.get(pp) })) {
        case null {}; // no profile = no username = skip
        case (?pr) {
          if (pr.username != "") {
            let s = playerScore(state, p, timescale, gritState, miningState);
            if (s > 0.0) scored.add((s, p));
          };
        };
      };
    };

    // Sort descending by score
    let sortedList = scored.sort(
      func((a, _) : (Float, Principal), (b, _) : (Float, Principal)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    );
    let sorted = sortedList.toArray();

    let limit = if (sorted.size() < 9) sorted.size() else 9;
    var i : Nat = 0;
    let results = List.empty<ScoringTypes.PlayerScoreEntry>();
    while (i < limit) {
      let (score, p) = sorted[i];
      // Profile is guaranteed non-null here (filtered above)
      let (username, displayName) = switch (ProfileLib.getProfile(profileState, p, func(pp : Principal) : ?Text { tribeState.memberTribeMap.get(pp) })) {
        case null  ("", "");  // should not happen given the filter above
        case (?pr) {
          let uname = pr.username;
          // displayName: prefer displayName if non-empty, else fall back to username
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
        rank        = i + 1;
        principal   = p;
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

  /// Compute tribe score for a given tribe over a timescale.
  /// Uses cumulativeGrit and cumulativeAkk from tribe record as proxy for
  /// total contribution (these are maintained by TribeLib.flushDelta).
  /// Compute tribe score for a given tribe over a timescale.
  /// Iterates daily snapshots and attributes each day's score to members who
  /// were in the tribe on that day (using historical membership events).
  /// Falls back to live cumulative balances when no snapshots exist.
  public func tribeScore(
    state      : State,
    tribeState : TribeLib.State,
    gritState  : GritLib.State,
    miningState : MiningLib.State,
    tribe      : TribeTypes.Tribe,
    timescale  : Text,
  ) : Float {
    // Bootstrap fallback: if no snapshots exist, compute live from member totals
    if (state.networkSnapshots.size() == 0) {
      // Sum all-time earned GRIT and AKK for current tribe members
      var tribeGrit : Nat = 0;
      var tribeAkk  : Nat = 0;
      switch (tribeState.tribeMembers.get(tribe.id)) {
        case null {};
        case (?members) {
          for (member in members.values()) {
            tribeGrit += GritLib.getTotalEarned(gritState, member);
            tribeAkk  += MiningLib.getAkkEarned(miningState, member);
          };
        };
      };
      // Network totals: use all-time earned maps for accurate normalisation
      var netGrit : Nat = 0;
      var netAkk  : Nat = 0;
      for ((_, earned) in gritState.totalEarned.entries()) { netGrit += earned };
      for ((_, earned) in miningState.totalAkkWonByUser.entries()) { netAkk += earned };
      return dailyScore(tribeGrit, tribeAkk, netGrit, netAkk);
    };

    let keys : [Text] = if (timescale == "alltime") {
      // Collect every dayKey that exists in networkSnapshots
      let allDays = List.empty<Text>();
      for ((dk, _) in state.networkSnapshots.entries()) {
        allDays.add(dk);
      };
      allDays.toArray();
    } else {
      dayKeysForTimescale(timescale);
    };

    var total : Float = 0.0;
    for (day in keys.values()) {
      let net = state.networkSnapshots.get(day);
      switch (net) {
        case null {};
        case (?n) {
          // Sum contributions of all members who were in this tribe on this day,
          // using historical membership events (not the current memberTribeMap).
          for (event in tribeState.membershipHistory.values()) {
            if (event.tribeId == tribe.id) {
              // Member was active during 'day' if joinDay <= day AND (leaveDay == null OR leaveDay > day)
              let joined = event.joinDay <= day;
              let notYetLeft = switch (event.leaveDay) {
                case null    true;
                case (?ld)   ld > day;
              };
              if (joined and notYetLeft) {
                let snapKey = day # "|" # event.member.toText();
                switch (state.playerSnapshots.get(snapKey)) {
                  case null {
                    // No snapshot for this member on this day — check if they have live balances
                    // and this is "today" (most recent network snapshot day)
                    // Skip: we only credit days where the snapshot exists
                  };
                  case (?snap) {
                    total += dailyScore(snap.gritEarned, snap.akkWon, n.totalGritEarned, n.totalAkkWon);
                  };
                };
              };
            };
          };
          // Also check current members (memberTribeMap) for today's snapshot
          // in case they joined before the membership history was introduced
          for ((member, tid) in tribeState.memberTribeMap.entries()) {
            if (tid == tribe.id) {
              // Only add if not already counted via membershipHistory
              let alreadyCounted = switch (tribeState.membershipHistory.find(
                func(ev : TribeTypes.MembershipEvent) : Bool {
                  Principal.equal(ev.member, member) and ev.tribeId == tribe.id
                }
              )) { case null false; case _ true };
              if (not alreadyCounted) {
                let snapKey = day # "|" # member.toText();
                switch (state.playerSnapshots.get(snapKey)) {
                  case null {};
                  case (?snap) {
                    total += dailyScore(snap.gritEarned, snap.akkWon, n.totalGritEarned, n.totalAkkWon);
                  };
                };
              };
            };
          };
        };
      };
    };

    // If still 0 after checking snapshots, fall back to live member totals
    if (total == 0.0) {
      var tribeGrit : Nat = 0;
      var tribeAkk  : Nat = 0;
      switch (tribeState.tribeMembers.get(tribe.id)) {
        case null {};
        case (?members) {
          for (member in members.values()) {
            tribeGrit += GritLib.getTotalEarned(gritState, member);
            tribeAkk  += MiningLib.getAkkEarned(miningState, member);
          };
        };
      };
      var netGrit : Nat = 0;
      var netAkk  : Nat = 0;
      for ((_, earned) in gritState.totalEarned.entries()) { netGrit += earned };
      for ((_, earned) in miningState.totalAkkWonByUser.entries()) { netAkk += earned };
      return dailyScore(tribeGrit, tribeAkk, netGrit, netAkk);
    };
    total;
  };

  /// Return top 6 tribes (min 2 members) sorted by AK69 score descending.
  /// Return top 6 tribes (min 2 members) sorted by AK69 score descending.
  public func getTopTribes(
    state       : State,
    tribeState  : TribeLib.State,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
    timescale   : Text,
  ) : [ScoringTypes.TribeScoreEntry] {
    let scored = List.empty<(Float, TribeTypes.Tribe)>();
    for ((_, record) in tribeState.tribes.entries()) {
      let tribe = TribeLib.toView(record);
      if (tribe.memberCount >= 2) {
        let s = tribeScore(state, tribeState, gritState, miningState, tribe, timescale);
        scored.add((s, tribe));
      };
    };

    let sortedList = scored.sort(
      func((a, _) : (Float, TribeTypes.Tribe), (b, _) : (Float, TribeTypes.Tribe)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    );
    let sorted = sortedList.toArray();

    let limit = if (sorted.size() < 6) sorted.size() else 6;
    var i : Nat = 0;
    let results = List.empty<ScoringTypes.TribeScoreEntry>();
    while (i < limit) {
      let (score, tribe) = sorted[i];
      results.add({
        rank        = i + 1;
        tribeId     = tribe.id;
        tribeName   = tribe.name;
        memberCount = tribe.memberCount;
        score;
      });
      i += 1;
    };
    results.toArray();
  };

  /// Return a single player's score for a given timescale.
  /// Return a single player's score for a given timescale.
  public func getPlayerScore(
    state       : State,
    p           : Principal,
    timescale   : Text,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
  ) : Float {
    playerScore(state, p, timescale, gritState, miningState);
  };

  /// Return the 1-indexed rank of a player across ALL players with a username,
  /// sorted by AK69 score descending for the given timescale.
  /// Returns null if the player has no profile/username.
  public func getPlayerRank(
    state        : State,
    p            : Principal,
    timescale    : Text,
    gritState    : GritLib.State,
    miningState  : MiningLib.State,
    profileState : ProfileLib.State,
    tribeState   : TribeLib.State,
  ) : ?Nat {
    // Collect all principals with a username
    let principals = List.empty<Principal>();
    for ((_, snap) in state.playerSnapshots.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(snap.principal, q) }) == null) {
        principals.add(snap.principal);
      };
    };
    for ((pp, _) in gritState.balances.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(pp, q) }) == null) {
        principals.add(pp);
      };
    };
    for ((pp, _) in miningState.akkBalances.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(pp, q) }) == null) {
        principals.add(pp);
      };
    };
    // Also include players who have all-time AKK earnings but may have
    // withdrawn their spendable balance (akkBalances may be 0 for them)
    for ((pp, _) in miningState.totalAkkWonByUser.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(pp, q) }) == null) {
        principals.add(pp);
      };
    };

    // Ensure the requested principal is included even if they have no balance yet
    if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
      principals.add(p);
    };

    // Score only principals with a non-empty username
    let scored = List.empty<(Float, Principal)>();
    for (pp in principals.values()) {
      switch (ProfileLib.getProfile(profileState, pp, func(ppp : Principal) : ?Text { tribeState.memberTribeMap.get(ppp) })) {
        case null {};
        case (?pr) {
          if (pr.username != "") {
            let s = playerScore(state, pp, timescale, gritState, miningState);
            scored.add((s, pp));
          };
        };
      };
    };

    // Target must have a username to have a rank
    switch (ProfileLib.getProfile(profileState, p, func(pp : Principal) : ?Text { tribeState.memberTribeMap.get(pp) })) {
      case null { return null };
      case (?pr) { if (pr.username == "") return null };
    };

    // Sort descending by score
    let sortedList = scored.sort(
      func((a, _) : (Float, Principal), (b, _) : (Float, Principal)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    );
    let sorted = sortedList.toArray();

    // Find 1-indexed position
    var rank : Nat = 1;
    for ((_, pp) in sorted.values()) {
      if (Principal.equal(pp, p)) return ?rank;
      rank += 1;
    };
    // If not found (score = 0, not included in scored list), append to end
    ?rank;
  };

  /// Return the 1-indexed rank of a tribe across ALL tribes with >= 2 members,
  /// sorted by AK69 score descending for the given timescale.
  /// Returns null if tribe is not found.
  public func getTribeRank(
    state       : State,
    tribeId     : TribeTypes.TribeId,
    timescale   : Text,
    tribeState  : TribeLib.State,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
  ) : ?Nat {
    // Verify the tribe exists and has >= 2 members
    let targetTribe = switch (TribeLib.getTribe(tribeState, tribeId)) {
      case null { return null };
      case (?t)  t;
    };

    // Score all tribes with >= 2 members
    let scored = List.empty<(Float, TribeTypes.TribeId)>();
    for ((_, record) in tribeState.tribes.entries()) {
      let tribe = TribeLib.toView(record);
      if (tribe.memberCount >= 2) {
        let s = tribeScore(state, tribeState, gritState, miningState, tribe, timescale);
        scored.add((s, tribe.id));
      };
    };

    // If target tribe has < 2 members, include it anyway (rank is still meaningful)
    if (targetTribe.memberCount < 2) {
      let s = tribeScore(state, tribeState, gritState, miningState, targetTribe, timescale);
      if (scored.find(func((_, tid) : (Float, TribeTypes.TribeId)) : Bool { tid == tribeId }) == null) {
        scored.add((s, tribeId));
      };
    };

    // Sort descending
    let sortedList = scored.sort(
      func((a, _) : (Float, TribeTypes.TribeId), (b, _) : (Float, TribeTypes.TribeId)) : { #less; #equal; #greater } {
        if (b > a) #less
        else if (b < a) #greater
        else #equal;
      }
    );
    let sorted = sortedList.toArray();

    var rank : Nat = 1;
    for ((_, tid) in sorted.values()) {
      if (tid == tribeId) return ?rank;
      rank += 1;
    };
    ?rank;
  };
  /// Return the all-time cumulative AK69 score using only historical snapshot data.
  /// For each playerSnapshot entry, accumulates gritEarned and akkWon per principal,
  /// then computes each player's AK69 contribution as:
  ///   score = (playerCumulGrit/networkCumulGrit * 0.5 + playerCumulAkk/networkCumulAkk * 0.5) * 100
  /// Sums across all players and all days.
  /// Falls back to liveScore if no snapshots exist (bootstrap).
  /// Return the all-time cumulative AK69 score computed from real block history.
  /// Sums all block rewards won per player from the block history, then computes
  /// each player's contribution using their actual block-history AKK vs total
  /// block-history AKK (to avoid inflation from phantom internal-map entries).
  /// Falls back to liveScore-based total if no block history exists.
  public func getHistoryBasedAk69Stockpile(
    state       : State,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
  ) : Float {
    // Build per-player AKK totals from real block history
    let playerAkkFromHistory = Map.empty<Principal, Nat>();
    var networkAkkFromHistory : Nat = 0;
    for (block in miningState.blockHistory.values()) {
      switch (block.winnerOwner) {
        case null {};
        case (?owner) {
          let prev = switch (playerAkkFromHistory.get(owner)) { case null 0; case (?n) n };
          playerAkkFromHistory.add(owner, prev + block.akkReward);
          networkAkkFromHistory += block.akkReward;
        };
      };
    };

    // Build per-player GRIT totals from player snapshots (cumulative earned)
    let playerGritTotals = Map.empty<Principal, Nat>();
    var networkGritTotal : Nat = 0;
    for ((_, snap) in state.playerSnapshots.entries()) {
      let p = snap.principal;
      let prev = switch (playerGritTotals.get(p)) { case null 0; case (?n) n };
      playerGritTotals.add(p, prev + snap.gritEarned);
    };
    for ((_, g) in playerGritTotals.entries()) { networkGritTotal += g };

    // If no block history, fall back to snapshot-based approach
    if (networkAkkFromHistory == 0) {
      // Accumulate per-player totals from all playerSnapshots
      let playerGritTotals2 = Map.empty<Principal, Nat>();
      let playerAkkTotals2  = Map.empty<Principal, Nat>();
      for ((_, snap) in state.playerSnapshots.entries()) {
        let p = snap.principal;
        let prevGrit = switch (playerGritTotals2.get(p)) { case null 0; case (?n) n };
        let prevAkk  = switch (playerAkkTotals2.get(p))  { case null 0; case (?n) n };
        playerGritTotals2.add(p, prevGrit + snap.gritEarned);
        playerAkkTotals2.add(p,  prevAkk  + snap.akkWon);
      };
      if (playerGritTotals2.size() == 0) {
        return getTotalAk69Score(state, gritState, miningState);
      };
      var networkGrit2 : Nat = 0;
      var networkAkk2  : Nat = 0;
      for ((_, g) in playerGritTotals2.entries()) { networkGrit2 += g };
      for ((_, a) in playerAkkTotals2.entries())  { networkAkk2  += a };
      var total2 : Float = 0.0;
      for ((p, pg) in playerGritTotals2.entries()) {
        let pa = switch (playerAkkTotals2.get(p)) { case null 0; case (?n) n };
        let normGrit : Float = if (networkGrit2 == 0) 0.0 else pg.toFloat() / networkGrit2.toFloat();
        let normAkk  : Float = if (networkAkk2  == 0) 0.0 else pa.toFloat() / networkAkk2.toFloat();
        total2 += (0.5 * normGrit + 0.5 * normAkk) * 100.0;
      };
      return total2;
    };

    // Compute stockpile using block-history AKK (authoritative) + snapshot GRIT
    var total : Float = 0.0;
    for ((p, playerAkk) in playerAkkFromHistory.entries()) {
      let playerGrit = switch (playerGritTotals.get(p)) { case null 0; case (?n) n };
      let normGrit : Float = if (networkGritTotal == 0) 0.0 else playerGrit.toFloat() / networkGritTotal.toFloat();
      let normAkk  : Float = if (networkAkkFromHistory == 0) 0.0 else playerAkk.toFloat() / networkAkkFromHistory.toFloat();
      total += (0.5 * normGrit + 0.5 * normAkk) * 100.0;
    };
    total;
  };

  /// Return the all-time cumulative AK69 score accrued by all players combined.
  /// Iterates all known principals (from snapshots, GRIT balances, and AKK earnings)
  /// and sums each player's live score.
  public func getTotalAk69Score(
    state       : State,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
  ) : Float {
    let principals = List.empty<Principal>();
    for ((_, snap) in state.playerSnapshots.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(snap.principal, q) }) == null) {
        principals.add(snap.principal);
      };
    };
    for ((p, _) in gritState.balances.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
        principals.add(p);
      };
    };
    for ((p, _) in miningState.totalAkkWonByUser.entries()) {
      if (principals.find(func(q : Principal) : Bool { Principal.equal(p, q) }) == null) {
        principals.add(p);
      };
    };
    var total : Float = 0.0;
    for (p in principals.values()) {
      total += liveScore(state, p, gritState, miningState);
    };
    total;
  };
};
