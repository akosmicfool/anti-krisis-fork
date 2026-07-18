import TribeLib "../lib/tribe";
import TribeTypes "../types/tribe";
import ProfileLib "../lib/profile";
import GritLib "../lib/grit";
import MiningLib "../lib/mining";

mixin (
  tribeState   : TribeLib.State,
  profileState : ProfileLib.State,
  gritState    : GritLib.State,
  miningState  : MiningLib.State,
) {
  // ─── Internal helper: get caller's all-time GRIT+AKK earned ──────────────
  // Use all-time earned accumulators for both GRIT and AKK so that
  // spending GRIT on mining or withdrawing AKK never causes tribe
  // cumulative totals to stall or regress.
  func getBalances(caller : Principal) : (Nat, Nat) {
    let grit = GritLib.getTotalEarned(gritState, caller);
    let akk  = MiningLib.getAkkEarned(miningState, caller);
    (grit, akk);
  };

  // ─── Tribe creation ────────────────────────────────────────────────────────

  public shared ({ caller }) func createTribe(
    name          : Text,
    description   : Text,
    photoUrl      : ?Text,
    coverImageUrl : ?Text,
  ) : async { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    TribeLib.createTribe(tribeState, profileState, caller, name, description, photoUrl, coverImageUrl);
  };

  // ─── Membership ────────────────────────────────────────────────────────────

  public shared ({ caller }) func joinTribe(
    tribeId : TribeTypes.TribeId,
  ) : async { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    let (grit, akk) = getBalances(caller);
    TribeLib.joinTribe(tribeState, profileState, caller, tribeId, grit, akk);
  };

  public shared ({ caller }) func leaveTribe() : async { #ok; #err : TribeTypes.TribeError } {
    let (grit, akk) = getBalances(caller);
    TribeLib.leaveTribe(tribeState, caller, grit, akk);
  };

  // ─── Management ────────────────────────────────────────────────────────────

  public shared ({ caller }) func editTribe(
    tribeId       : TribeTypes.TribeId,
    name          : ?Text,
    description   : ?Text,
    photoUrl      : ?Text,
    coverImageUrl : ?Text,
  ) : async { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    TribeLib.editTribe(tribeState, caller, tribeId, name, description, photoUrl, coverImageUrl);
  };

  public shared ({ caller }) func transferTribeOwnership(
    tribeId          : TribeTypes.TribeId,
    newOwnerUsername : Text,
  ) : async { #ok : TribeTypes.Tribe; #err : TribeTypes.TribeError } {
    TribeLib.transferOwnership(tribeState, profileState, caller, tribeId, newOwnerUsername);
  };

  // ─── Queries ───────────────────────────────────────────────────────────────

  public shared query func getTribe(
    tribeId : TribeTypes.TribeId,
  ) : async ?TribeTypes.Tribe {
    TribeLib.getTribe(tribeState, tribeId);
  };

  public shared query func getTribeByName(
    name : Text,
  ) : async ?TribeTypes.Tribe {
    TribeLib.getTribeByName(tribeState, name);
  };

  public shared query func searchTribes(
    searchQuery : Text,
  ) : async [TribeTypes.Tribe] {
    TribeLib.searchTribes(tribeState, searchQuery);
  };

  public shared query ({ caller }) func getMyTribe() : async ?TribeTypes.Tribe {
    TribeLib.getMyTribe(tribeState, caller);
  };

  public shared query ({ caller }) func getMyOwnedTribes() : async [TribeTypes.Tribe] {
    TribeLib.getMyOwnedTribes(tribeState, caller);
  };

  public shared query func getTribeLiveStats(
    tribeId : TribeTypes.TribeId,
  ) : async ?{ totalGrit : Nat; totalAkk : Nat; memberCount : Nat } {
    TribeLib.getTribeLiveStats(tribeState, gritState, miningState, tribeId);
  };

  /// Query tribe AKK calculated from real block history (not inflated totalAkkWonByUser).
  /// Returns 0 when the tribe is not found or no blocks match.
  public shared query func getTribeAkkFromHistory(
    tribeId : TribeTypes.TribeId,
  ) : async Nat {
    TribeLib.getTribeAkkFromHistory(tribeState, miningState, tribeId);
  };

  public shared query func getTribeMembers(
    tribeId : TribeTypes.TribeId,
  ) : async [Text] {
    TribeLib.getTribeMembers(tribeState, profileState, tribeId);
  };

  public shared query func getTribeMembersWithRoles(
    tribeId : TribeTypes.TribeId,
  ) : async [TribeTypes.TribeMemberWithRole] {
    TribeLib.getTribeMembersWithRoles(tribeState, profileState, tribeId);
  };
};
