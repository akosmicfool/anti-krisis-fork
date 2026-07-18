import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";

function useActorInstance() {
  return useActor(createActor);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlayerScoreEntry {
  principal: string;
  displayName: string;
  username: string;
  profilePicture: string;
  tribeName: string;
  tribeId: string | null;
  gritSpent: bigint;
  akkWon: bigint;
  score: number;
}

export interface TribeScoreEntry {
  tribeId: string;
  tribeName: string;
  memberCount: number;
  photoUrl: string;
  gritSpent: bigint;
  akkWon: bigint;
  score: number;
}

export type Timescale =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "all-time";

// Map frontend timescale values to the backend's expected string literals.
// The backend uses "alltime" while the frontend uses "all-time" for display.
function toBackendTimescale(timescale: Timescale): string {
  return timescale === "all-time" ? "alltime" : timescale;
}

// ─── useTopPlayers ────────────────────────────────────────────────────────────

export function useTopPlayers(timescale: Timescale) {
  const { actor, isFetching } = useActorInstance();

  return useQuery<PlayerScoreEntry[]>({
    queryKey: ["topPlayers", timescale],
    queryFn: async () => {
      if (!actor) return [];

      const backendTimescale = toBackendTimescale(timescale);
      const raw = await actor.getTopPlayers(backendTimescale);

      const entries: PlayerScoreEntry[] = [];
      for (const e of raw) {
        const username = e.username?.trim() ?? "";
        const displayName = e.displayName?.trim() ?? "";
        if (!username) continue;

        const resolvedDisplay = displayName || username;

        let profilePicture = "";
        try {
          const profile = await actor.getProfileByUsername(username);
          profilePicture = profile?.profilePicture ?? "";
        } catch {
          // ignore — avatar will fall back to initials
        }

        entries.push({
          principal: e.principal.toText(),
          displayName: resolvedDisplay,
          username,
          profilePicture,
          tribeName: e.tribeName?.trim() || "Solo",
          tribeId: e.tribeId ?? null,
          gritSpent: 0n,
          akkWon: 0n,
          score: e.score,
        });
      }

      // Sort descending so rank 1 = highest score regardless of backend order
      entries.sort((a, b) => b.score - a.score);
      return entries.slice(0, 9);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
    staleTime: 5_000,
  });
}

// ─── useTopTribes ─────────────────────────────────────────────────────────────

export function useTopTribes(timescale: Timescale) {
  const { actor, isFetching } = useActorInstance();

  return useQuery<TribeScoreEntry[]>({
    queryKey: ["topTribes", timescale],
    queryFn: async () => {
      if (!actor) return [];

      const backendTimescale = toBackendTimescale(timescale);
      const raw = await actor.getTopTribes(backendTimescale);

      const entries: TribeScoreEntry[] = [];
      for (const e of raw) {
        if (Number(e.memberCount) < 2) continue;

        let photoUrl = "";
        try {
          const tribe = await actor.getTribe(e.tribeId);
          photoUrl = tribe?.photoUrl ?? "";
        } catch {
          // ignore — photo will fall back to placeholder
        }

        entries.push({
          tribeId: e.tribeId,
          tribeName: e.tribeName,
          memberCount: Number(e.memberCount),
          photoUrl,
          gritSpent: 0n,
          akkWon: 0n,
          score: e.score,
        });
      }

      // Sort descending so rank 1 = highest score regardless of backend order
      entries.sort((a, b) => b.score - a.score);
      return entries.slice(0, 6);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
    staleTime: 5_000,
  });
}

// ─── usePlayerRank ────────────────────────────────────────────────────────────

export function usePlayerRank(
  principal: Principal | undefined,
  timescale: string,
) {
  const { actor, isFetching } = useActorInstance();

  return useQuery<bigint | null>({
    queryKey: ["playerRank", principal?.toText(), timescale],
    queryFn: async () => {
      if (!actor || !principal) return null;
      const rank = await actor.getPlayerRank(principal, timescale);
      return rank;
    },
    enabled: !!actor && !isFetching && !!principal,
    refetchInterval: 30_000,
    staleTime: 5_000,
  });
}

// ─── usePlayerScore ───────────────────────────────────────────────────────────

export function usePlayerScore(
  principal: Principal | undefined,
  timescale: string,
) {
  const { actor, isFetching } = useActorInstance();

  return useQuery<number | null>({
    queryKey: ["playerScore", principal?.toText(), timescale],
    queryFn: async () => {
      if (!actor || !principal) return null;
      const score = await actor.getPlayerScore(principal, timescale);
      return score;
    },
    enabled: !!actor && !isFetching && !!principal,
    refetchInterval: 30_000,
    staleTime: 5_000,
  });
}
