import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import ProfileTypes "../types/profile";

module {
  func normUsername(u : Text) : Text {
    u.trim(#char ' ').toLower();
  };

  public type State = {
    profiles : Map.Map<Principal, ProfileTypes.Profile>;
  };

  /// Project a stored Profile + resolved tribeId into a PublicProfile view.
  public func toPublic(profile : ProfileTypes.Profile, tribeId : ?Text) : ProfileTypes.PublicProfile {
    {
      username         = profile.username;
      displayName      = profile.displayName;
      bio              = profile.bio;
      location         = profile.location;
      born             = profile.born;
      superpowers      = profile.superpowers;
      profilePicture   = profile.profilePicture;
      coverImage       = profile.coverImage;
      socials          = profile.socials;
      evmAddress       = profile.evmAddress;
      hasOgBadge       = profile.hasOgBadge;
      playerBadgeLevel = profile.playerBadgeLevel;
      miningStreak     = profile.miningStreak;
      tribeId          = tribeId;
    };
  };

  /// Validate all char-limit constraints. Returns ?ProfileError on first violation.
  func validate(input : ProfileTypes.ProfileInput) : ?ProfileTypes.ProfileError {
    if (input.username == "")           return ?#usernameRequired;
    if (input.username.size() > 15)     return ?#usernameTooLong;
    if (input.displayName.size() > 30)  return ?#displayNameTooLong;
    if (input.bio.size() > 500)         return ?#bioTooLong;
    if (input.location.size() > 30)     return ?#locationTooLong;
    if (input.superpowers.size() > 250) return ?#superpowersTooLong;
    for (link in input.socials.values()) {
      if (link.name.size() > 100 or link.url.size() > 100) return ?#socialLinkTooLong;
    };
    null;
  };

  /// Get a stored profile and resolve tribeId via a lookup callback.
  public func getProfile(
    state    : State,
    caller   : Principal,
    getTribe : (Principal) -> ?Text,
  ) : ?ProfileTypes.PublicProfile {
    switch (state.profiles.get(caller)) {
      case null null;
      case (?p) ?(toPublic(p, getTribe(caller)));
    };
  };

  /// Look up a profile by username (case-sensitive). O(n) scan.
  public func getProfileByUsername(
    state    : State,
    username : Text,
    getTribe : (Principal) -> ?Text,
  ) : ?ProfileTypes.PublicProfile {
    for ((owner, profile) in state.profiles.entries()) {
      if (normUsername(profile.username) == normUsername(username)) return ?(toPublic(profile, getTribe(owner)));
    };
    null;
  };

  /// Reverse lookup: find the principal whose profile has the given username.
  /// Returns null if no profile with that username exists.
  public func getPrincipalByUsername(state : State, username : Text) : ?Principal {
    for ((principal, profile) in state.profiles.entries()) {
      if (normUsername(profile.username) == normUsername(username)) return ?principal;
    };
    null;
  };

  /// Returns true if the caller already has a profile with a non-empty username.
  public func hasUsername(state : State, caller : Principal) : Bool {
    switch (state.profiles.get(caller)) {
      case (?p) p.username != "";
      case null false;
    };
  };

  /// Returns true if no other profile currently holds this username.
  public func isUsernameAvailable(state : State, claimant : Principal, username : Text) : Bool {
    for ((p, profile) in state.profiles.entries()) {
      if (normUsername(profile.username) == normUsername(username) and not Principal.equal(p, claimant)) {
        return false;
      };
    };
    true;
  };

  /// Recompute and store playerBadgeLevel for the given principal based on their current AK69 score.
  /// Badge level only ever increases (ratchet: never decreases once earned).
  /// Returns false if the profile does not exist.
  public func updatePlayerBadgeLevel(
    state  : State,
    caller : Principal,
    score  : Float,
  ) : Bool {
    switch (state.profiles.get(caller)) {
      case null false;
      case (?existing) {
        let newLevel : Nat = if (score >= 69000.0) 3
          else if (score >= 6900.0) 2
          else if (score >= 690.0)  1
          else 0;
        // Ratchet: only upgrade, never downgrade
        let finalLevel = if (newLevel > existing.playerBadgeLevel) newLevel else existing.playerBadgeLevel;
        state.profiles.add(caller, { existing with playerBadgeLevel = finalLevel });
        true;
      };
    };
  };

  /// Update the miningStreak for the given principal.
  /// Pass the new streak value (caller computes increment/reset logic).
  /// Returns false if the profile does not exist.
  public func updateMiningStreak(state : State, p : Principal, newStreak : Nat) : Bool {
    switch (state.profiles.get(p)) {
      case null false;
      case (?existing) {
        state.profiles.add(p, { existing with miningStreak = newStreak });
        true;
      };
    };
  };

  /// Get miningStreak for a principal. Returns 0 if no profile exists.
  public func getMiningStreak(state : State, p : Principal) : Nat {
    switch (state.profiles.get(p)) {
      case null 0;
      case (?pr) pr.miningStreak;
    };
  };

  /// Set hasOgBadge = true for the given principal. Returns false if the profile does not exist.
  public func claimOgBadge(state : State, caller : Principal) : Bool {
    switch (state.profiles.get(caller)) {
      case null false;
      case (?existing) {
        state.profiles.add(caller, { existing with hasOgBadge = true });
        true;
      };
    };
  };

  public func saveProfile(
    state   : State,
    caller  : Principal,
    input   : ProfileTypes.ProfileInput,
  ) : { #ok : ProfileTypes.Profile; #err : ProfileTypes.ProfileError } {
    let cleanUsername = input.username.trim(#char ' ');
    let cleaned : ProfileTypes.ProfileInput = { input with username = cleanUsername };
    switch (validate(cleaned)) {
      case (?e) return #err(e);
      case null {};
    };
    // Username uniqueness (case-insensitive): reject if another principal owns this username.
    if (not isUsernameAvailable(state, caller, cleanUsername)) {
      return #err(#usernameAlreadyTaken);
    };
    // Preserve hasOgBadge, playerBadgeLevel, and miningStreak from any existing profile so saveProfile never resets them.
    let (existingOgBadge, existingBadgeLevel, existingStreak) : (Bool, Nat, Nat) = switch (state.profiles.get(caller)) {
      case (?existing) (existing.hasOgBadge, existing.playerBadgeLevel, existing.miningStreak);
      case null (false, 0, 0);
    };
    let profile : ProfileTypes.Profile = {
      username         = cleanUsername;
      displayName      = cleaned.displayName;
      bio              = cleaned.bio;
      location         = cleaned.location;
      born             = cleaned.born;
      superpowers      = cleaned.superpowers;
      profilePicture   = cleaned.profilePicture;
      coverImage       = cleaned.coverImage;
      socials          = cleaned.socials;
      evmAddress       = cleaned.evmAddress;
      hasOgBadge       = existingOgBadge;
      playerBadgeLevel = existingBadgeLevel;
      miningStreak     = existingStreak;
    };
    state.profiles.add(caller, profile);
    #ok(profile);
  };
};
