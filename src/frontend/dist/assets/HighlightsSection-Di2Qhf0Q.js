import { j as jsxRuntimeExports, v as useActor, s as useQuery, r as reactExports, w as createActor } from "./index-D3Low12Q.js";
const TOKEN_COLORS = [
  "#00ff41",
  "#00e5ff",
  "#ff00ff",
  "#ffb700",
  "#ff3131",
  "#7fff00",
  "#ff6b35",
  "#a855f7",
  "#06b6d4",
  "#f59e0b"
];
function useTopTribeBadge(profileOwnerPrincipal) {
  const { actor, isFetching } = useActor(createActor);
  const { data } = useQuery({
    queryKey: ["topTribeBadge", profileOwnerPrincipal == null ? void 0 : profileOwnerPrincipal.toText()],
    queryFn: async () => {
      if (!actor || !profileOwnerPrincipal) return false;
      const topTribes = await actor.getTopTribes("alltime");
      if (!topTribes || topTribes.length === 0) return false;
      const ownerText = profileOwnerPrincipal.toText();
      const tribeDetails = await Promise.all(
        topTribes.map((entry) => actor.getTribe(entry.tribeId))
      );
      return tribeDetails.some(
        (tribe) => tribe && tribe.ownerId.toText() === ownerText
      );
    },
    enabled: !!actor && !isFetching && !!profileOwnerPrincipal,
    staleTime: 3e4,
    refetchInterval: 6e4
  });
  return data === true;
}
function buildTokenData(raw, gridSize) {
  const total = raw.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return [];
  const sorted = [...raw].sort((a, b) => b[1] - a[1]);
  const totalCells = gridSize * gridSize;
  let allocated = 0;
  const tokens = sorted.map(([symbol, usdValue], i) => {
    const pct = usdValue / total * 100;
    const cells = Math.round(usdValue / total * totalCells);
    allocated += cells;
    return {
      symbol,
      usdValue,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      percentage: pct,
      cells
    };
  });
  const diff = totalCells - allocated;
  if (tokens.length > 0) tokens[0].cells += diff;
  return tokens;
}
function WaffleGrid({
  tokens,
  gridSize,
  cellSize,
  gap,
  onCellHover
}) {
  const [hoveredToken, setHoveredToken] = reactExports.useState(null);
  const [tooltipPos, setTooltipPos] = reactExports.useState(
    null
  );
  const cells = [];
  for (let ti = 0; ti < tokens.length; ti++) {
    const t = tokens[ti];
    for (let c = 0; c < t.cells; c++) {
      cells.push({ color: t.color, tokenIndex: ti });
    }
  }
  while (cells.length < gridSize * gridSize)
    cells.push({ color: "#111", tokenIndex: -1 });
  const totalSize = gridSize * cellSize + (gridSize - 1) * gap;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", display: "inline-block" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
          gap: `${gap}px`,
          width: totalSize,
          height: totalSize,
          flexShrink: 0
        },
        children: cells.map((cell, i) => {
          const token = cell.tokenIndex >= 0 ? tokens[cell.tokenIndex] : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onMouseEnter: (e) => {
                setHoveredToken(token);
                setTooltipPos({ x: e.clientX, y: e.clientY });
                onCellHover == null ? void 0 : onCellHover(token);
              },
              onMouseMove: (e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              },
              onMouseLeave: () => {
                setHoveredToken(null);
                setTooltipPos(null);
                onCellHover == null ? void 0 : onCellHover(null);
              },
              style: {
                width: cellSize,
                height: cellSize,
                background: cell.color,
                opacity: cell.color === "#111" ? 0.18 : 0.9,
                cursor: token ? "crosshair" : "default"
              }
            },
            i
          );
        })
      }
    ),
    hoveredToken && tooltipPos && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          position: "fixed",
          left: tooltipPos.x + 12,
          top: tooltipPos.y - 36,
          zIndex: 9999,
          background: "#0a0a0a",
          border: `1px solid ${hoveredToken.color}`,
          padding: "4px 8px",
          pointerEvents: "none",
          boxShadow: `0 0 8px ${hoveredToken.color}40`,
          whiteSpace: "nowrap"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-accent uppercase tracking-widest",
              style: { fontSize: 12, color: hoveredToken.color },
              children: hoveredToken.symbol
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono",
              style: { fontSize: 11, color: "#fff", marginLeft: 6 },
              children: [
                "~$",
                hoveredToken.usdValue.toLocaleString(void 0, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono",
              style: { fontSize: 11, color: "#aaa", marginLeft: 4 },
              children: [
                "(",
                hoveredToken.percentage.toFixed(1),
                "%)"
              ]
            }
          )
        ]
      }
    )
  ] });
}
function CompactLegend({ tokens }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: tokens.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          width: 10,
          height: 10,
          background: t.color,
          flexShrink: 0
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-accent text-xs uppercase tracking-widest",
        style: { color: t.color },
        children: t.symbol
      }
    )
  ] }, t.symbol)) });
}
function BadgeCard({
  src,
  alt,
  label,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-2 p-3 relative border border-border",
      style: {
        background: "#0a0a0a"
      },
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.02) 3px, rgba(0,255,65,0.02) 4px)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt,
            style: {
              height: 72,
              width: "auto",
              imageRendering: "pixelated",
              display: "block"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-display uppercase tracking-widest",
            style: {
              fontSize: 16,
              color: "#00ff41",
              textShadow: "0 0 8px #00ff41"
            },
            children: label
          }
        )
      ]
    }
  );
}
function BadgesSection({
  hasOgBadge,
  canClaimBadge,
  onClaimBadge,
  playerBadgeLevel = 0,
  isTopTribeLeader = false
}) {
  const playerBadgeConfig = playerBadgeLevel === 3 ? {
    src: "/assets/alpha_player-019e5115-e12b-7587-9c76-389717cb1b21.png",
    label: "ALPHA PLAYER"
  } : playerBadgeLevel === 2 ? {
    src: "/assets/super_player-019e5115-e120-70a8-b19c-a300d6ae3eb7.png",
    label: "SUPER PLAYER"
  } : playerBadgeLevel === 1 ? {
    src: "/assets/player-019e5115-e237-7466-973f-4d18f899e9c4.png",
    label: "PLAYER"
  } : null;
  if (!hasOgBadge && !playerBadgeConfig && !canClaimBadge && !isTopTribeLeader)
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "highlights.badges_section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
    hasOgBadge && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BadgeCard,
      {
        src: "/assets/images/ak69-badge.png",
        alt: "OG Holder badge",
        label: "OG",
        ocid: "highlights.badge_card.1"
      }
    ),
    playerBadgeConfig && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BadgeCard,
      {
        src: playerBadgeConfig.src,
        alt: `${playerBadgeConfig.label} badge`,
        label: playerBadgeConfig.label,
        ocid: "highlights.badge_card.player"
      }
    ),
    isTopTribeLeader && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BadgeCard,
      {
        src: "/assets/tribe_leader.png",
        alt: "Top Tribe Leader badge",
        label: "TOP LEADER",
        ocid: "highlights.badge_card.tribe_leader"
      }
    ),
    !hasOgBadge && canClaimBadge && onClaimBadge && /* @__PURE__ */ jsxRuntimeExports.jsx(ClaimableBadge, { onClaimBadge })
  ] }) });
}
function ClaimableBadge({
  onClaimBadge
}) {
  const [claiming, setClaiming] = reactExports.useState(false);
  async function handleClaim() {
    setClaiming(true);
    try {
      await onClaimBadge();
    } finally {
      setClaiming(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-2 p-3 relative",
      style: {
        border: "1px solid #333",
        background: "#0a0a0a",
        opacity: 0.6
      },
      "data-ocid": "highlights.badge_card.1",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/assets/images/ak69-badge.png",
            alt: "OG Holder badge",
            style: {
              height: 72,
              width: "auto",
              imageRendering: "pixelated",
              display: "block",
              filter: "grayscale(100%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleClaim,
            disabled: claiming,
            className: "font-accent text-sm uppercase tracking-widest px-3 py-1 border border-accent text-accent hover:bg-accent/10 transition-colors disabled:opacity-50",
            "data-ocid": "highlights.claim_badge_button",
            children: claiming ? "CLAIMING…" : "CLAIM BADGE"
          }
        )
      ]
    }
  );
}
function BurnWaffleCard({
  type,
  principal,
  tribeId
}) {
  const { actor, isFetching } = useActor(createActor);
  const { data: burnSummary, isLoading } = useQuery({
    queryKey: [
      "burnSummary",
      type,
      type === "player" ? principal == null ? void 0 : principal.toText() : tribeId
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
    enabled: !!actor && !isFetching && (type === "player" ? !!principal : !!tribeId),
    staleTime: 6e4
  });
  const tokens = burnSummary ? buildTokenData(burnSummary, 10) : [];
  const hasData = tokens.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex flex-col gap-2 p-3 border border-border",
      style: { background: "#0a0a0a" },
      "data-ocid": "highlights.burn_waffle_card",
      children: isLoading || isFetching ? (
        /* Skeleton cells */
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(10, 16px)",
              gridTemplateRows: "repeat(10, 16px)",
              gap: "2px"
            },
            children: Array.from({ length: 100 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "animate-pulse",
                style: { width: 16, height: 16, background: "#004d14" }
              },
              i
            ))
          }
        )
      ) : !hasData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center",
          style: {
            width: 10 * 16 + 9 * 2,
            height: 10 * 16 + 9 * 2,
            border: "1px solid #00ff41"
          },
          "data-ocid": "highlights.burn_empty_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-display tracking-widest",
              style: { color: "#00ff41", fontSize: 18 },
              children: "NO BURNS YET"
            }
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row gap-3 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WaffleGrid, { tokens, gridSize: 10, cellSize: 16, gap: 2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CompactLegend, { tokens })
      ] })
    }
  );
}
function HighlightsSection({
  type,
  principal,
  tribeId,
  hasOgBadge,
  canClaimBadge,
  onClaimBadge,
  playerBadgeLevel
}) {
  const isTopTribeLeader = useTopTribeBadge(
    type === "player" ? principal : void 0
  );
  const showBadgesSection = hasOgBadge === true || canClaimBadge === true || (playerBadgeLevel ?? 0) > 0 || isTopTribeLeader;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "my-3", "data-ocid": "highlights.section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start flex-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:flex-1 flex flex-col gap-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-0", children: "BURN ALLO" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BurnWaffleCard, { type, principal, tribeId })
    ] }),
    showBadgesSection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:flex-1 flex flex-col gap-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl text-white tracking-widest uppercase border-b border-border pb-1 mb-0 block", children: "BADGES" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-3 py-2 border border-border",
          style: {
            background: "#0a0a0a"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            BadgesSection,
            {
              hasOgBadge: hasOgBadge ?? false,
              canClaimBadge,
              onClaimBadge,
              playerBadgeLevel: playerBadgeLevel ?? 0,
              isTopTribeLeader
            }
          )
        }
      )
    ] })
  ] }) });
}
export {
  HighlightsSection as H
};
