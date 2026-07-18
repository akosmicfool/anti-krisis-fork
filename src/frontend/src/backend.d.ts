import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Account {
    owner: Principal;
    subaccount?: Uint8Array;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SocialLink {
    url: string;
    name: string;
}
export interface BlockRecord {
    winnerMinerId?: MinerId;
    minerParticipants: Array<[MinerId, Principal]>;
    blockNumber: bigint;
    minerWeights: Array<[MinerId, number]>;
    vrfValue: bigint;
    akkReward: bigint;
    timestamp: bigint;
    totalGritSpent: bigint;
    minerGritSpent: Array<[MinerId, bigint]>;
    winnerOwner?: Principal;
}
export interface Profile {
    bio: string;
    hasOgBadge: boolean;
    playerBadgeLevel: bigint;
    username: string;
    superpowers: string;
    displayName: string;
    born: string;
    socials: Array<SocialLink>;
    coverImage: string;
    miningStreak: bigint;
    profilePicture: string;
    evmAddress?: string;
    location: string;
}
export interface AllowlistedToken {
    decimals: bigint;
    tokenAddress: string;
    chain: string;
    name: string;
    priceUSD: number;
    symbol: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type MinerId = bigint;
export type TribeId = string;
export interface ClaimRecord {
    status: ClaimStatus;
    amountBurned: number;
    gritMinted: bigint;
    claimant: Principal;
    tokenAddress: string;
    chain: string;
    tokenDecimals: bigint;
    tokenSymbol: string;
    usdValue: number;
    timestamp: bigint;
    txHash: string;
    feeTxHash?: string;
}
export interface MinerView {
    id: MinerId;
    blocksMined: bigint;
    status: MinerStatus;
    owner: Principal;
    name: string;
    createdAt: bigint;
    miningRate: bigint;
    lastProcessedBlock: bigint;
    gritBalance: bigint;
    gritSpent: bigint;
}
export interface Tribe {
    id: TribeId;
    coverImageUrl?: string;
    ownerId: UserId;
    name: string;
    createdAt: Timestamp;
    memberCount: bigint;
    description: string;
    photoUrl?: string;
    cumulativeAkk: bigint;
    cumulativeGrit: bigint;
}
export interface ChainFeeEntry {
    feeWei: bigint;
    chain: string;
}
export interface AuditLogEntry {
    action: AuditAction;
    adminPrincipal: Principal;
    tokenAddress: string;
    chain: string;
    timestamp: bigint;
}
export interface MintRetryView {
    owner: Principal;
    lastAttemptTime: bigint;
    blockId: bigint;
    minerId: string;
    attempts: bigint;
    error: string;
    amount: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TribeMemberWithRole {
    username: string;
    userId: string;
    isLeader: boolean;
}
export type UserId = Principal;
export interface PublicProfile {
    bio: string;
    hasOgBadge: boolean;
    playerBadgeLevel: bigint;
    username: string;
    tribeId?: string;
    superpowers: string;
    displayName: string;
    born: string;
    socials: Array<SocialLink>;
    coverImage: string;
    miningStreak: bigint;
    profilePicture: string;
    evmAddress?: string;
    location: string;
}
export interface PlayerScoreEntry {
    principal: Principal;
    username: string;
    tribeId?: TribeId;
    displayName: string;
    rank: bigint;
    score: number;
    tribeName: string;
}
export interface BlockDetailView {
    winnerMinerId?: MinerId;
    minerParticipants: Array<[MinerId, Principal]>;
    blockNumber: bigint;
    minerWeights: Array<[MinerId, number]>;
    vrfValue: bigint;
    akkReward: bigint;
    winnerPrincipal?: Principal;
    timestamp: bigint;
    totalGritSpent: bigint;
    minerGritSpent: Array<[MinerId, bigint]>;
    minerCount: bigint;
}
export interface TribeScoreEntry {
    tribeId: TribeId;
    rank: bigint;
    memberCount: bigint;
    score: number;
    tribeName: string;
}
export interface ProfileInput {
    bio: string;
    username: string;
    superpowers: string;
    displayName: string;
    born: string;
    socials: Array<SocialLink>;
    coverImage: string;
    profilePicture: string;
    evmAddress?: string;
    location: string;
}
export enum AuditAction {
    add = "add",
    remove = "remove"
}
export enum ClaimStatus {
    verified = "verified",
    pending = "pending",
    pendingFee = "pendingFee",
    failed = "failed"
}
export enum MinerStatus {
    active = "active",
    exhausted = "exhausted",
    paused = "paused"
}
export enum ProfileError {
    bioTooLong = "bioTooLong",
    usernameTooLong = "usernameTooLong",
    superpowersTooLong = "superpowersTooLong",
    usernameRequired = "usernameRequired",
    locationTooLong = "locationTooLong",
    socialLinkTooLong = "socialLinkTooLong",
    displayNameTooLong = "displayNameTooLong",
    usernameAlreadyTaken = "usernameAlreadyTaken"
}
export enum TribeError {
    nameTaken = "nameTaken",
    noUsername = "noUsername",
    newOwnerMaxTribes = "newOwnerMaxTribes",
    descriptionTooLong = "descriptionTooLong",
    notMember = "notMember",
    newOwnerNotFound = "newOwnerNotFound",
    alreadyMember = "alreadyMember",
    notFound = "notFound",
    nameTooLong = "nameTooLong",
    notOwner = "notOwner",
    maxTribesReached = "maxTribesReached",
    newOwnerNoUsername = "newOwnerNoUsername"
}
export interface backendInterface {
    addAdmin(newAdmin: Principal): Promise<void>;
    addToken(token: AllowlistedToken): Promise<void>;
    bootstrapAdmin(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    claimOgBadge(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearAbandonedMints(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearPendingMints(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearTestScore(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createMiner(name: string, gritAmount: bigint, rate: bigint): Promise<{
        __kind__: "ok";
        ok: MinerId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createTribe(name: string, description: string, photoUrl: string | null, coverImageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: Tribe;
    } | {
        __kind__: "err";
        err: TribeError;
    }>;
    creditAbandonedMints(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    editMiner(minerId: MinerId, nameChange: string | null, topUp: bigint | null, rateChange: bigint | null, pause: boolean | null): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    editTribe(tribeId: TribeId, name: string | null, description: string | null, photoUrl: string | null, coverImageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: Tribe;
    } | {
        __kind__: "err";
        err: TribeError;
    }>;
    getAbandonedMints(): Promise<Array<MintRetryView>>;
    getAdmins(): Promise<Array<Principal>>;
    getAkkBalance(): Promise<bigint>;
    getAkkLedgerCanisterId(): Promise<Principal | null>;
    getAkkTransferFee(): Promise<bigint>;
    getAllClaimHistory(): Promise<Array<ClaimRecord>>;
    getAllowlistAuditLog(): Promise<Array<AuditLogEntry>>;
    getAppPrincipal(): Promise<Principal>;
    getBlockDetails(blockNumber: bigint): Promise<BlockDetailView | null>;
    getBlockHistory(limit: bigint): Promise<Array<BlockRecord>>;
    getBlockHistoryPage(page: bigint, pageSize: bigint): Promise<Array<BlockRecord>>;
    getCurrentBlockInfo(): Promise<{
        nextBlockIn: bigint;
        blockNumber: bigint;
        lastBlockTime: bigint;
        isMiningActive: boolean;
    }>;
    getFeePercent(): Promise<number>;
    getFeeRecipient(): Promise<string | null>;
    getGritIssuanceRate(): Promise<bigint>;
    getHistoryBasedAk69Stockpile(): Promise<number>;
    getIsLaunched(): Promise<boolean>;
    getLaunchGate(): Promise<{
        startTime: bigint;
        endTime: bigint;
        enabled: boolean;
    }>;
    getLaunchGateConfig(): Promise<{
        startTime: bigint;
        endTime: bigint;
        nftGateEnabled: boolean;
        launchTime: bigint;
        timeWindowEnabled: boolean;
        launchTimeEnabled: boolean;
    }>;
    getLedgerMintingAccount(): Promise<Account | null>;
    getMinerCreationFees(): Promise<Array<ChainFeeEntry>>;
    getMintRetryStats(): Promise<{
        totalAbandoned: bigint;
        totalRetried: bigint;
        queueDepth: bigint;
        totalSucceeded: bigint;
    }>;
    getMyBalance(): Promise<bigint>;
    getMyClaimHistory(): Promise<Array<ClaimRecord>>;
    getMyMiners(): Promise<Array<MinerView>>;
    getMyOwnedTribes(): Promise<Array<Tribe>>;
    getMyProfile(): Promise<PublicProfile | null>;
    getMyTribe(): Promise<Tribe | null>;
    getPendingMints(): Promise<Array<MintRetryView>>;
    getPlayerBurnSummary(principal: Principal): Promise<Array<[string, number]>>;
    getPlayerRank(principal: Principal, timescale: string): Promise<bigint | null>;
    getPlayerScore(principal: Principal, timescale: string): Promise<number>;
    getPlayerStreak(p: Principal): Promise<bigint>;
    getPrincipalByUsername(username: string): Promise<Principal | null>;
    getProfileByUsername(username: string): Promise<PublicProfile | null>;
    getProtocolBurnSummary(): Promise<{
        totalBurnUsd: number;
        totalGritFromBurns: bigint;
        byToken: Array<[string, number, number]>;
    }>;
    getProtocolStats(): Promise<{
        totalMiners: bigint;
        nextBlockIn: bigint;
        isMiningActive: boolean;
        totalAkkMined: bigint;
        blockReward: bigint;
        totalGritSpent: bigint;
        activeMiners: bigint;
        blocksUntilHalving: bigint;
        currentBlock: bigint;
    }>;
    getSupplyVsBalanceAudit(): Promise<{
        totalAkkMined: bigint;
        discrepancy: bigint;
        pendingMints: bigint;
        sumOfAllBalances: bigint;
    }>;
    getTestScore(): Promise<number | null>;
    getTokens(): Promise<Array<AllowlistedToken>>;
    getTopPlayers(timescale: string): Promise<Array<PlayerScoreEntry>>;
    getTopTribes(timescale: string): Promise<Array<TribeScoreEntry>>;
    getTotalAk69Score(): Promise<number>;
    getTotalAkkFromHistory(): Promise<bigint>;
    /**
     * / Captures the canister's own principal into selfPrincipal using the low-level prim.
     */
    getTotalBlockCount(): Promise<bigint>;
    getTribe(tribeId: TribeId): Promise<Tribe | null>;
    getTribeAkkFromHistory(tribeId: TribeId): Promise<bigint>;
    getTribeBurnSummary(tribeId: string): Promise<Array<[string, number]>>;
    getTribeByName(name: string): Promise<Tribe | null>;
    getTribeLiveStats(tribeId: TribeId): Promise<{
        memberCount: bigint;
        totalGrit: bigint;
        totalAkk: bigint;
    } | null>;
    getTribeMembers(tribeId: TribeId): Promise<Array<string>>;
    getTribeMembersWithRoles(tribeId: TribeId): Promise<Array<TribeMemberWithRole>>;
    getTribeRank(tribeId: string, timescale: string): Promise<bigint | null>;
    getTribeScore(tribeId: string, timescale: string): Promise<number>;
    getUserMiningStats(): Promise<{
        blocksMined: bigint;
        akkWon: bigint;
        gritSpent: bigint;
    }>;
    hasUsername(): Promise<boolean>;
    initiateClaim(txHash: string, feeTxHash: string, chain: string, tokenAddress: string, frontendPrice: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    isUsernameAvailable(username: string): Promise<boolean>;
    joinTribe(tribeId: TribeId): Promise<{
        __kind__: "ok";
        ok: Tribe;
    } | {
        __kind__: "err";
        err: TribeError;
    }>;
    leaveTribe(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: TribeError;
    }>;
    recalculateTotalAkkMined(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recheckClaimByHash(txHash: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    recheckPendingClaims(): Promise<void>;
    removeAdmin(toRemove: Principal): Promise<void>;
    removeToken(tokenAddress: string, chain: string): Promise<void>;
    resetAkkLedgerCanisterId(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resetAndClaimAdmin(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    retryFeeClaim(txHash: string, feeTxHash: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    retryMint(blockId: bigint): Promise<{
        __kind__: "Ok";
        Ok: null;
    } | {
        __kind__: "Err";
        Err: string;
    }>;
    saveMyProfile(input: ProfileInput): Promise<{
        __kind__: "ok";
        ok: Profile;
    } | {
        __kind__: "err";
        err: ProfileError;
    }>;
    searchTribes(searchQuery: string): Promise<Array<Tribe>>;
    setAkkLedgerCanisterId(id: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setAkkTransferFee(fee: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setFeePercent(percent: number): Promise<void>;
    setFeeRecipient(address: string): Promise<void>;
    setGritIssuanceRate(rate: bigint): Promise<void>;
    setLaunchGate(enabled: boolean, startTime: bigint, endTime: bigint): Promise<void>;
    setLaunchTimeGate(enabled: boolean, launchTime: bigint): Promise<void>;
    setLaunched(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setMinerCreationFee(chain: string, feeWei: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setNftGate(enabled: boolean): Promise<void>;
    setTestScore(score: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transferTribeOwnership(tribeId: TribeId, newOwnerUsername: string): Promise<{
        __kind__: "ok";
        ok: Tribe;
    } | {
        __kind__: "err";
        err: TribeError;
    }>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    transformPriceResponse(input: TransformationInput): Promise<TransformationOutput>;
    transformResponse(input: TransformationInput): Promise<TransformationOutput>;
    updatePlayerBadge(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    whoami(): Promise<Principal>;
    withdrawAkk(recipient: Account, amount: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
