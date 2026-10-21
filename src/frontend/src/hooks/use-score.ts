import { useActor } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
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
  /** Text form of the tribe owner's principal, used by the TOP LEADER badge. */
  ownerId: string;
  gritSpent: bigint;
  akkWon: bigint;
  score: number;
}

export type Timescale =
  | "daily"
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

// ─── usePlayerRankAndScore ───────────────────────────────────────────────────

/**
 * Per-player all-time rank + score for the profile RANK / SKORE tiles.
 * Per-method cache keys ("playerRank" / "playerScore") per the cache policy in
 * use-backend.ts; the all-time cadence matches useTopTribesAlltime (15s stale /
 * 30s poll) so the tiles track the Skoreboard's clock. Works for EVERY player,
 * not just the top-9 leaderboard window.
 */
export function usePlayerRankAndScore(principal?: Principal) {
  const { actor, isFetching } = useActorInstance();
  const key = principal?.toText();

  const rankQuery = useQuery<bigint | null>({
    queryKey: ["playerRank", key],
    queryFn: async () => {
      if (!actor || !principal) return null;
      // SINGLE SOURCE OF TRUTH: derive the rank from the exact ordering the
      // Skoreboard displays (getTopPlayers sorted by score descending, rank =
      // position). The backend's getPlayerRank ranked a wider population in the
      // wrong order, so profile and Skoreboard disagreed (e.g. board #1 showed
      // #5 on the profile). Only players outside the top-players window fall
      // back to getPlayerRank — they are not on the board, so nothing can
      // contradict them.
      const raw = await actor.getTopPlayers("alltime");
      const sorted = [...raw].sort((a, b) => b.score - a.score);
      const idx = sorted.findIndex((e) => e.principal.toText() === key);
      if (idx >= 0) return BigInt(idx + 1);
      return actor.getPlayerRank(principal, "alltime");
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const scoreQuery = useQuery<number>({
    queryKey: ["playerScore", key, "alltime"],
    queryFn: async () => {
      if (!actor || !principal) return 0;
      return actor.getPlayerScore(principal, "alltime");
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  return { rank: rankQuery.data ?? null, score: scoreQuery.data ?? 0 };
}

// ─── useMyAk69Score ─────────────────────────────────────────────────────────

/**
 * The signed-in player's own all-time AK69 score for the wallet surfaces
 * (header wallet chip + the Wallets & Balances ICP row). Shares the per-method
 * "playerScore" cache key with usePlayerRankAndScore's score query, so wallet
 * and profile surfaces can never show different numbers for the same player.
 */
export function useMyAk69Score(principalText?: string | null) {
  const { actor, isFetching } = useActorInstance();
  const key = principalText ?? undefined;

  return useQuery<number>({
    queryKey: ["playerScore", key, "alltime"],
    queryFn: async () => {
      if (!actor || !principalText) return 0;
      return actor.getPlayerScore(Principal.fromText(principalText), "alltime");
    },
    enabled: !!actor && !isFetching && !!principalText,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

// ─── useTopTribes ─────────────────────────────────────────────────────────────

/**
 * THE shared cache for getTopTribes("alltime") — key ["topTribes","alltime"],
 * staleTime 15s, poll 30s. Every surface that shows or derives from the
 * all-time tribe leaderboard (Skoreboard, TOP LEADER badge, tribe page) must
 * go through this hook (see the cache policy note in use-backend.ts) so the
 * surfaces can never disagree with each other.
 */
export function useTopTribesAlltime() {
  return useTopTribes("all-time");
}

export function useTopTribes(timescale: Timescale) {
  const { actor, isFetching } = useActorInstance();
  const isAllTime = timescale === "all-time";

  return useQuery<TribeScoreEntry[]>({
    queryKey: ["topTribes", toBackendTimescale(timescale)],
    queryFn: async () => {
      if (!actor) return [];

      const backendTimescale = toBackendTimescale(timescale);
      const raw = await actor.getTopTribes(backendTimescale);

      const entries: TribeScoreEntry[] = [];
      for (const e of raw) {
        if (Number(e.memberCount) < 2) continue;

        let photoUrl = "";
        let ownerId = "";
        try {
          const tribe = await actor.getTribe(e.tribeId);
          photoUrl = tribe?.photoUrl ?? "";
          ownerId = tribe?.ownerId.toText() ?? "";
        } catch {
          // ignore — photo falls back to placeholder and the owner check
          // simply never matches this entry
        }

        entries.push({
          tribeId: e.tribeId,
          tribeName: e.tribeName,
          memberCount: Number(e.memberCount),
          photoUrl,
          ownerId,
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
    // All-time is the shared leaderboard: 15s stale / 30s poll. The shorter
    // timescales keep their original 5s / 15s policy.
    staleTime: isAllTime ? 15_000 : 5_000,
    refetchInterval: isAllTime ? 30_000 : 15_000,
  });
}
