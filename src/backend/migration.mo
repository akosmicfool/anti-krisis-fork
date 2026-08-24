// Explicit migration for the akk-withdrawal fix.
//
// Why this migration exists:
//   The IcrcLedger actor type in types/akk-ledger.mo gained an `icrc1_fee` method so
//   withdrawAkk can query the live ledger fee and avoid #BadFee rejections. Because the
//   canister is built with `--default-persistent-actors`, the `cachedLedgerActor` field
//   is treated as stable, and its type widened in a way that is NOT a stable subtype of
//   the previous version (the old actor type lacks `icrc1_fee`). An explicit migration
//   is required to upgrade.
//
//   `cachedLedgerActor` is a runtime cache only — it is reset to null on every actor
//   start (see doCaptureSelf in main.mo) and lazily re-derived from `miningState.akkLedgerId`.
//   So the migration simply drops the old cached reference and lets the new actor
//   re-initialize it to null. No data is lost.
//
// All other persistent fields are inherited unchanged from the previous actor version
// (they are neither consumed nor produced by this migration).
import AkkLedgerTypes "types/akk-ledger";

module {
  // The previous IcrcLedger actor type, exactly as deployed in .old/src/backend/types/akk-ledger.mo
  // (without icrc1_fee). Defined inline per the migrating-motoko-actors skill — do NOT
  // import from .old/ because those paths do not resolve in the sandboxed compile env.
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
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
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
    #BadFee : { expected_fee : Nat };
    #InsufficientFunds : { balance : Nat };
    #AllowanceChanged : { current_allowance : Nat };
    #Expired : { ledger_time : Nat64 };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
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
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #InsufficientAllowance : { allowance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };
  type OldTransferFromResult = { #Ok : Nat; #Err : OldTransferFromError };
  type OldIcrcLedger = actor {
    icrc1_transfer : (OldTransferArg) -> async OldTransferResult;
    icrc1_balance_of : query (OldAccount) -> async Nat;
    icrc1_total_supply : query () -> async Nat;
    icrc1_metadata : query () -> async [(Text, { #Nat : Nat; #Int : Int; #Text : Text; #Blob : Blob })];
    icrc1_minting_account : query () -> async ?OldAccount;
    icrc1_fee : query () -> async Nat;
    icrc2_approve : (OldApproveArg) -> async OldApproveResult;
    icrc2_transfer_from : (OldTransferFromArg) -> async OldTransferFromResult;
    icrc2_allowance : query ({ account : OldAccount; spender : OldAccount }) -> async { allowance : Nat; expires_at : ?Nat64 };
  };

  // Only the field whose type changed needs to be consumed. The runtime cache is dropped;
  // the new actor re-initializes it to null and re-derives it lazily from akkLedgerId.
  public type OldActor = {
    var cachedLedgerActor : ?OldIcrcLedger;
  };

  // NewActor produces nothing for cachedLedgerActor — the new actor's own declaration
  // (`var cachedLedgerActor : ?AkkLedgerTypes.IcrcLedger = null;`) initializes it.
  // Producing an empty record signals "inherit everything else from the old actor".
  public type NewActor = {};

  public func run(_old : OldActor) : NewActor {
    // Intentionally drop _old.cachedLedgerActor — it is a runtime cache, not durable data.
    ignore _old.cachedLedgerActor;
    {};
  };
};
