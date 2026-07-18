import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const TOKEN_COLORS = [
  "#00ff41",
  "#00e5ff",
  "#ff00ff",
  "#ffb700",
  "#ff3131",
  "#7fff00",
  "#ff6b35",
  "#a855f7",
  "#06b6d4",
  "#f59e0b",
];

export interface TokenData {
  symbol: string;
  usdValue: number;
  color: string;
  percentage: number;
  cells: number;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface HighlightsSectionProps {
  type: "player" | "tribe";
  principal?: Principal;
  tribeId?: string;
  hasOgBadge?: boolean;
  canClaimBadge?: boolean;
  onClaimBadge?: () => Promise<void>;
  playerBadgeLevel?: number;
}

// ─── Top Tribe Leader badge hook ─────────────────────────────────────────────

/**
 * Returns true if the given principal is the owner of ANY tribe in the
 * all-time top-6 tribes leaderboard. Refreshes every 60 seconds.
 */
function useTopTribeBadge(profileOwnerPrincipal?: Principal): boolean {
  const { actor, isFetching } = useActor(createActor);

  const { data } = useQuery<boolean>({
    queryKey: ["topTribeBadge", profileOwnerPrincipal?.toText()],
    queryFn: async (): Promise<boolean> => {
      if (!actor || !profileOwnerPrincipal) return false;

      // Fetch the all-time top tribes (capped at 6 by backend)
      const topTribes = await actor.getTopTribes("alltime");
      if (!topTribes || topTribes.length === 0) return false;

      const ownerText = profileOwnerPrincipal.toText();

      // TribeScoreEntry doesn't include ownerId — fetch each tribe in parallel
      const tribeDetails = await Promise.all(
        topTribes.map((entry) => actor.getTribe(entry.tribeId)),
      );

      return tribeDetails.some(
        (tribe) => tribe && tribe.ownerId.toText() === ownerText,
      );
    },
    enabled: !!actor && !isFetching && !!profileOwnerPrincipal,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  return data === true;
}

// ─── Waffle grid helpers ──────────────────────────────────────────────────────

export function buildTokenData(
  raw: Array<[string, number]>,
  gridSize: number,
): TokenData[] {
  const total = raw.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return [];

  // Sort descending by value
  const sorted = [...raw].sort((a, b) => b[1] - a[1]);
  const totalCells = gridSize * gridSize;

  let allocated = 0;
  const tokens: TokenData[] = sorted.map(([symbol, usdValue], i) => {
    const pct = (usdValue / total) * 100;
    const cells = Math.round((usdValue / total) * totalCells);
    allocated += cells;
    return {
      symbol,
      usdValue,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      percentage: pct,
      cells,
    };
  });

  // Adjust rounding so total == gridSize²
  const diff = totalCells - allocated;
  if (tokens.length > 0) tokens[0].cells += diff;

  return tokens;
}

export function WaffleGrid({
  tokens,
  gridSize,
  cellSize,
  gap,
  onCellHover,
}: {
  tokens: TokenData[];
  gridSize: number;
  cellSize: number;
  gap: number;
  onCellHover?: (token: TokenData | null) => void;
}) {
  const [hoveredToken, setHoveredToken] = useState<TokenData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const cells: { color: string; tokenIndex: number }[] = [];
  for (let ti = 0; ti < tokens.length; ti++) {
    const t = tokens[ti];
    for (let c = 0; c < t.cells; c++) {
      cells.push({ color: t.color, tokenIndex: ti });
    }
  }
  // Pad to full grid
  while (cells.length < gridSize * gridSize)
    cells.push({ color: "#111", tokenIndex: -1 });

  const totalSize = gridSize * cellSize + (gridSize - 1) * gap;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
          gap: `${gap}px`,
          width: totalSize,
          height: totalSize,
          flexShrink: 0,
        }}
      >
        {cells.map((cell, i) => {
          const token = cell.tokenIndex >= 0 ? tokens[cell.tokenIndex] : null;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: stable grid index
              key={i}
              onMouseEnter={(e) => {
                setHoveredToken(token);
                setTooltipPos({ x: e.clientX, y: e.clientY });
                onCellHover?.(token);
              }}
              onMouseMove={(e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => {
                setHoveredToken(null);
                setTooltipPos(null);
                onCellHover?.(null);
              }}
              style={{
                width: cellSize,
                height: cellSize,
                background: cell.color,
                opacity: cell.color === "#111" ? 0.18 : 0.9,
                cursor: token ? "crosshair" : "default",
              }}
            />
          );
        })}
      </div>
      {/* Floating tooltip */}
      {hoveredToken && tooltipPos && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 36,
            zIndex: 9999,
            background: "#0a0a0a",
            border: `1px solid ${hoveredToken.color}`,
            padding: "4px 8px",
            pointerEvents: "none",
            boxShadow: `0 0 8px ${hoveredToken.color}40`,
            whiteSpace: "nowrap",
          }}
        >
          <span
            className="font-accent uppercase tracking-widest"
            style={{ fontSize: 12, color: hoveredToken.color }}
          >
            {hoveredToken.symbol}
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 11, color: "#fff", marginLeft: 6 }}
          >
            ~$
            {hoveredToken.usdValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}
          >
            ({hoveredToken.percentage.toFixed(1)}%)
          </span>
        </div>
      )}
    </div>
  );
}

export function CompactLegend({ tokens }: { tokens: TokenData[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {tokens.map((t) => (
        <div key={t.symbol} className="flex items-center gap-1.5">
          <div
            style={{
              width: 10,
              height: 10,
              background: t.color,
              flexShrink: 0,
            }}
          />
          <span
            className="font-accent text-xs uppercase tracking-widest"
            style={{ color: t.color }}
          >
            {t.symbol}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Badges Section ───────────────────────────────────────────────────────────

function BadgeCard({
  src,
  alt,
  label,
  ocid,
}: {
  src: string;
  alt: string;
  label: string;
  ocid: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-3 relative border border-border"
      style={{
        background: "#0a0a0a",
      }}
      data-ocid={ocid}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.02) 3px, rgba(0,255,65,0.02) 4px)",
        }}
      />
      <img
        src={src}
        alt={alt}
        style={{
          height: 72,
          width: "auto",
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      <span
        className="font-display uppercase tracking-widest"
        style={{
          fontSize: 16,
          color: "#00ff41",
          textShadow: "0 0 8px #00ff41",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function BadgesSection({
  hasOgBadge,
  canClaimBadge,
  onClaimBadge,
  playerBadgeLevel = 0,
  isTopTribeLeader = false,
}: {
  hasOgBadge: boolean;
  canClaimBadge?: boolean;
  onClaimBadge?: () => Promise<void>;
  playerBadgeLevel?: number;
  isTopTribeLeader?: boolean;
}) {
  // Determine player badge details
  const playerBadgeConfig =
    playerBadgeLevel === 3
      ? {
          src: "/assets/alpha_player-019e5115-e12b-7587-9c76-389717cb1b21.png",
          label: "ALPHA PLAYER",
        }
      : playerBadgeLevel === 2
        ? {
            src: "/assets/super_player-019e5115-e120-70a8-b19c-a300d6ae3eb7.png",
            label: "SUPER PLAYER",
          }
        : playerBadgeLevel === 1
          ? {
              src: "/assets/player-019e5115-e237-7466-973f-4d18f899e9c4.png",
              label: "PLAYER",
            }
          : null;

  // Nothing at all to show
  if (!hasOgBadge && !playerBadgeConfig && !canClaimBadge && !isTopTribeLeader)
    return null;

  return (
    <div data-ocid="highlights.badges_section">
      <div className="flex flex-wrap gap-3">
        {/* OG Holder badge */}
        {hasOgBadge && (
          <BadgeCard
            src="/assets/images/ak69-badge.png"
            alt="OG Holder badge"
            label="OG"
            ocid="highlights.badge_card.1"
          />
        )}

        {/* Player level badge (replaces lower tiers) */}
        {playerBadgeConfig && (
          <BadgeCard
            src={playerBadgeConfig.src}
            alt={`${playerBadgeConfig.label} badge`}
            label={playerBadgeConfig.label}
            ocid="highlights.badge_card.player"
          />
        )}

        {/* Top Tribe Leader badge — dynamic, no claim needed */}
        {isTopTribeLeader && (
          <BadgeCard
            src="/assets/tribe_leader.png"
            alt="Top Tribe Leader badge"
            label="TOP LEADER"
            ocid="highlights.badge_card.tribe_leader"
          />
        )}

        {/* Claimable OG badge (if not yet stored, but NFTs detected) */}
        {!hasOgBadge && canClaimBadge && onClaimBadge && (
          <ClaimableBadge onClaimBadge={onClaimBadge} />
        )}
      </div>
    </div>
  );
}

// ─── Claimable Badge sub-component ───────────────────────────────────────────

function ClaimableBadge({
  onClaimBadge,
}: { onClaimBadge: () => Promise<void> }) {
  const [claiming, setClaiming] = useState(false);

  async function handleClaim() {
    setClaiming(true);
    try {
      await onClaimBadge();
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-2 p-3 relative"
      style={{
        border: "1px solid #333",
        background: "#0a0a0a",
        opacity: 0.6,
      }}
      data-ocid="highlights.badge_card.1"
    >
      <img
        src="/assets/images/ak69-badge.png"
        alt="OG Holder badge"
        style={{
          height: 72,
          width: "auto",
          imageRendering: "pixelated",
          display: "block",
          filter: "grayscale(100%)",
        }}
      />
      <button
        type="button"
        onClick={handleClaim}
        disabled={claiming}
        className="font-accent text-sm uppercase tracking-widest px-3 py-1 border border-accent text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
        data-ocid="highlights.claim_badge_button"
      >
        {claiming ? "CLAIMING…" : "CLAIM BADGE"}
      </button>
    </div>
  );
}

// ─── Burn Waffle Card ─────────────────────────────────────────────────────────

function BurnWaffleCard({
  type,
  principal,
  tribeId,
}: {
  type: "player" | "tribe";
  principal?: Principal;
  tribeId?: string;
}) {
  const { actor, isFetching } = useActor(createActor);

  const { data: burnSummary, isLoading } = useQuery<Array<[string, number]>>({
    queryKey: [
      "burnSummary",
      type,
      type === "player" ? principal?.toText() : tribeId,
    ],
    queryFn: async () => {
      if (!actor) return [];
      if (type === "player" && principal) {
        return actor.getPlayerBurnSummary(principal);
      }
      if (type === "tribe" && tribeId) {
        return actor.getTribeBurnSummary(tribeId);
      }
      return [];
    },
    enabled:
      !!actor && !isFetching && (type === "player" ? !!principal : !!tribeId),
    staleTime: 60_000,
  });

  const tokens = burnSummary ? buildTokenData(burnSummary, 10) : [];
  const hasData = tokens.length > 0;

  return (
    <div
      className="flex flex-col gap-2 p-3 border border-border"
      style={{ background: "#0a0a0a" }}
      data-ocid="highlights.burn_waffle_card"
    >
      {isLoading || isFetching ? (
        /* Skeleton cells */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 16px)",
            gridTemplateRows: "repeat(10, 16px)",
            gap: "2px",
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton index
              key={i}
              className="animate-pulse"
              style={{ width: 16, height: 16, background: "#004d14" }}
            />
          ))}
        </div>
      ) : !hasData ? (
        <div
          className="flex items-center justify-center"
          style={{
            width: 10 * 16 + 9 * 2,
            height: 10 * 16 + 9 * 2,
            border: "1px solid #00ff41",
          }}
          data-ocid="highlights.burn_empty_state"
        >
          <span
            className="font-display tracking-widest"
            style={{ color: "#00ff41", fontSize: 18 }}
          >
            NO BURNS YET
          </span>
        </div>
      ) : (
        <div className="flex flex-row gap-3 items-start">
          <WaffleGrid tokens={tokens} gridSize={10} cellSize={16} gap={2} />
          <CompactLegend tokens={tokens} />
        </div>
      )}
    </div>
  );
}

// ─── HighlightsSection ────────────────────────────────────────────────────────

export function HighlightsSection({
  type,
  principal,
  tribeId,
  hasOgBadge,
  canClaimBadge,
  onClaimBadge,
  playerBadgeLevel,
}: HighlightsSectionProps) {
  // Top Tribe Leader badge — dynamically computed from leaderboard.
  // Only applies to player profiles (tribes can't own tribes).
  const isTopTribeLeader = useTopTribeBadge(
    type === "player" ? principal : undefined,
  );

  // Only render the badges wrapper when there is something to show.
  const showBadgesSection =
    hasOgBadge === true ||
    canClaimBadge === true ||
    (playerBadgeLevel ?? 0) > 0 ||
    isTopTribeLeader;

  return (
    <section className="my-3" data-ocid="highlights.section">
      {/* Cards in a horizontal row — each with its own header above */}
      <div className="flex flex-col sm:flex-row gap-3 items-start flex-wrap">
        {/* Burn allo waffle card */}
        <div className="w-full sm:flex-1 flex flex-col gap-1 min-w-0">
          <h3 className="font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-0">
            BURN ALLO
          </h3>
          <BurnWaffleCard type={type} principal={principal} tribeId={tribeId} />
        </div>

        {/* Badges — only rendered when there is at least one badge */}
        {showBadgesSection && (
          <div className="w-full sm:flex-1 flex flex-col gap-1 min-w-0">
            <span className="font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-0 block">
              BADGES
            </span>
            <div
              className="px-3 py-2 border border-border"
              style={{
                background: "#0a0a0a",
              }}
            >
              <BadgesSection
                hasOgBadge={hasOgBadge ?? false}
                canClaimBadge={canClaimBadge}
                onClaimBadge={onClaimBadge}
                playerBadgeLevel={playerBadgeLevel ?? 0}
                isTopTribeLeader={isTopTribeLeader}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
