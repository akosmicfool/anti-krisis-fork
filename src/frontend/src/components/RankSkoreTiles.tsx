import type { Principal } from "@icp-sdk/core/principal";
import { usePlayerRankAndScore } from "../hooks/use-score";
import { StatTile } from "./StatTile";

/**
 * RANK · SKORE tiles (all-time) for the player profile pages. Sits at the
 * right end of the BIO row: two tiles side by side on every screen size,
 * full-width pair on mobile.
 */
export function RankSkoreTiles({ principal }: { principal?: Principal }) {
  const { rank, score } = usePlayerRankAndScore(principal);
  return (
    <div
      className="flex flex-row gap-3 w-full sm:w-auto shrink-0"
      data-ocid="profile.rank_skore_tiles"
    >
      <StatTile
        className="flex-1 sm:flex-none sm:w-[132px]"
        label="RANK"
        value={rank !== null ? `#${rank}` : "—"}
        unit="All Time"
        valueColor="text-[#00ff41]"
      />
      <StatTile
        className="flex-1 sm:flex-none sm:w-[132px]"
        label="SKORE"
        value={score > 0 ? score.toFixed(2) : "—"}
        unit="All Time"
        valueColor="text-[#00ff41]"
      />
    </div>
  );
}
