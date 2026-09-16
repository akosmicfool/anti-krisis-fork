// F2 review fix: freeze the mint retry timestamp at enqueue.
//
// MintRetryEntry gains `createdAtTime : Nat64` — the created_at_time the FIRST
// mint attempt used, reused verbatim by every retry (tryLedgerMint,
// creditAbandonedMints). Deriving the timestamp per attempt (mintCreatedAtTime
// with a fresh Time.now()) let the 22h clamp grid hand a later retry a
// DIFFERENT value than the original attempt — measured on 200k consecutive
// blockIds: 4.36% of blocks straddle a grid boundary inside the ~57.5 min
// retry burst. A transfer that committed but was never reported (aborted
// message, e.g. mid-upgrade) would then be re-sent under a new hash and
// minted twice instead of being rejected as #Duplicate.
//
// Only the two mint queues carry entries, so this migration rewrites just
// those lists. Pre-existing entries get the value their LAST attempt would
// have derived (anchor = lastAttemptTime), which is the best available
// reconstruction of what the ledger may already have seen; entries are
// drained or abandoned within ~1h, so any residual window is short.
//
// The migration chain must not import project files — types and the
// derivation are inlined below, mirroring lib/ledger-mint.mo.

import Map "mo:core/Map";
import List "mo:core/List";
import Int "mo:core/Int";
import Time "mo:core/Time";

module {
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
  // lib/fee-config.mo — FeeState (NEW in 20260828_000000: appended to the END
  // of the stable layout, after testingState)
  type FeeState = {
    var collectorAddress : Text;
    var requireFeePaidEvent : Bool;
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
  public type MintRetryEntryOld = {
    blockId : Nat;
    minerId : Text;
    owner : Principal;
    amount : Nat;
    var attempts : Nat;
    var lastAttemptTime : Int;
    var error : Text;
  };

  public type MintRetryEntry = {
    blockId : Nat;
    minerId : Text;
    owner : Principal;
    amount : Nat;
    var createdAtTime : Nat64;
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
  // Stable shape — OldActor matches the stable field declarations of the
  // PREVIOUS build exactly (20260826_010000). NewActor appends feeState AFTER
  // testingState, mirroring its position in main.mo. The migration maps the
  // unchanged prefix field-for-field and adds the new record.
  // ─────────────────────────────────────────────────────────────────────────────
  // NewActor = OldActor + feeState (Motoko has no type-level `with`, so the
  // record is written out in full; field ORDER matters — feeState LAST).


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
      pendingMints : List.List<MintRetryEntryOld>;
      mintedBlockIds : List.List<Nat>;
      abandonedMints : List.List<MintRetryEntryOld>;
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
    feeState : FeeState;
  };

  type NewActor = {
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
    feeState : FeeState;
  };
  // ─── F2 derivation (inlined copy of lib/ledger-mint.mo) ────────────────────
  // Kept identical to the runtime helper: a migration that derived a different
  // value than the runtime would silently break retry dedup for queued blocks.
  // Public so the test suite can pin that equivalence (test/ledger-mint.test.mo)
  // — the migration framework only ever calls `migration`.
  let MINT_TS_EPOCH_NS : Int = 1_767_225_600_000_000_000;
  let BLOCK_SECONDS_NS : Int = 690_000_000_000;
  let TX_WINDOW_NS : Int = 86_400_000_000_000;
  let WINDOW_MARGIN_NS : Int = 3_600_000_000_000;

  func fromIntClamped(v : Int) : Nat64 {
    if (v <= 0) { return 0 };
    let n = Int.abs(v);
    if (n > 9_223_372_036_854_775_807) { return 9_223_372_036_854_775_807 };
    Nat64.fromNat(n);
  };

  public func migrationDeriveTs(blockId : Nat, nowNs : Int) : Nat64 {
    let derived = MINT_TS_EPOCH_NS + blockId * BLOCK_SECONDS_NS;
    let floor = nowNs - (TX_WINDOW_NS - WINDOW_MARGIN_NS);
    if (derived >= floor and derived <= nowNs - WINDOW_MARGIN_NS) {
      return fromIntClamped(derived);
    };
    let step = TX_WINDOW_NS - 2 * WINDOW_MARGIN_NS;
    let anchor = nowNs - WINDOW_MARGIN_NS;
    let k = anchor / step;
    fromIntClamped(k * step);
  };

  /// Attach the frozen timestamp to a pre-F2 queue entry.
  /// Public so tests can pin the transformation; the framework only calls
  /// `migration`.
  public func migrationUpgradeEntry(e : MintRetryEntryOld) : MintRetryEntry {
    {
      blockId = e.blockId;
      minerId = e.minerId;
      owner = e.owner;
      amount = e.amount;
      var createdAtTime = migrationDeriveTs(
        e.blockId,
        if (e.lastAttemptTime > 0) { e.lastAttemptTime } else { Time.now() },
      );
      var attempts = e.attempts;
      var lastAttemptTime = e.lastAttemptTime;
      var error = e.error;
    };
  };

  public func migration(old : OldActor) : NewActor {
    {
      var selfPrincipal = old.selfPrincipal;
      var cachedLedgerActor = old.cachedLedgerActor;
      var cachedLedgerActorId = old.cachedLedgerActorId;
      var seedVersion = old.seedVersion;
      adminState = old.adminState;
      bootstrapAdminPrincipal = old.bootstrapAdminPrincipal;
      gateState = old.gateState;
      allowlistState = old.allowlistState;
      gritState = old.gritState;
      priceCache = old.priceCache;
      miningState = {
        var akkLedgerId = old.miningState.akkLedgerId;
        var nextMinerId = old.miningState.nextMinerId;
        miners = old.miningState.miners;
        akkBalances = old.miningState.akkBalances;
        gritSpentByUser = old.miningState.gritSpentByUser;
        totalAkkWonByUser = old.miningState.totalAkkWonByUser;
        var blockNumber = old.miningState.blockNumber;
        var totalAkkMined = old.miningState.totalAkkMined;
        minerCreationFees = old.miningState.minerCreationFees;
        blockHistory = old.miningState.blockHistory;
        var lastBlockWasEmpty = old.miningState.lastBlockWasEmpty;
        pendingMints = List.map<MintRetryEntryOld, MintRetryEntry>(old.miningState.pendingMints, migrationUpgradeEntry);
        mintedBlockIds = old.miningState.mintedBlockIds;
        abandonedMints = List.map<MintRetryEntryOld, MintRetryEntry>(old.miningState.abandonedMints, migrationUpgradeEntry);
        var totalMintRetried = old.miningState.totalMintRetried;
        var totalMintSucceeded = old.miningState.totalMintSucceeded;
        var totalMintAbandoned = old.miningState.totalMintAbandoned;
        var akkTransferFee = old.miningState.akkTransferFee;
      };
      blockTimerState = old.blockTimerState;
      profileState = old.profileState;
      tribeState = old.tribeState;
      scoringState = old.scoringState;
      testingState = old.testingState;
      feeState = old.feeState;
    };
  };
};
