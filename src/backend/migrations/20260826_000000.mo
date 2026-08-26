import Map "mo:core/Map";
import List "mo:core/List";

module {
  // ─────────────────────────────────────────────────────────────────────────────
  // Inlined project types — the migration chain must not import project files.
  // ─────────────────────────────────────────────────────────────────────────────

  // types/akk-ledger.mo — IcrcLedger (actor type referenced by cachedLedgerActor)
  type Account = { owner : Principal; subaccount : ?Blob };
  type TransferArg = {
    from_subaccount : ?Blob;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };
  type TransferError = {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };
  type TransferResult = { #Ok : Nat; #Err : TransferError };
  type ApproveArg = {
    from_subaccount : ?Blob;
    spender : Account;
    amount : Nat;
    expected_allowance : ?Nat;
    expires_at : ?Nat64;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };
  type ApproveError = {
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
  type ApproveResult = { #Ok : Nat; #Err : ApproveError };
  type TransferFromArg = {
    spender_subaccount : ?Blob;
    from : Account;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };
  type TransferFromError = {
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
  type TransferFromResult = { #Ok : Nat; #Err : TransferFromError };
  type IcrcLedger = actor {
    icrc1_transfer : (TransferArg) -> async TransferResult;
    icrc1_balance_of : query (Account) -> async Nat;
    icrc1_total_supply : query () -> async Nat;
    icrc1_metadata : query () -> async [(Text, { #Nat : Nat; #Int : Int; #Text : Text; #Blob : Blob })];
    icrc1_minting_account : query () -> async ?Account;
    icrc1_fee : query () -> async Nat;
    icrc2_approve : (ApproveArg) -> async ApproveResult;
    icrc2_transfer_from : (TransferFromArg) -> async TransferFromResult;
    icrc2_allowance : query ({ account : Account; spender : Account }) -> async { allowance : Nat; expires_at : ?Nat64 };
  };

  // types/allowlist.mo
  type AllowlistedToken = {
    tokenAddress : Text;
    chain : Text;
    name : Text;
    symbol : Text;
    decimals : Nat;
    priceUSD : Float;
  };
  type AuditAction = { #add; #remove };
  type AuditLogEntry = {
    action : AuditAction;
    tokenAddress : Text;
    chain : Text;
    adminPrincipal : Principal;
    timestamp : Int;
  };

  // lib/allowlist.mo — AdminState, GateState
  type AdminState = {
    admins : List.List<Principal>;
    var feeRecipient : ?Text;
    var feePercent : Float;
    var gritIssuanceRate : Nat;
    var bootstrapPrincipalSet : Bool;
    var isLaunched : Bool;
  };
  type GateState = {
    var gateEnabled : Bool;
    var gateStartTime : Int;
    var gateEndTime : Int;
    var launchTimeEnabled : Bool;
    var launchTime : Int;
    var nftGateEnabled : Bool;
  };

  // types/grit.mo
  type ClaimStatus = { #pending; #verified; #failed; #pendingFee };
  type ClaimRecord = {
    txHash : Text;
    feeTxHash : ?Text;
    tokenAddress : Text;
    chain : Text;
    tokenSymbol : Text;
    tokenDecimals : Nat;
    amountBurned : Float;
    usdValue : Float;
    gritMinted : Nat;
    status : ClaimStatus;
    timestamp : Int;
    claimant : Principal;
  };

  // types/mining.mo
  type MinerId = Nat;
  type MinerStatus = { #active; #paused; #exhausted };
  type MinerRecord = {
    id : MinerId;
    owner : Principal;
    var name : Text;
    var gritBalance : Nat;
    var miningRate : Nat;
    var status : MinerStatus;
    createdAt : Int;
    var lastProcessedBlock : Nat;
    var blocksMined : Nat;
    var gritSpent : Nat;
  };
  type BlockRecord = {
    blockNumber : Nat;
    timestamp : Int;
    winnerMinerId : ?MinerId;
    winnerOwner : ?Principal;
    akkReward : Nat;
    totalGritSpent : Nat;
    minerParticipants : [(MinerId, Principal)];
    minerGritSpent : [(MinerId, Nat)];
    minerWeights : [(MinerId, Float)];
    vrfValue : Nat64;
  };
  type MintRetryEntry = {
    blockId : Nat;
    minerId : Text;
    owner : Principal;
    amount : Nat;
    var attempts : Nat;
    var lastAttemptTime : Int;
    var error : Text;
  };
  type MinerCreationFeeConfig = Map.Map<Text, Nat>;

  // types/profile.mo
  type SocialLink = { name : Text; url : Text };
  type Profile = {
    username : Text;
    displayName : Text;
    bio : Text;
    location : Text;
    born : Text;
    superpowers : Text;
    profilePicture : Text;
    coverImage : Text;
    socials : [SocialLink];
    evmAddress : ?Text;
    hasOgBadge : Bool;
    playerBadgeLevel : Nat;
    miningStreak : Nat;
  };

  // types/tribe.mo
  type TribeId = Text;
  type TribeRecord = {
    id : TribeId;
    var name : Text;
    var description : Text;
    var photoUrl : ?Text;
    var coverImageUrl : ?Text;
    ownerId : Principal;
    createdAt : Int;
    var memberCount : Nat;
    var cumulativeGrit : Nat;
    var cumulativeAkk : Nat;
  };
  type MembershipEvent = {
    member : Principal;
    tribeId : TribeId;
    joinDay : Text;
    var leaveDay : ?Text;
    joinAt : Int;
    var leaveAt : ?Int;
  };
  type ContributionSnapshot = { grit : Nat; akk : Nat };

  // types/scoring.mo
  type DailyNetworkSnapshot = { dayKey : Text; totalGritSpent : Nat; totalAkkWon : Nat };
  type DailyPlayerSnapshot = { dayKey : Text; principal : Principal; gritSpent : Nat; akkWon : Nat };
  type DailyTribeSnapshot = { dayKey : Text; tribeId : TribeId; gritSpent : Nat; akkWon : Nat };

  // ─────────────────────────────────────────────────────────────────────────────
  // Stable shape — matches the stable field declarations in main.mo exactly.
  // Pure legacy→EM upgrade: stable shape unchanged, so NewActor = OldActor.
  // ─────────────────────────────────────────────────────────────────────────────
  type OldActor = {
    var selfPrincipal : ?Principal;
    var cachedLedgerActor : ?IcrcLedger;
    var cachedLedgerActorId : ?Principal;
    var seedVersion : Nat;
    adminState : AdminState;
    bootstrapAdminPrincipal : ?Principal;
    gateState : GateState;
    allowlistState : {
      tokens : List.List<AllowlistedToken>;
      auditLog : List.List<AuditLogEntry>;
    };
    gritState : {
      balances : Map.Map<Principal, Nat>;
      totalEarned : Map.Map<Principal, Nat>;
      claims : List.List<ClaimRecord>;
    };
    priceCache : Map.Map<Text, Float>;
    miningState : {
      var akkLedgerId : ?Principal;
      var nextMinerId : Nat;
      miners : Map.Map<MinerId, MinerRecord>;
      akkBalances : Map.Map<Principal, Nat>;
      gritSpentByUser : Map.Map<Principal, Nat>;
      totalAkkWonByUser : Map.Map<Principal, Nat>;
      var blockNumber : Nat;
      var totalAkkMined : Nat;
      minerCreationFees : MinerCreationFeeConfig;
      blockHistory : List.List<BlockRecord>;
      var lastBlockWasEmpty : Bool;
      pendingMints : List.List<MintRetryEntry>;
      mintedBlockIds : List.List<Nat>;
      abandonedMints : List.List<MintRetryEntry>;
      var totalMintRetried : Nat;
      var totalMintSucceeded : Nat;
      var totalMintAbandoned : Nat;
      var akkTransferFee : Nat;
    };
    blockTimerState : { var timerId : ?Nat };
    profileState : { profiles : Map.Map<Principal, Profile> };
    tribeState : {
      tribes : Map.Map<TribeId, TribeRecord>;
      memberTribeMap : Map.Map<Principal, TribeId>;
      tribeMembers : Map.Map<TribeId, List.List<Principal>>;
      userOwnedTribes : Map.Map<Principal, List.List<TribeId>>;
      contributionSnapshots : Map.Map<Principal, ContributionSnapshot>;
      membershipHistory : List.List<MembershipEvent>;
    };
    scoringState : {
      networkSnapshots : Map.Map<Text, DailyNetworkSnapshot>;
      playerSnapshots : Map.Map<Text, DailyPlayerSnapshot>;
      tribeSnapshots : Map.Map<Text, DailyTribeSnapshot>;
    };
    testingState : { overrides : Map.Map<Principal, Float> };
  };

  type NewActor = OldActor;

  public func migration(old : OldActor) : NewActor { old };
};
