module {
  public type ClaimStatus = { #pending; #verified; #failed; #pendingFee };

  /// Error variants returned by burn/claim gate checks.
  /// #LaunchNotStarted — the launch time gate is enabled and has not been reached yet.
  /// #NftGateBlocked   — the NFT gate is enabled and the caller does not hold the required NFTs.
  public type ClaimGateError = { #LaunchNotStarted; #NftGateBlocked; #OtherError : Text };

  public type ClaimRecord = {
    txHash : Text;
    feeTxHash : ?Text;  // fee transaction hash (null until fee is submitted)
    tokenAddress : Text;
    chain : Text;
    tokenSymbol : Text;
    tokenDecimals : Nat;
    amountBurned : Float;  // human-readable units (e.g. 0.01 for 0.01 axlREGEN)
    usdValue : Float;      // USD value at time of verification
    gritMinted : Nat;
    status : ClaimStatus;
    timestamp : Int;
    claimant : Principal;
  };
};
