import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import TribeTypes "../types/tribe";
import ProfileLib "profile";
import GritLib "../lib/grit";
import MiningLib "../lib/mining";

module {
  public type State = {
    tribes                : Map.Map<TribeTypes.TribeId, TribeTypes.TribeRecord>;
    memberTribeMap        : Map.Map<Principal, TribeTypes.TribeId>;
    tribeMembers          : Map.Map<TribeTypes.TribeId, List.List<Principal>>;
    userOwnedTribes       : Map.Map<Principal, List.List<TribeTypes.TribeId>>;
    contributionSnapshots : Map.Map<Principal, TribeTypes.ContributionSnapshot>;
    membershipHistory     : List.List<TribeTypes.MembershipEvent>;
  };

  public func newState() : State {
    {
      tribes                = Map.empty();
      memberTribeMap        = Map.empty();
      tribeMembers          = Map.empty();
      userOwnedTribes       = Map.empty();
      contributionSnapshots = Map.empty();
      membershipHistory     = List.empty();
    };
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /// Convert a tribe display name to a URL-safe slug (TribeId).
  public func slugify(name : Text) : TribeTypes.TribeId {
    let lower = name.toLower();
    // Replace spaces and non-alphanumeric chars with hyphens
    let slug = lower.map(func(c : Char) : Char {
      if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) c
      else '-'
    });
    slug;
  };

  /// Project a mutable TribeRecord into an immutable Tribe view.
  public func toView(r : TribeTypes.TribeRecord) : TribeTypes.Tribe {
    {
      id             = r.id;
      name           = r.name;
      description    = r.description;
      photoUrl       = r.photoUrl;
      coverImageUrl  = r.coverImageUrl;
      ownerId        = r.ownerId;
      createdAt      = r.createdAt;
      memberCount    = r.memberCount;
      cumulativeGrit = r.cumulativeGrit;
      cumulativeAkk  = r.cumulativeAkk;
    };
  };

  /// Return how many tribes a user currently owns (by looking up userOwnedTribes).
  func ownedTribesCount(state : State, user : Principal) : Nat {
    switch (state.userOwnedTribes.get(user)) {
      case null 0;
      case (?list) list.size();
    };
  };

  /// Case-insensitive tribe name uniqueness check.
  func isTribeNameTaken(state : State, name : Text, excludeId : ?TribeTypes.TribeId) : Bool {
    let lower = name.toLower();
    for ((id, tribe) in state.tribes.entries()) {
      let skip = switch (excludeId) {
        case null false;
        case (?eid) eid == id;
      };
      if (not skip and tribe.name.toLower() == lower) return true;
    };
    false;
  };

  /// Derive UTC dayKey ("YYYY-MM-DD") from a nanosecond timestamp.
  /// Mirrors the same algorithm used in scoring.mo.
  func todayKey() : Text {
    let ts = Time.now();
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

  /// Close out the open MembershipEvent (leaveDay=null) for a given member+tribeId.
  func closeMembershipEvent(
    state   : State,
    member  : Principal,
    tribeId : TribeTypes.TribeId,
    today   : Text,
  ) {
    for (event in state.membershipHistory.values()) {
      if (Principal.equal(event.member, member) and event.tribeId == tribeId and event.leaveDay == null) {
        event.leaveDay := ?today;
      };
    };
  };

  // ─── Public API ─────────────────────────────────────────────────────────────

  /// Create a new tribe. Caller is owner but NOT automatically a member.
  public func createTribe(
    state         : State,
    profileState  : ProfileLib.State,
    caller        : Principal,
    name          : Text,
    description   : Text,
    photoUrl      : ?Text,
    coverImageUrl : ?Text,
  ) : { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    if (not ProfileLib.hasUsername(profileState, caller))    return #err(#noUsername);
    if (name.size() == 0 or name.size() > 30)               return #err(#nameTooLong);
    if (description.size() > 500)                            return #err(#descriptionTooLong);
    if (isTribeNameTaken(state, name, null))                 return #err(#nameTaken);
    if (ownedTribesCount(state, caller) >= 3)                return #err(#maxTribesReached);

    let tribeId = slugify(name);
    // If slug is already taken, append a suffix using current timestamp
    let finalId = if (state.tribes.containsKey(tribeId)) {
      tribeId # "-" # debug_show(Time.now());
    } else {
      tribeId;
    };

    let record : TribeTypes.TribeRecord = {
      id                  = finalId;
      var name            = name;
      var description     = description;
      var photoUrl        = photoUrl;
      var coverImageUrl   = coverImageUrl;
      ownerId             = caller;
      createdAt           = Time.now();
      var memberCount     = 0;
      var cumulativeGrit  = 0;
      var cumulativeAkk   = 0;
    };
    state.tribes.add(finalId, record);

    // Track ownership
    let owned = switch (state.userOwnedTribes.get(caller)) {
      case null {
        let l = List.empty<TribeTypes.TribeId>();
        state.userOwnedTribes.add(caller, l);
        l;
      };
      case (?l) l;
    };
    owned.add(finalId);

    #ok(toView(record));
  };

  /// Join a tribe. Caller must not already be in one.
  public func joinTribe(
    state       : State,
    profileState : ProfileLib.State,
    caller      : Principal,
    tribeId     : TribeTypes.TribeId,
    gritBalance : Nat,
    akkBalance  : Nat,
  ) : { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    if (not ProfileLib.hasUsername(profileState, caller)) return #err(#noUsername);
    if (state.memberTribeMap.containsKey(caller))         return #err(#alreadyMember);
    let record = switch (state.tribes.get(tribeId)) {
      case null  return #err(#notFound);
      case (?r)  r;
    };

    let today = todayKey();

    // Record membership
    state.memberTribeMap.add(caller, tribeId);

    // Append a new open MembershipEvent
    state.membershipHistory.add({
      member   = caller;
      tribeId  = tribeId;
      joinDay  = today;
      var leaveDay : ?Text = null;
    });

    let members = switch (state.tribeMembers.get(tribeId)) {
      case null {
        let l = List.empty<Principal>();
        state.tribeMembers.add(tribeId, l);
        l;
      };
      case (?l) l;
    };
    members.add(caller);
    record.memberCount += 1;

    // Snapshot current stats so we can compute deltas later
    state.contributionSnapshots.add(caller, { grit = gritBalance; akk = akkBalance });

    #ok(toView(record));
  };

  /// Leave the caller's current tribe. Flushes any accrued delta first.
  public func leaveTribe(
    state       : State,
    caller      : Principal,
    gritBalance : Nat,
    akkBalance  : Nat,
  ) : { #ok; #err : TribeTypes.TribeError } {
    let tribeId = switch (state.memberTribeMap.get(caller)) {
      case null  return #err(#notMember);
      case (?id) id;
    };

    let today = todayKey();

    // Flush delta before removing
    flushDelta(state, caller, tribeId, gritBalance, akkBalance);

    // Close the open MembershipEvent for this member
    closeMembershipEvent(state, caller, tribeId, today);

    // Remove membership
    state.memberTribeMap.remove(caller);
    state.contributionSnapshots.remove(caller);

    switch (state.tribeMembers.get(tribeId)) {
      case null {};
      case (?members) {
        members.mapInPlace(func(p : Principal) : Principal { p });
        let filtered = members.filter(func(p : Principal) : Bool { not Principal.equal(p, caller) });
        members.clear();
        members.append(filtered);
      };
    };

    switch (state.tribes.get(tribeId)) {
      case null {};
      case (?record) {
        if (record.memberCount > 0) record.memberCount -= 1;
      };
    };

    #ok;
  };

  /// Flush GRIT+AKK delta from a member to their tribe's cumulative totals.
  /// Updates the snapshot in place. Safe to call at any time.
  public func flushDelta(
    state       : State,
    userId      : Principal,
    tribeId     : TribeTypes.TribeId,
    gritNow     : Nat,
    akkNow      : Nat,
  ) {
    let snap = switch (state.contributionSnapshots.get(userId)) {
      case null return;  // not in a tribe
      case (?s) s;
    };
    let tribe = switch (state.tribes.get(tribeId)) {
      case null return;
      case (?t) t;
    };
    let gritDelta = if (gritNow >= snap.grit) Nat.sub(gritNow, snap.grit) else 0;
    let akkDelta  = if (akkNow  >= snap.akk)  Nat.sub(akkNow,  snap.akk)  else 0;
    tribe.cumulativeGrit += gritDelta;
    tribe.cumulativeAkk  += akkDelta;
    state.contributionSnapshots.add(userId, { grit = gritNow; akk = akkNow });
  };

  /// Called after any GRIT or AKK award. If user is in a tribe, flushes their delta.
  public func updateTribeStats(
    state       : State,
    userId      : Principal,
    gritBalance : Nat,
    akkBalance  : Nat,
  ) {
    let tribeId = switch (state.memberTribeMap.get(userId)) {
      case null return;  // not in any tribe
      case (?id) id;
    };
    flushDelta(state, userId, tribeId, gritBalance, akkBalance);
  };

  /// Edit tribe metadata (name/description/photo/cover). TribeId is immutable.
  public func editTribe(
    state         : State,
    caller        : Principal,
    tribeId       : TribeTypes.TribeId,
    name          : ?Text,
    description   : ?Text,
    photoUrl      : ?Text,
    coverImageUrl : ?Text,
  ) : { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    let record = switch (state.tribes.get(tribeId)) {
      case null  return #err(#notFound);
      case (?r)  r;
    };
    if (record.ownerId != caller) return #err(#notOwner);

    // Track whether the name (and therefore slug) is changing
    var newSlug : ?TribeTypes.TribeId = null;

    switch (name) {
      case null {};
      case (?n) {
        if (n.size() == 0 or n.size() > 30) return #err(#nameTooLong);
        if (isTribeNameTaken(state, n, ?tribeId)) return #err(#nameTaken);
        record.name := n;
        let candidate = slugify(n);
        // Only reslug if the candidate differs from the current tribeId
        if (candidate != tribeId) {
          let finalCandidate = if (
            state.tribes.containsKey(candidate) and candidate != tribeId
          ) {
            candidate # "-" # debug_show(Time.now());
          } else {
            candidate;
          };
          newSlug := ?finalCandidate;
        };
      };
    };
    switch (description) {
      case null {};
      case (?d) {
        if (d.size() > 500) return #err(#descriptionTooLong);
        record.description := d;
      };
    };
    switch (photoUrl) {
      case null {};
      case (?url) { record.photoUrl := ?url };
    };
    switch (coverImageUrl) {
      case null {};
      case (?url) { record.coverImageUrl := ?url };
    };

    // If slug changed, migrate the tribe record to the new key and update all references
    switch (newSlug) {
      case null {
        // No slug change — return as-is
        #ok(toView(record));
      };
      case (?finalId) {
        // Build a new record with the updated id
        let migrated : TribeTypes.TribeRecord = {
          id                  = finalId;
          var name            = record.name;
          var description     = record.description;
          var photoUrl        = record.photoUrl;
          var coverImageUrl   = record.coverImageUrl;
          ownerId             = record.ownerId;
          createdAt           = record.createdAt;
          var memberCount     = record.memberCount;
          var cumulativeGrit  = record.cumulativeGrit;
          var cumulativeAkk   = record.cumulativeAkk;
        };
        // Remove old key, insert under new key
        state.tribes.remove(tribeId);
        state.tribes.add(finalId, migrated);

        // Update ownership list: replace old tribeId with finalId
        switch (state.userOwnedTribes.get(caller)) {
          case null {};
          case (?owned) {
            owned.mapInPlace(func(id : TribeTypes.TribeId) : TribeTypes.TribeId {
              if (id == tribeId) finalId else id
            });
          };
        };

        // Update tribeMembers map: move member list to new key
        switch (state.tribeMembers.get(tribeId)) {
          case null {};
          case (?members) {
            state.tribeMembers.remove(tribeId);
            state.tribeMembers.add(finalId, members);
          };
        };

        // Update memberTribeMap for all members that referenced old tribeId
        for ((member, mid) in state.memberTribeMap.entries()) {
          if (mid == tribeId) {
            state.memberTribeMap.add(member, finalId);
          };
        };

        #ok(toView(migrated));
      };
    };
  };

  /// Transfer tribe ownership to a user identified by username.
  public func transferOwnership(
    state        : State,
    profileState : ProfileLib.State,
    caller       : Principal,
    tribeId      : TribeTypes.TribeId,
    newOwnerUsername : Text,
  ) : { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    let record = switch (state.tribes.get(tribeId)) {
      case null  return #err(#notFound);
      case (?r)  r;
    };
    if (record.ownerId != caller) return #err(#notOwner);

    let newOwnerProfile = switch (ProfileLib.getProfileByUsername(profileState, newOwnerUsername, func(p : Principal) : ?Text { state.memberTribeMap.get(p) })) {
      case null  return #err(#newOwnerNotFound);
      case (?p)  p;
    };
    if (newOwnerProfile.username == "") return #err(#newOwnerNoUsername);

    // Find the new owner's principal via a profiles scan
    var newOwnerPrincipalOpt : ?Principal = null;
    for ((p, profile) in profileState.profiles.entries()) {
      if (profile.username == newOwnerUsername) {
        newOwnerPrincipalOpt := ?p;
      };
    };
    let newOwnerPrincipal = switch (newOwnerPrincipalOpt) {
      case null  return #err(#newOwnerNotFound);
      case (?p)  p;
    };

    if (ownedTribesCount(state, newOwnerPrincipal) >= 5) return #err(#newOwnerMaxTribes);

    // Remove from old owner
    switch (state.userOwnedTribes.get(caller)) {
      case null {};
      case (?owned) {
        let filtered = owned.filter(func(id : TribeTypes.TribeId) : Bool { id != tribeId });
        owned.clear();
        owned.append(filtered);
      };
    };

    // Add to new owner
    let newOwned = switch (state.userOwnedTribes.get(newOwnerPrincipal)) {
      case null {
        let l = List.empty<TribeTypes.TribeId>();
        state.userOwnedTribes.add(newOwnerPrincipal, l);
        l;
      };
      case (?l) l;
    };
    newOwned.add(tribeId);

    // Update owner field — rebuild record because ownerId is immutable
    // We store a new record with the updated ownerId
    let updated : TribeTypes.TribeRecord = {
      id                  = record.id;
      var name            = record.name;
      var description     = record.description;
      var photoUrl        = record.photoUrl;
      var coverImageUrl   = record.coverImageUrl;
      ownerId             = newOwnerPrincipal;
      createdAt           = record.createdAt;
      var memberCount     = record.memberCount;
      var cumulativeGrit  = record.cumulativeGrit;
      var cumulativeAkk   = record.cumulativeAkk;
    };
    state.tribes.add(tribeId, updated);

    #ok(toView(updated));
  };

  // ─── Queries ─────────────────────────────────────────────────────────────────

  public func getTribe(state : State, tribeId : TribeTypes.TribeId) : ?TribeTypes.Tribe {
    switch (state.tribes.get(tribeId)) {
      case null null;
      case (?r) ?toView(r);
    };
  };

  public func getTribeByName(state : State, name : Text) : ?TribeTypes.Tribe {
    let lower = name.toLower();
    for ((_, r) in state.tribes.entries()) {
      if (r.name.toLower() == lower) return ?toView(r);
    };
    null;
  };

  /// Prefix-match search on tribe names, returns up to 10 results.
  public func searchTribes(state : State, searchTerm : Text) : [TribeTypes.Tribe] {
    let lower = searchTerm.toLower();
    let results = List.empty<TribeTypes.Tribe>();
    for ((_, r) in state.tribes.entries()) {
      if (results.size() < 10 and r.name.toLower().startsWith(#text (lower))) {
        results.add(toView(r));
      };
    };
    results.toArray();
  };

  /// Return the tribe the caller is currently a member of.
  public func getMyTribe(state : State, caller : Principal) : ?TribeTypes.Tribe {
    switch (state.memberTribeMap.get(caller)) {
      case null null;
      case (?id) getTribe(state, id);
    };
  };

  /// Return all tribes owned/created by the caller.
  public func getMyOwnedTribes(state : State, caller : Principal) : [TribeTypes.Tribe] {
    switch (state.userOwnedTribes.get(caller)) {
      case null [];
      case (?ids) {
        let results = List.empty<TribeTypes.Tribe>();
        for (id in ids.values()) {
          switch (getTribe(state, id)) {
            case null {};
            case (?t) results.add(t);
          };
        };
        results.toArray();
      };
    };
  };

  /// Return usernames of all current members of a tribe.
  public func getTribeMembers(
    state        : State,
    profileState : ProfileLib.State,
    tribeId      : TribeTypes.TribeId,
  ) : [Text] {
    switch (state.tribeMembers.get(tribeId)) {
      case null [];
      case (?members) {
        members.filterMap(func(p : Principal) : ?Text {
          switch (ProfileLib.getProfile(profileState, p, func(pp : Principal) : ?Text { state.memberTribeMap.get(pp) })) {
            case null null;
            case (?profile) ?
              (if (profile.username != "") profile.username
               else profile.displayName);
          };
        }).toArray();
      };
    };
  };

  /// Return members with role annotations (isLeader = true for the tribe owner).
  public func getTribeMembersWithRoles(
    state        : State,
    profileState : ProfileLib.State,
    tribeId      : TribeTypes.TribeId,
  ) : [TribeTypes.TribeMemberWithRole] {
    let record = switch (state.tribes.get(tribeId)) {
      case null return [];
      case (?r) r;
    };
    switch (state.tribeMembers.get(tribeId)) {
      case null [];
      case (?members) {
        members.filterMap<Principal, TribeTypes.TribeMemberWithRole>(func(p : Principal) : ?TribeTypes.TribeMemberWithRole {
          switch (ProfileLib.getProfile(profileState, p, func(pp : Principal) : ?Text { state.memberTribeMap.get(pp) })) {
            case null null;
            case (?profile) ?{
              userId   = p.toText();
              username = if (profile.username != "") profile.username else profile.displayName;
              isLeader = Principal.equal(p, record.ownerId);
            };
          };
        }).toArray();
      };
    };
  };
  /// Compute live cumulative totals for a tribe by summing all-time earned
  /// values across every current member. Returns null if the tribe is not found.
  public func getTribeLiveStats(
    state       : State,
    gritState   : GritLib.State,
    miningState : MiningLib.State,
    tribeId     : TribeTypes.TribeId,
  ) : ?{ totalGrit : Nat; totalAkk : Nat; memberCount : Nat } {
    switch (state.tribes.get(tribeId)) {
      case null  null;
      case (?_record) {
        var totalGrit : Nat = 0;
        var totalAkk  : Nat = 0;
        var count     : Nat = 0;
        switch (state.tribeMembers.get(tribeId)) {
          case null {};
          case (?members) {
            for (member in members.values()) {
              totalGrit += GritLib.getTotalEarned(gritState, member);
              totalAkk  += MiningLib.getAkkEarned(miningState, member);
              count     += 1;
            };
          };
        };
        ?{ totalGrit; totalAkk; memberCount = count };
      };
    };
  };
  /// Compute tribe AKK total from real block history only.
  /// This is the accurate alternative to getTribeLiveStats which reads from
  /// totalAkkWonByUser (inflated by ghost blocks before timer fix).
  /// Iterates blockHistory and sums akkReward for blocks where winnerOwner
  /// is a current member of the tribe.
  public func getTribeAkkFromHistory(
    state       : State,
    miningState : MiningLib.State,
    tribeId     : TribeTypes.TribeId,
  ) : Nat {
    let _record = switch (state.tribes.get(tribeId)) {
      case null return 0;
      case (?r) r;
    };
    // Build list of current tribe member principals
    let members = switch (state.tribeMembers.get(tribeId)) {
      case null return 0;
      case (?m) m;
    };
    var totalAkk : Nat = 0;
    // Walk the full block history and sum rewards for tribe members
    for (block in miningState.blockHistory.values()) {
      switch (block.winnerOwner) {
        case null {};
        case (?winner) {
          if (members.find(func(p : Principal) : Bool { Principal.equal(p, winner) }) != null) {
            totalAkk += block.akkReward;
          };
        };
      };
    };
    totalAkk;
  };
};
