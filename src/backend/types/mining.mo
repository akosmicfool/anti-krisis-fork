import Map "mo:core/Map";
import List "mo:core/List";

module {
  /// Entry in the mint retry queue — one per failed block reward mint.
  public type MintRetryEntry = {
    blockId          : Nat;
    minerId          : Text;   // stringified MinerId for the winning miner
    owner            : Principal;
    amount           : Nat;    // reward in e8s
    var attempts     : Nat;
    var lastAttemptTime : Int; // Time.now() nanoseconds at last attempt
    var error        : Text;   // last error message
  };

  /// Immutable public view of a MintRetryEntry (safe for Candid return types).
  public type MintRetryView = {
    blockId         : Nat;
    minerId         : Text;
    owner           : Principal;
    amount          : Nat;
    attempts        : Nat;
    lastAttemptTime : Int;
    error           : Text;
  };

  public type MinerId = Nat;

  public type MinerStatus = {
    #active;
    #paused;
    #exhausted;
  };

  /// On-chain miner record (internal — contains mutable fields)
  public type MinerRecord = {
    id : MinerId;
    owner : Principal;
    var name : Text;
    var gritBalance : Nat;
    var miningRate : Nat;   // GRIT per day (1..10_000_000_000)
    var status : MinerStatus;
    createdAt : Int;
    var lastProcessedBlock : Nat;
    var blocksMined : Nat;  // cumulative blocks this miner has won
    var gritSpent : Nat;    // cumulative GRIT spent by this miner
  };

  /// Immutable public view of a miner (safe to return over Candid)
  public type MinerView = {
    id : MinerId;
    owner : Principal;
    name : Text;
    gritBalance : Nat;
    miningRate : Nat;
    status : MinerStatus;
    createdAt : Int;
    lastProcessedBlock : Nat;
    blocksMined : Nat;
    gritSpent : Nat;
  };

  public type BlockRecord = {
    blockNumber : Nat;
    timestamp : Int;
    winnerMinerId : ?MinerId;
    winnerOwner : ?Principal;
    akkReward : Nat;
    totalGritSpent : Nat;
    /// (minerId, ownerPrincipal) pairs for every miner that participated in this block
    minerParticipants : [(MinerId, Principal)];
    /// GRIT spent by each participating miner this block
    minerGritSpent : [(MinerId, Nat)];
    /// Weighting coefficient for each miner (their GRIT / totalGritSpent)
    minerWeights : [(MinerId, Float)];
    /// Raw VRF Nat64 value used to select the winner
    vrfValue : Nat64;
  };

  /// Full block detail view returned by getBlockDetails query.
  public type BlockDetailView = {
    blockNumber : Nat;
    winnerPrincipal : ?Principal;
    winnerMinerId : ?MinerId;
    minerParticipants : [(MinerId, Principal)];
    totalGritSpent : Nat;
    minerCount : Nat;
    minerGritSpent : [(MinerId, Nat)];
    minerWeights : [(MinerId, Float)];
    vrfValue : Nat64;
    akkReward : Nat;
    timestamp : Int;
  };

  /// Per-chain miner creation fee entry (chain name → fee in native token smallest unit)
  public type ChainFeeEntry = {
    chain : Text;
    feeWei : Nat;
  };

  /// Dynamic per-chain miner creation fees: chain name (Text) → fee in wei (Nat)
  public type MinerCreationFeeConfig = Map.Map<Text, Nat>;

  public type State = {    /// Optional AKK ledger canister ID — set via admin call after ledger deployment.
    /// null = use internal balance map (draft mode); ?id = real ICRC-1 ledger.
    var akkLedgerId : ?Principal;
    var nextMinerId : Nat;
    miners : Map.Map<MinerId, MinerRecord>;
    akkBalances : Map.Map<Principal, Nat>;
    gritSpentByUser : Map.Map<Principal, Nat>;
    /// Cumulative all-time AKK earned per user from block rewards.
    /// Only ever increases — unaffected by withdrawals or transfers.
    totalAkkWonByUser : Map.Map<Principal, Nat>;
    var blockNumber : Nat;
    var totalAkkMined : Nat;
    /// Dynamic map of chain name → miner creation fee in wei
    minerCreationFees : MinerCreationFeeConfig;
    blockHistory : List.List<BlockRecord>;
    /// True when the previous processBlock call found totalGritSpent == 0 (or on fresh start).
    /// Used to detect mining resuming from a pause and reset the block clock.
    var lastBlockWasEmpty : Bool;
    /// Pending mint retry queue: (winner principal, AKK amount, block number)
    /// Entries here were credited to the internal akkBalances map after a ledger mint failure.
    /// A background drainer retries the ledger mint; on success the entry is removed and
    /// the internal balance is decremented so the ledger becomes authoritative.
    /// Rich mint retry queue — one entry per failed block reward mint.
    /// Keyed conceptually by blockId (deduplication key).
    pendingMints : List.List<MintRetryEntry>;
    /// Blocks whose rewards were successfully minted to the ledger (deduplication set).
    /// Stored as a flat List so it survives orthogonal persistence without stable HashMap.
    mintedBlockIds : List.List<Nat>;
    /// Mints that exhausted MAX_MINT_ATTEMPTS; moved here for admin review.
    abandonedMints : List.List<MintRetryEntry>;
    /// Cumulative count of mints retried (attempts > 0).
    var totalMintRetried : Nat;
    /// Cumulative count of mints that eventually succeeded via the retry path.
    var totalMintSucceeded : Nat;
    /// Cumulative count of mints abandoned after MAX_MINT_ATTEMPTS failures.
    var totalMintAbandoned : Nat;
    /// Configurable AKK transfer fee in e8s (default 10_000). Applied in withdrawAkk.
    var akkTransferFee : Nat;
  };
};
