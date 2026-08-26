import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type MintRetryView,
  ProfileError,
  TribeError,
  createActor,
} from "../backend";
import type {
  AllowlistedToken,
  AuditLogEntry,
  BlockRecord,
  ChainFeeEntry,
  ClaimRecord,
  MinerView,
  Profile,
  ProfileInput,
  Tribe,
  TribeId,
} from "../backend";
import { fetchDexScreenerPrice } from "../utils/dexscreener";
import { useAuth } from "./use-auth";

export function profileErrorMessage(err: ProfileError | string): string {
  switch (err) {
    case ProfileError.usernameAlreadyTaken:
    case "usernameAlreadyTaken":
      return "Username already taken";
    case ProfileError.usernameRequired:
    case "usernameRequired":
      return "Username is required";
    case ProfileError.usernameTooLong:
    case "usernameTooLong":
      return "Username must be 15 characters or less";
    case ProfileError.displayNameTooLong:
    case "displayNameTooLong":
      return "Display name must be 30 characters or less";
    case ProfileError.bioTooLong:
    case "bioTooLong":
      return "Bio must be 500 characters or less";
    case ProfileError.locationTooLong:
    case "locationTooLong":
      return "Location must be 30 characters or less";
    case ProfileError.superpowersTooLong:
    case "superpowersTooLong":
      return "Superpowers must be 250 characters or less";
    case ProfileError.socialLinkTooLong:
    case "socialLinkTooLong":
      return "Social link name and URL must be 100 characters or less";
    default:
      return typeof err === "string" && err ? err : "Could not save profile";
  }
}

function useActorInstance() {
  return useActor(createActor);
}

// ─── Allowlist ───────────────────────────────────────────────────────────────

export function useGetTokens() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<AllowlistedToken[]>({
    queryKey: ["tokens"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTokens();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
    refetchOnMount: "always",
  });
}

export function useAddToken() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: AllowlistedToken) => {
      if (!actor) throw new Error("Not connected");
      return actor.addToken(token);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tokens"] });
      qc.refetchQueries({ queryKey: ["tokens"] });
      qc.invalidateQueries({ queryKey: ["minerCreationFees"] });
      qc.invalidateQueries({
        queryKey: ["livePrice", variables.tokenAddress.toLowerCase()],
      });
    },
  });
}

export function useRemoveToken() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { tokenAddress: string; chain: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeToken(args.tokenAddress, args.chain);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tokens"] });
      qc.invalidateQueries({ queryKey: ["minerCreationFees"] });
    },
  });
}

export function useAllowlistAuditLog() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<AuditLogEntry[]>({
    queryKey: ["auditLog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllowlistAuditLog();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── GRIT / Claims ───────────────────────────────────────────────────────────

export function useMyBalance() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<bigint>({
    queryKey: ["myBalance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMyBalance();
    },
    enabled: !!actor && !isFetching,
    // Always refetch on mount so navigating to dashboard after a claim shows
    // the updated balance immediately without waiting for the next poll cycle.
    refetchOnMount: "always",
    // Refetch when the window regains focus — catches the case where the user
    // signs a burn and then tabs back to the dashboard.
    refetchOnWindowFocus: true,
    // Poll every 5 seconds to stay live during active sessions.
    refetchInterval: 5_000,
  });
}
export function useAkkBalance() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<bigint>({
    queryKey: ["akkBalance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      // getAkkBalance is an async update call (not a query) — may take longer
      return actor.getAkkBalance();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    // 30s interval — update calls are slower than queries
    refetchInterval: 30_000,
  });
}

export function useMyClaimHistory() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<ClaimRecord[]>({
    queryKey: ["myClaimHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyClaimHistory();
    },
    enabled: !!actor && !isFetching,
    // Poll every 8s so pending/pendingFee claims update without manual refresh.
    // Stops being expensive once all claims are settled (verified/failed).
    refetchInterval: 8_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
}

export function useAllClaimHistory() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<ClaimRecord[]>({
    queryKey: ["allClaimHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClaimHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitiateClaim() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      txHash: string;
      feeTxHash: string;
      tokenAddress: string;
      chain: string;
      frontendPrice: number;
    }) => {
      if (!actor) throw new Error("Not connected to ICP");
      const result = await actor.initiateClaim(
        args.txHash,
        args.feeTxHash,
        args.chain,
        args.tokenAddress,
        args.frontendPrice,
      );
      if (result.__kind__ === "err") {
        // PENDING means the TX was submitted but verification is deferred —
        // the 60-second backend timer will recheck and settle the claim.
        // Treat this as a success so the UI enters pending_verification state.
        if (result.err === "PENDING") return result;
        throw new Error(result.err);
      }
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBalance"] });
      qc.invalidateQueries({ queryKey: ["myClaimHistory"] });
    },
  });
}

export function useRetryFeeClaim() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { txHash: string; feeTxHash: string }) => {
      if (!actor) throw new Error("Not connected to ICP");
      const result = await (
        actor as unknown as Record<
          string,
          (
            t: string,
            f: string,
          ) => Promise<{ __kind__: string; ok?: bigint; err?: string }>
        >
      ).retryFeeClaim(args.txHash, args.feeTxHash);
      if (result.__kind__ === "err") {
        throw new Error(result.err ?? "Unknown error");
      }
      return result.ok ?? BigInt(0);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBalance"] });
      qc.invalidateQueries({ queryKey: ["myClaimHistory"] });
      qc.refetchQueries({ queryKey: ["myBalance"] });
    },
  });
}

export function useRecheckClaim() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (txHash: string) => {
      if (!actor) throw new Error("Not connected to ICP");
      const result = await (
        actor as unknown as Record<
          string,
          (
            t: string,
          ) => Promise<{ __kind__: string; ok?: string; err?: string }>
        >
      ).recheckClaimByHash(txHash);
      if (result.__kind__ === "err") {
        throw new Error(result.err ?? "Unknown error");
      }
      return result.ok ?? "";
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBalance"] });
      qc.invalidateQueries({ queryKey: ["myClaimHistory"] });
      qc.refetchQueries({ queryKey: ["myBalance"] });
    },
    onError: (err: Error) => {
      console.error("Re-check claim error:", err.message);
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActorInstance();
  const { principal } = useAuth();
  return useQuery<boolean>({
    queryKey: ["isAdmin", principal],
    queryFn: async () => {
      if (!actor || !principal) return false;
      const admins = await actor.getAdmins();
      return admins.some((p) => p.toText() === principal);
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 5_000,
    refetchOnMount: true,
  });
}

export function useGetAdmin() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<string | null>({
    queryKey: ["getAdmin"],
    queryFn: async () => {
      if (!actor) return null;
      const admins = await actor.getAdmins();
      return admins.length > 0 ? admins[0].toText() : null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 5_000,
    refetchOnMount: true,
  });
}

// NOTE: useBootstrapAdmin / useResetAndClaimAdmin removed together with their
// backend endpoints. Admin identity is seeded at canister start from main.mo.

export function useSetAdmin() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error("Not connected");
      // Legacy single-admin transfer: add the new admin
      return actor.addAdmin(Principal.fromText(principalText));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admins"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
export function useGetAdmins() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<string[]>({
    queryKey: ["admins"],
    queryFn: async () => {
      if (!actor) return [];
      const admins = await actor.getAdmins();
      return admins.map((p) => p.toText());
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchOnMount: true,
  });
}

export function useAddAdmin() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAdmin(Principal.fromText(principalText));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admins"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeAdmin(Principal.fromText(principalText));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admins"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

// ─── Fee Recipient ────────────────────────────────────────────────────────────

export function useGetFeeRecipient() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<string | null>({
    queryKey: ["feeRecipient"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFeeRecipient();
    },
    enabled: !!actor && !isFetching,
    staleTime: 8_000,
    refetchOnMount: true,
  });
}

export function useSetFeeRecipient() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (address: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setFeeRecipient(address);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feeRecipient"] }),
  });
}
export function useGetFeePercent() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<number>({
    queryKey: ["feePercent"],
    queryFn: async () => {
      if (!actor) return 0.69;
      return actor.getFeePercent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 8_000,
    refetchOnMount: true,
  });
}

export function useSetFeePercent() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (percent: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.setFeePercent(percent);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feePercent"] }),
  });
}
// ─── Miner Creation Fees ─────────────────────────────────────────────────────

export function useGetMinerCreationFees() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<ChainFeeEntry[]>({
    queryKey: ["minerCreationFees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMinerCreationFees();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetMinerCreationFee() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chain,
      feeWei,
    }: { chain: string; feeWei: bigint }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setMinerCreationFee(chain, feeWei);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["minerCreationFees"] }),
  });
}

// ─── Mining ─────────────────────────────────────────────────────────────────

// ─── Block Details ───────────────────────────────────────────────────────────

export interface BlockDetailView {
  blockNumber: bigint;
  winnerPrincipal: Principal | null;
  winnerMinerId: bigint | null;
  minerParticipants: Array<[bigint, Principal]>;
  totalGritSpent: bigint;
  minerCount: bigint;
  minerGritSpent: Array<[bigint, bigint]>;
  minerWeights: Array<[bigint, number]>;
  vrfValue: bigint;
  akkReward: bigint;
  timestamp: bigint;
}

export function useBlockDetails(blockNumber: bigint | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<BlockDetailView | null>({
    queryKey: ["blockDetails", blockNumber?.toString()],
    queryFn: async () => {
      if (!actor || blockNumber === null) return null;
      const raw = await actor.getBlockDetails(blockNumber);
      if (!raw) return null;
      return {
        blockNumber: raw.blockNumber,
        winnerPrincipal: raw.winnerPrincipal ?? null,
        winnerMinerId: raw.winnerMinerId ?? null,
        minerParticipants: raw.minerParticipants,
        totalGritSpent: raw.totalGritSpent,
        minerCount: raw.minerCount,
        minerGritSpent: raw.minerGritSpent,
        minerWeights: raw.minerWeights,
        vrfValue: raw.vrfValue,
        akkReward: raw.akkReward,
        timestamp: raw.timestamp,
      } satisfies BlockDetailView;
    },
    enabled: !!actor && !isFetching && blockNumber !== null,
    staleTime: 60_000,
  });
}

/** Alias kept for backward compatibility with CreateMinerModal */
export const useMinerCreationFees = useGetMinerCreationFees;

export function useMyMiners() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<MinerView[]>({
    queryKey: ["myMiners"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMiners();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useCurrentBlockInfo() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    nextBlockIn: bigint;
    blockNumber: bigint;
    lastBlockTime: bigint;
    isMiningActive: boolean;
  }>({
    queryKey: ["currentBlockInfo"],
    queryFn: async () => {
      if (!actor)
        return {
          nextBlockIn: 690n,
          blockNumber: 0n,
          lastBlockTime: 0n,
          isMiningActive: false,
        };
      return actor.getCurrentBlockInfo();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

export function useBlockHistory(limit: bigint) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<BlockRecord[]>({
    queryKey: ["blockHistory", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockHistory(limit);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useCreateMiner() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      gritAmount: bigint;
      rate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createMiner(args.name, args.gritAmount, args.rate);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myMiners"] });
      qc.invalidateQueries({ queryKey: ["myBalance"] });
    },
  });
}

export function useEditMiner() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      minerId: bigint;
      nameChange: string | null;
      topUp: bigint | null;
      rateChange: bigint | null;
      pause: boolean | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.editMiner(
        args.minerId,
        args.nameChange,
        args.topUp,
        args.rateChange,
        args.pause,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myMiners"] });
      qc.invalidateQueries({ queryKey: ["myBalance"] });
    },
  });
}

export function useUserMiningStats() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{ blocksMined: bigint; akkWon: bigint; gritSpent: bigint }>({
    queryKey: ["userMiningStats"],
    queryFn: async () => {
      if (!actor) return { blocksMined: 0n, akkWon: 0n, gritSpent: 0n };
      return actor.getUserMiningStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

// ─── GRIT Issuance Rate ─────────────────────────────────────────────────────

export function useGetGritIssuanceRate() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<bigint>({
    queryKey: ["getGritIssuanceRate"],
    queryFn: async () => {
      if (!actor) return BigInt(1_000_000_000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (
        actor as unknown as Record<string, () => Promise<bigint>>
      ).getGritIssuanceRate();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetGritIssuanceRate() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rate: bigint) => {
      if (!actor) throw new Error("Not connected");
      // setGritIssuanceRate returns Promise<void> — success = no throw
      await (
        actor as unknown as Record<string, (r: bigint) => Promise<void>>
      ).setGritIssuanceRate(rate);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["getGritIssuanceRate"] }),
  });
}

// ─── Block History Pagination ───────────────────────────────────────────────

export function useGetBlockHistoryPage(page: bigint, pageSize: bigint) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<BlockRecord[]>({
    queryKey: ["blockHistoryPage", page.toString(), pageSize.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockHistoryPage(page, pageSize);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetTotalBlockCount() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<bigint>({
    queryKey: ["totalBlockCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTotalBlockCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── AKK Transfer Fee ─────────────────────────────────────────────────────────

export function useGetAkkTransferFee() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<bigint>({
    queryKey: ["akkTransferFee"],
    queryFn: async () => {
      if (!actor) return 10000n;
      return actor.getAkkTransferFee();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetAkkTransferFee() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fee: bigint) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<string, (f: bigint) => Promise<void>>
      ).setAkkTransferFee(fee);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["akkTransferFee"] });
    },
  });
}

// ─── Launch Gate ────────────────────────────────────────────────────────────

export function useGetLaunchGate() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{ enabled: boolean; startTime: bigint; endTime: bigint }>({
    queryKey: ["launchGate"],
    queryFn: async () => {
      if (!actor)
        return { enabled: false, startTime: BigInt(0), endTime: BigInt(0) };
      return (
        actor as unknown as Record<
          string,
          () => Promise<{
            enabled: boolean;
            startTime: bigint;
            endTime: bigint;
          }>
        >
      ).getLaunchGate();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetLaunchGate() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      enabled: boolean;
      startTime: bigint;
      endTime: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<
          string,
          (e: boolean, s: bigint, en: bigint) => Promise<void>
        >
      ).setLaunchGate(args.enabled, args.startTime, args.endTime);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["launchGate"] }),
  });
}

export interface LaunchGateConfig {
  startTime: bigint;
  endTime: bigint;
  nftGateEnabled: boolean;
  launchTime: bigint;
  timeWindowEnabled: boolean;
  launchTimeEnabled: boolean;
}

export function useGetLaunchGateConfig() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<LaunchGateConfig>({
    queryKey: ["launchGateConfig"],
    queryFn: async () => {
      if (!actor)
        return {
          startTime: 0n,
          endTime: 0n,
          nftGateEnabled: false,
          launchTime: 0n,
          timeWindowEnabled: false,
          launchTimeEnabled: false,
        };
      return (
        actor as unknown as Record<string, () => Promise<LaunchGateConfig>>
      ).getLaunchGateConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetLaunchTimeGate() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { enabled: boolean; launchTime: bigint }) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<
          string,
          (e: boolean, t: bigint) => Promise<void>
        >
      ).setLaunchTimeGate(args.enabled, args.launchTime);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["launchGateConfig"] }),
  });
}

export function useSetNftGate() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<string, (e: boolean) => Promise<void>>
      ).setNftGate(enabled);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["launchGateConfig"] }),
  });
}

// ─── Profile Types ──────────────────────────────────────────────────────────

export interface SocialLink {
  name: string;
  url: string;
  id?: string;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function useGetMyProfile() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    username: string;
    displayName: string;
    bio: string;
    location: string;
    born: string;
    superpowers: string;
    profilePicture: string;
    coverImage: string;
    evmAddress: string | null;
    hasOgBadge: boolean;
    playerBadgeLevel: bigint;
    socials: SocialLink[];
  } | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await actor.getMyProfile();
      if (!raw) return null;
      const p = raw as unknown as Record<string, unknown>;
      return {
        username: (p.username as string) ?? "",
        displayName: (p.displayName as string) ?? "",
        bio: (p.bio as string) ?? "",
        location: (p.location as string) ?? "",
        born: (p.born as string) ?? "",
        superpowers: (p.superpowers as string) ?? "",
        profilePicture: (p.profilePicture as string) ?? "",
        coverImage: (p.coverImage as string) ?? "",
        evmAddress: (p.evmAddress as string | null | undefined) ?? null,
        hasOgBadge: (p.hasOgBadge as boolean) ?? false,
        playerBadgeLevel: (p.playerBadgeLevel as bigint) ?? 0n,
        socials: Array.isArray(p.socials)
          ? (p.socials as SocialLink[]).map((s, idx) => ({
              ...s,
              id: `social-${idx}`,
            }))
          : [],
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useSaveMyProfile() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      username: string;
      displayName: string;
      bio: string;
      location: string;
      born: string;
      superpowers: string;
      profilePicture: string;
      coverImage: string;
      evmAddress: string | null;
      socials: SocialLink[];
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.saveMyProfile({
        ...input,
        username: input.username.trim(),
      } as unknown as ProfileInput);
      if (result.__kind__ === "err") {
        const code = result.err;
        const error = new Error(profileErrorMessage(code)) as Error & {
          profileError: ProfileError | string;
        };
        error.profileError = code;
        throw error;
      }
      return result.ok;
    },
    onSuccess: (saved) => {
      // Optimistic cache update: write the saved profile (returned by the
      // backend) into the ['myProfile'] cache immediately so the UI reflects
      // the save without waiting for a query refetch that could hit a stale
      // replica (read-after-write replica lag). Then invalidate so a
      // background refetch eventually reconciles with canonical state.
      const p = saved as unknown as Record<string, unknown>;
      const normalized = {
        username: (p.username as string) ?? "",
        displayName: (p.displayName as string) ?? "",
        bio: (p.bio as string) ?? "",
        location: (p.location as string) ?? "",
        born: (p.born as string) ?? "",
        superpowers: (p.superpowers as string) ?? "",
        profilePicture: (p.profilePicture as string) ?? "",
        coverImage: (p.coverImage as string) ?? "",
        evmAddress: (p.evmAddress as string | null | undefined) ?? null,
        hasOgBadge: (p.hasOgBadge as boolean) ?? false,
        playerBadgeLevel: (p.playerBadgeLevel as bigint) ?? 0n,
        socials: Array.isArray(p.socials)
          ? (p.socials as SocialLink[]).map((s, idx) => ({
              ...s,
              id: `social-${idx}`,
            }))
          : [],
      };
      qc.setQueryData(["myProfile"], normalized);
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ─── Tribes ─────────────────────────────────────────────────────────────────

export function useGetTribe(tribeId: string | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Tribe | null>({
    queryKey: ["tribe", tribeId],
    queryFn: async () => {
      if (!actor || !tribeId) return null;
      return actor.getTribe(tribeId);
    },
    enabled: !!actor && !isFetching && !!tribeId,
    staleTime: 30_000,
  });
}

// ─── Live Price ──────────────────────────────────────────────────────────────

export type LivePriceResult =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; priceUSD: number };

// ─── Tribes ──────────────────────────────────────────────────────────────────

export function useGetTribeMembers(tribeId: TribeId | null) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<string[]>({
    queryKey: ["tribeMembers", tribeId],
    queryFn: async () => {
      if (!actor || !tribeId) return [];
      return actor.getTribeMembers(tribeId);
    },
    enabled: !!actor && !isFetching && !!tribeId,
    staleTime: 30_000,
  });
}

export function useGetMyTribe() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Tribe | null>({
    queryKey: ["myTribe"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyTribe();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useGetTribeLeaderboard(timescale = "alltime") {
  const { actor, isFetching } = useActorInstance();
  return useQuery({
    queryKey: ["tribeLeaderboard", timescale],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getTopTribes(timescale);
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useGetMyOwnedTribes() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Tribe[]>({
    queryKey: ["myOwnedTribes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOwnedTribes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useSearchTribes(searchQuery: string) {
  const { actor, isFetching } = useActorInstance();
  return useQuery<Tribe[]>({
    queryKey: ["searchTribes", searchQuery],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchTribes(searchQuery);
    },
    enabled: !!actor && !isFetching && searchQuery.length >= 2,
    staleTime: 10_000,
  });
}

export function useCreateTribe() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      description: string;
      photoUrl: string | null;
      coverImageUrl: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createTribe(
        args.name,
        args.description,
        args.photoUrl,
        args.coverImageUrl,
      );
      if (result.__kind__ === "err")
        throw new Error(result.err as unknown as string);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myOwnedTribes"] });
      qc.invalidateQueries({ queryKey: ["myTribe"] });
    },
  });
}

export function useJoinTribe() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tribeId: TribeId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinTribe(tribeId);
      if (result.__kind__ === "err")
        throw new Error(result.err as unknown as string);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myTribe"] });
      qc.invalidateQueries({ queryKey: ["searchTribes"] });
    },
  });
}

export function useLeaveTribe() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.leaveTribe();
      if (result.__kind__ === "err")
        throw new Error(result.err as unknown as string);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myTribe"] });
      qc.invalidateQueries({ queryKey: ["myOwnedTribes"] });
    },
  });
}

export function useEditTribe() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      tribeId: TribeId;
      name: string | null;
      description: string | null;
      photoUrl: string | null;
      coverImageUrl: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.editTribe(
        args.tribeId,
        args.name,
        args.description,
        args.photoUrl,
        args.coverImageUrl,
      );
      if (result.__kind__ === "err")
        throw new Error(result.err as unknown as string);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myOwnedTribes"] });
      qc.invalidateQueries({ queryKey: ["myTribe"] });
    },
  });
}

export function useTransferTribeOwnership() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      tribeId: TribeId;
      newOwnerUsername: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.transferTribeOwnership(
        args.tribeId,
        args.newOwnerUsername,
      );
      if (result.__kind__ === "err")
        throw new Error(result.err as unknown as string);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myOwnedTribes"] });
      qc.invalidateQueries({ queryKey: ["myTribe"] });
    },
  });
}

// Re-export TribeError as a type alias for consumers that only need the type
export { TribeError };

export function useClaimOgBadge() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.claimOgBadge();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      qc.refetchQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useUpdatePlayerBadge() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updatePlayerBadge();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ─── Protocol Stats ───────────────────────────────────────────────────────────

export function useProtocolStats() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    currentBlock: bigint;
    nextBlockIn: bigint;
    blockReward: bigint;
    totalAkkMined: bigint;
    activeMiners: bigint;
    totalMiners: bigint;
    totalGritSpent: bigint;
    isMiningActive: boolean;
  }>({
    queryKey: ["protocolStats"],
    queryFn: async () => {
      if (!actor)
        return {
          currentBlock: 0n,
          nextBlockIn: 0n,
          blockReward: 0n,
          totalAkkMined: 0n,
          activeMiners: 0n,
          totalMiners: 0n,
          totalGritSpent: 0n,
          isMiningActive: false,
        };
      return actor.getProtocolStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useProtocolBurnSummary() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    totalBurnUsd: number;
    totalGritFromBurns: bigint;
    byToken: Array<[string, number, number]>;
  }>({
    queryKey: ["protocolBurnSummary"],
    queryFn: async () => {
      if (!actor)
        return { totalBurnUsd: 0, totalGritFromBurns: 0n, byToken: [] };
      const raw = await actor.getProtocolBurnSummary();
      return {
        totalBurnUsd: raw.totalBurnUsd,
        totalGritFromBurns: BigInt(raw.totalGritFromBurns),
        byToken: raw.byToken as unknown as Array<[string, number, number]>,
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
}

export function useLiveTokenPrice(tokenAddress: string | null) {
  return useQuery<number | null>({
    queryKey: ["livePrice", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      const price = await fetchDexScreenerPrice(tokenAddress);
      // Return null instead of throwing — callers treat null as "unavailable"
      // and disable the burn button; they should never see a query error.
      return price;
    },
    enabled: !!tokenAddress,
    staleTime: 30_000,
    retry: 2,
    gcTime: 60_000,
  });
}
// ─── AKK Ledger Canister ID ───────────────────────────────────────────────────

export function useGetAkkLedgerCanisterId() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<string | null>({
    queryKey: ["akkLedgerCanisterId"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getAkkLedgerCanisterId();
      if (result === null || result === undefined) return null;
      // result is Principal | null from backend
      const principal = result as Principal | null;
      return principal ? principal.toText() : null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── Launch State ─────────────────────────────────────────────────────────────

export function useGetIsLaunched() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<boolean>({
    queryKey: ["isLaunched"],
    queryFn: async () => {
      if (!actor) return false;
      return (
        actor as unknown as { getIsLaunched: () => Promise<boolean> }
      ).getIsLaunched();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSetLaunched() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as {
          setLaunched: () => Promise<{ ok: null } | { err: string }>;
        }
      ).setLaunched();
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isLaunched"] });
      qc.invalidateQueries({ queryKey: ["gritIssuanceRate"] });
    },
  });
}

// ─── Mint Retry Queue ───────────────────────────────────────────────────────

export function useGetPendingMints() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<MintRetryView[]>({
    queryKey: ["pendingMints"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingMints();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useGetAbandonedMints() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<MintRetryView[]>({
    queryKey: ["abandonedMints"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAbandonedMints();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useGetMintRetryStats() {
  const { actor, isFetching } = useActorInstance();
  return useQuery<{
    queueDepth: bigint;
    totalRetried: bigint;
    totalSucceeded: bigint;
    totalAbandoned: bigint;
  }>({
    queryKey: ["mintRetryStats"],
    queryFn: async () => {
      if (!actor)
        return {
          queueDepth: 0n,
          totalRetried: 0n,
          totalSucceeded: 0n,
          totalAbandoned: 0n,
        };
      return actor.getMintRetryStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useRetryMint() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (blockId: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.retryMint(blockId);
      if (result.__kind__ === "Err") throw new Error(result.Err);
      return result.Ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingMints"] });
      qc.invalidateQueries({ queryKey: ["abandonedMints"] });
      qc.invalidateQueries({ queryKey: ["mintRetryStats"] });
    },
  });
}

export function useSetAkkLedgerCanisterId() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (canisterId: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setAkkLedgerCanisterId(
        Principal.fromText(canisterId),
      );
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["akkLedgerCanisterId"] });
    },
  });
}

export function useCreditAbandonedMints() {
  const { actor } = useActorInstance();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.creditAbandonedMints();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["abandonedMints"] });
      qc.invalidateQueries({ queryKey: ["mintRetryStats"] });
      qc.invalidateQueries({ queryKey: ["pendingMints"] });
      qc.invalidateQueries({ queryKey: ["protocolStats"] });
    },
  });
}
