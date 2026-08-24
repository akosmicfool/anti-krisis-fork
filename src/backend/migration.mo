// Explicit migrations for the AK69 scoring overhaul.
//
// Two persistent-field types changed relative to the deployed version:
//
//   1. scoringState — DailyPlayerSnapshot/DailyNetworkSnapshot renamed their
//      GRIT fields (gritEarned → gritSpent / totalGritEarned → totalGritSpent)
//      and State dropped playerLastTotals/lastNetworkTotals while gaining
//      tribeSnapshots. The old balance-delta snapshots carry no reusable data
//      for the new model, so the migration DROPS scoringState entirely; the
//      new actor initializes empty state and main.mo rebuilds every day's
//      raws from mining blockHistory at startup.
//
//   2. tribeState.membershipHistory — MembershipEvent gained exact nanosecond
//      windows (joinAt/leaveAt) for timestamp-prorated tribe attribution. The
//      migration converts each legacy event: joinAt = 00:00:00 UTC of joinDay,
//      leaveAt = 00:00:00 UTC of leaveDay (matching the legacy inclusive/exclusive
//      day-level semantics). All other tribe collections are carried over as-is.
//
//   cachedLedgerActor handling retained from the previous migration: it is a
//   runtime cache only, always reset on actor start.
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";
import TribeTypes "types/tribe";

module {
  // ─── Previous IcrcLedger actor type (unchanged from prior migration) ────────
  type OldAccount = { owner : Principal; subaccount : ?Blob };
  type OldTransferArg = {
    from_subaccount : ?Blob;
    to : OldAccount;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };
  type OldTransferError = {
    #BadBurn : { min_burn_amount : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #GenericError : { error_code : Nat; message : Text };
    #InsufficientFunds : { balance : Nat };
    #TemporarilyUnavailable;
    #TooOld;
  };
  type OldTransferResult = { #Ok : Nat; #Err : OldTransferError };
  type OldApproveArg = {
    from_subaccount : ?Blob;
    spender : OldAccount;
    amount : Nat;
    expected_allowance : ?Nat;
    expires_at : ?Nat64;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };
  type OldApproveError = {
    #AllowanceChanged : { current_allowance : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #Expired : { ledger_time : Nat64 };
    #GenericError : { error_code : Nat; message : Text };
    #InsufficientFunds : { balance : Nat };
    #TemporarilyUnavailable;
    #TooOld;
  };
  type OldApproveResult = { #Ok : Nat; #Err : OldApproveError };
  type OldTransferFromArg = {
    spender_subaccount : ?Blob;
    from : OldAccount;
    to : OldAccount;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };
  type OldTransferFromError = {
    #BadBurn : { min_burn_amount : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #GenericError : { error_code : Nat; message : Text };
    #InsufficientAllowance : { allowance : Nat };
    #InsufficientFunds : { balance : Nat };
    #TemporarilyUnavailable;
    #TooOld;
  };
  type OldTransferFromResult = { #Ok : Nat; #Err : OldTransferFromError };
  type OldIcrcLedger = actor {
    icrc1_transfer : (OldTransferArg) -> async OldTransferResult;
    icrc1_balance_of : query (OldAccount) -> async Nat;
    icrc1_total_supply : query () -> async Nat;
    icrc1_metadata : query () -> async [(Text, { #Nat : Nat; #Int : Int; #Text : Text; #Blob : Blob })];
    icrc1_fee : query () -> async Nat;
    icrc1_minting_account : query () -> async ?OldAccount;
    icrc2_approve : (OldApproveArg) -> async OldApproveResult;
    icrc2_transfer_from : (OldTransferFromArg) -> async OldTransferFromResult;
    icrc2_allowance : query ({ account : OldAccount; spender : OldAccount }) -> async { allowance : Nat; expires_at : ?Nat64 };
  };

  // ─── Old scoring state shape (consumed, not reproduced) ─────────────────────
  type OldPlayerSnapshot = {
    dayKey : Text;
    principal : Principal;
    gritEarned : Nat;
    akkWon : Nat;
  };
  type OldNetworkSnapshot = {
    dayKey : Text;
    totalGritEarned : Nat;
    totalAkkWon : Nat;
  };
  type OldScoringState = {
    networkSnapshots : Map.Map<Text, OldNetworkSnapshot>;
    playerSnapshots : Map.Map<Text, OldPlayerSnapshot>;
    playerLastTotals : Map.Map<Principal, { grit : Nat; akk : Nat }>;
    lastNetworkTotals : { var grit : Nat; var akk : Nat };
  };

  // ─── Old tribe state shape (consumed; membershipHistory converted) ──────────
  type OldMembershipEvent = {
    member : Principal;
    tribeId : Text;
    joinDay : Text;
    var leaveDay : ?Text;
  };
  type OldTribeState = {
    tribes : Map.Map<Text, TribeTypes.TribeRecord>;
    memberTribeMap : Map.Map<Principal, Text>;
    tribeMembers : Map.Map<Text, List.List<Principal>>;
    userOwnedTribes : Map.Map<Principal, List.List<Text>>;
    contributionSnapshots : Map.Map<Principal, TribeTypes.ContributionSnapshot>;
    membershipHistory : List.List<OldMembershipEvent>;
  };

  public type OldActor = {
    var cachedLedgerActor : ?OldIcrcLedger;
    scoringState : OldScoringState;
    tribeState : OldTribeState;
  };

  public type NewActor = {
    tribeState : {
      tribes : Map.Map<Text, TribeTypes.TribeRecord>;
      memberTribeMap : Map.Map<Principal, Text>;
      tribeMembers : Map.Map<Text, List.List<Principal>>;
      userOwnedTribes : Map.Map<Principal, List.List<Text>>;
      contributionSnapshots : Map.Map<Principal, TribeTypes.ContributionSnapshot>;
      membershipHistory : List.List<TribeTypes.MembershipEvent>;
    };
  };

  func digitVal(c : Char) : Int {
    switch (c) {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
      case '5' 5; case '6' 6; case '7' 7; case '8' 8; case '9' 9;
      case _ -1;
    };
  };

  /// Convert a legacy UTC dayKey ("YYYY-MM-DD") to ns since epoch at 00:00:00
  /// UTC. Mirrors ScoringLib.dayKeyToTs (kept inline per migration conventions).
  func dayKeyToTs(day : Text) : Int {
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
    let yy = if (m <= 2) y - 1 else y;
    let era = (if (yy >= 0) yy else yy - 399) / 400;
    let yoe = yy - era * 400;
    let mp0 = (if (m > 2) m - 3 else m + 9);
    let doy = (153 * mp0 + 2) / 5 + d - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    let days = era * 146_097 + doe - 719_468;
    days * 86_400 * 1_000_000_000;
  };

  public func run(old : OldActor) : NewActor {
    // Runtime cache — dropped; re-derived lazily from akkLedgerId.
    ignore old.cachedLedgerActor;
    // Legacy balance-delta snapshots — dropped; rebuilt from blockHistory at startup.
    ignore old.scoringState;

    let convertedHistory = List.empty<TribeTypes.MembershipEvent>();
    for (ev in old.tribeState.membershipHistory.values()) {
      convertedHistory.add({
        member = ev.member;
        tribeId = ev.tribeId;
        joinDay = ev.joinDay;
        var leaveDay = ev.leaveDay;
        joinAt = dayKeyToTs(ev.joinDay);
        var leaveAt = switch (ev.leaveDay) {
          case null null;
          case (?ld) ?(dayKeyToTs(ld));
        };
      });
    };

    {
      tribeState = {
        tribes                = old.tribeState.tribes;
        memberTribeMap        = old.tribeState.memberTribeMap;
        tribeMembers          = old.tribeState.tribeMembers;
        userOwnedTribes       = old.tribeState.userOwnedTribes;
        contributionSnapshots = old.tribeState.contributionSnapshots;
        membershipHistory     = convertedHistory;
      };
    };
  };
};
