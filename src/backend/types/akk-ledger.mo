/// ICRC-1/2/3 types and typed actor interface for the AKK ledger canister.
/// The backend canister uses this to call the AKK ledger as the minting authority.
module {

  /// An ICRC-1 account: a principal with an optional 32-byte subaccount.
  public type Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  /// ICRC-1 transfer argument.
  public type TransferArg = {
    from_subaccount : ?Blob;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  /// ICRC-1 transfer result.
  public type TransferError = {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };
  public type TransferResult = { #Ok : Nat; #Err : TransferError };

  /// ICRC-2 approve argument.
  public type ApproveArg = {
    from_subaccount : ?Blob;
    spender : Account;
    amount : Nat;
    expected_allowance : ?Nat;
    expires_at : ?Nat64;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  /// ICRC-2 approve result.
  public type ApproveError = {
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
  public type ApproveResult = { #Ok : Nat; #Err : ApproveError };

  /// ICRC-2 transfer_from argument.
  public type TransferFromArg = {
    spender_subaccount : ?Blob;
    from : Account;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  /// ICRC-2 transfer_from result.
  public type TransferFromError = {
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
  public type TransferFromResult = { #Ok : Nat; #Err : TransferFromError };

  /// Typed actor interface for the AKK ICRC-1/2/3 ledger canister.
  /// Import this actor type and bind it to the ledger canister principal at runtime.
  public type IcrcLedger = actor {
    /// ICRC-1: Transfer tokens from caller's account to another.
    icrc1_transfer : (TransferArg) -> async TransferResult;

    /// ICRC-1: Query an account balance.
    icrc1_balance_of : query (Account) -> async Nat;

    /// ICRC-1: Query total supply.
    icrc1_total_supply : query () -> async Nat;

    /// ICRC-1: Query token metadata (name, symbol, decimals, fee).
    icrc1_metadata : query () -> async [(Text, { #Nat : Nat; #Int : Int; #Text : Text; #Blob : Blob })];

    /// ICRC-1: Query the minting account (the principal that can create tokens).
    icrc1_minting_account : query () -> async ?Account;

    /// ICRC-1: Query the default transfer fee (in e8s).
    icrc1_fee : query () -> async Nat;

    /// ICRC-2: Approve a spender to transfer up to `amount` from caller.
    icrc2_approve : (ApproveArg) -> async ApproveResult;

    /// ICRC-2: Transfer tokens from an approved account.
    icrc2_transfer_from : (TransferFromArg) -> async TransferFromResult;

    /// ICRC-2: Query the current allowance granted by `account` to `spender`.
    icrc2_allowance : query ({ account : Account; spender : Account }) -> async { allowance : Nat; expires_at : ?Nat64 };
  };
};
