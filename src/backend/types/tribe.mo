import Common "common";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type TribeId = Text;

  public type Tribe = {
    id             : TribeId;
    name           : Text;
    description    : Text;
    photoUrl       : ?Text;
    coverImageUrl  : ?Text;
    ownerId        : Common.UserId;
    createdAt      : Common.Timestamp;
    memberCount    : Nat;
    cumulativeGrit : Nat;
    cumulativeAkk  : Nat;
  };

  /// Mutable internal state per tribe (stats are var to grow over time).
  public type TribeRecord = {
    id                  : TribeId;
    var name            : Text;
    var description     : Text;
    var photoUrl        : ?Text;
    var coverImageUrl   : ?Text;
    ownerId             : Common.UserId;
    createdAt           : Common.Timestamp;
    var memberCount     : Nat;
    var cumulativeGrit  : Nat;
    var cumulativeAkk   : Nat;
  };

  /// Historical membership event: when a principal joined and (optionally) left a tribe.
  public type MembershipEvent = {
    member   : Principal;
    tribeId  : TribeId;
    joinDay  : Text;   // "YYYY-MM-DD" UTC
    var leaveDay : ?Text; // null while still a member
  };

  /// Snapshot of a member's GRIT+AKK at the time they joined the current tribe.
  public type ContributionSnapshot = {
    grit : Nat;
    akk  : Nat;
  };

  /// Public member entry with role information.
  public type TribeMemberWithRole = {
    userId   : Text;  // principal as text
    username : Text;
    isLeader : Bool;
  };

  public type TribeError = {
    #notFound;
    #alreadyMember;       // must leave current tribe first
    #notMember;           // leave called but caller is not in a tribe
    #notOwner;            // edit/transfer called by non-owner
    #nameTaken;           // tribe name already in use
    #nameTooLong;         // >30 chars
    #descriptionTooLong;  // >500 chars
    #maxTribesReached;    // owner already has 3 tribes
    #noUsername;          // caller has no username set
    #newOwnerNoUsername;  // transfer target has no username
    #newOwnerMaxTribes;   // transfer target already owns 5 tribes (ownership cap)
    #newOwnerNotFound;    // transfer target username does not exist
  };
};
