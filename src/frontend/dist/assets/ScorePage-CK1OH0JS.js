import { s as useQuery, v as useActor, w as createActor, r as reactExports, j as jsxRuntimeExports, T as Trophy, J as ChevronDown, S as Skeleton, L as Link } from "./index-DqUaPUte.js";
import { V as VideoSection } from "./VideoSection-Cnd2c0D2.js";
import { Z as Zap } from "./zap-DN51KW58.js";
import { U as Users } from "./users-B1Dh4dop.js";
import { m as motion } from "./proxy-Be9tuGjA.js";
function useActorInstance() {
  return useActor(createActor);
}
function toBackendTimescale(timescale) {
  return timescale === "all-time" ? "alltime" : timescale;
}
function useTopPlayers(timescale) {
  const { actor, isFetching } = useActorInstance();
  return useQuery({
    queryKey: ["topPlayers", timescale],
    queryFn: async () => {
      var _a, _b, _c;
      if (!actor) return [];
      const backendTimescale = toBackendTimescale(timescale);
      const raw = await actor.getTopPlayers(backendTimescale);
      const entries = [];
      for (const e of raw) {
        const username = ((_a = e.username) == null ? void 0 : _a.trim()) ?? "";
        const displayName = ((_b = e.displayName) == null ? void 0 : _b.trim()) ?? "";
        if (!username) continue;
        const resolvedDisplay = displayName || username;
        let profilePicture = "";
        try {
          const profile = await actor.getProfileByUsername(username);
          profilePicture = (profile == null ? void 0 : profile.profilePicture) ?? "";
        } catch {
        }
        entries.push({
          principal: e.principal.toText(),
          displayName: resolvedDisplay,
          username,
          profilePicture,
          tribeName: ((_c = e.tribeName) == null ? void 0 : _c.trim()) || "Solo",
          tribeId: e.tribeId ?? null,
          gritSpent: 0n,
          akkWon: 0n,
          score: e.score
        });
      }
      entries.sort((a, b) => b.score - a.score);
      return entries.slice(0, 9);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15e3,
    staleTime: 5e3
  });
}
function useTopTribes(timescale) {
  const { actor, isFetching } = useActorInstance();
  return useQuery({
    queryKey: ["topTribes", timescale],
    queryFn: async () => {
      if (!actor) return [];
      const backendTimescale = toBackendTimescale(timescale);
      const raw = await actor.getTopTribes(backendTimescale);
      const entries = [];
      for (const e of raw) {
        if (Number(e.memberCount) < 2) continue;
        let photoUrl = "";
        try {
          const tribe = await actor.getTribe(e.tribeId);
          photoUrl = (tribe == null ? void 0 : tribe.photoUrl) ?? "";
        } catch {
        }
        entries.push({
          tribeId: e.tribeId,
          tribeName: e.tribeName,
          memberCount: Number(e.memberCount),
          photoUrl,
          gritSpent: 0n,
          akkWon: 0n,
          score: e.score
        });
      }
      entries.sort((a, b) => b.score - a.score);
      return entries.slice(0, 6);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15e3,
    staleTime: 5e3
  });
}
const RANK_COLORS = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32"
};
function rankStyle(rank) {
  const color = RANK_COLORS[rank] ?? "hsl(var(--muted-foreground))";
  return { color };
}
const TIMESCALES = [
  { value: "weekly", label: "WEEKLY" },
  { value: "monthly", label: "MONTHLY" },
  { value: "quarterly", label: "QUARTERLY" },
  { value: "yearly", label: "YEARLY" },
  { value: "all-time", label: "ALL TIME" }
];
function TimescaleSelector({
  value,
  onChange
}) {
  var _a;
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  const activeLabel = ((_a = TIMESCALES.find((ts) => ts.value === value)) == null ? void 0 : _a.label) ?? "ALL TIME";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", "data-ocid": "score.timescale_selector", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        "data-ocid": "score.timescale_dropdown_toggle",
        "aria-expanded": open,
        "aria-haspopup": "listbox",
        className: [
          "flex items-center gap-2 font-accent text-sm uppercase tracking-widest px-3 py-1.5 border transition-smooth",
          value !== "all-time" ? "border-accent text-[#00ff41] bg-accent/10" : "border-border text-white hover:border-accent/60 hover:text-[#00ff41] bg-transparent"
        ].join(" "),
        children: [
          activeLabel,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        role: "menu",
        "aria-label": "Timescale options",
        className: "absolute top-full left-0 mt-1 z-50 bg-card border border-border shadow-[0_0_12px_rgba(0,255,65,0.12)] min-w-[130px]",
        "data-ocid": "score.timescale_dropdown",
        children: TIMESCALES.map((ts) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "menuitemradio",
            "aria-checked": value === ts.value,
            onClick: () => {
              onChange(ts.value);
              setOpen(false);
            },
            "data-ocid": `score.timescale.${ts.value}`,
            className: [
              "w-full text-left font-accent text-sm uppercase tracking-widest px-3 py-2 transition-smooth",
              value === ts.value ? "text-[#00ff41] bg-accent/10" : "text-white hover:text-[#00ff41] hover:bg-muted/30"
            ].join(" "),
            children: ts.label
          },
          ts.value
        ))
      }
    )
  ] });
}
function ModeToggle({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex border border-border",
      role: "tablist",
      "aria-label": "Leaderboard mode",
      "data-ocid": "score.mode_toggle",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": value === "players",
            onClick: () => onChange("players"),
            "data-ocid": "score.mode_toggle.players",
            className: [
              "flex items-center gap-1.5 font-accent text-sm uppercase tracking-widest px-4 py-2 transition-smooth",
              value === "players" ? "bg-accent text-background" : "bg-transparent text-white hover:text-[#00ff41]"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
              "Players"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": value === "tribes",
            onClick: () => onChange("tribes"),
            "data-ocid": "score.mode_toggle.tribes",
            className: [
              "flex items-center gap-1.5 font-accent text-sm uppercase tracking-widest px-4 py-2 border-l border-border transition-smooth",
              value === "tribes" ? "bg-accent text-background" : "bg-transparent text-white hover:text-[#00ff41]"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
              "Tribes"
            ]
          }
        )
      ]
    }
  );
}
function PlayerCard({
  entry,
  rank,
  index
}) {
  var _a, _b, _c;
  const rawLabel = ((_a = entry.displayName) == null ? void 0 : _a.trim()) || ((_b = entry.username) == null ? void 0 : _b.trim()) || "";
  const displayLabel = rawLabel || `${entry.principal.slice(0, 8)}…`;
  const initials = (entry.username || entry.displayName || entry.principal).slice(0, 1).toUpperCase();
  const hue = entry.principal.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const avatarBg = `hsl(${hue} 60% 30%)`;
  const cardContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06 },
      className: "flex items-center gap-4 bg-card border border-border p-4 hover:border-accent/60 hover:shadow-[0_0_12px_rgba(0,255,65,0.15)] transition-smooth cursor-pointer group",
      "data-ocid": `score.player_card.${rank}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-display text-2xl tabular-nums w-10 shrink-0 text-center",
            style: rankStyle(rank),
            children: rank
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "shrink-0 w-10 h-10 rounded-none overflow-hidden border border-border/60",
            style: { background: entry.profilePicture ? void 0 : avatarBg },
            children: entry.profilePicture ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: entry.profilePicture,
                alt: displayLabel,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl text-foreground", children: initials }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-foreground truncate group-hover:text-accent transition-smooth", children: displayLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground truncate mt-0.5", children: entry.tribeName === "Solo" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Solo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent/80", children: entry.tribeName }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-lg", style: rankStyle(rank), children: entry.score.toFixed(2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-accent text-sm uppercase tracking-widest text-white", children: "AK69" })
        ] })
      ]
    }
  );
  const usernameParam = (_c = entry.username) == null ? void 0 : _c.trim();
  if (!usernameParam) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: cardContent });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile/$username", params: { username: usernameParam }, children: cardContent });
}
function TribeCard({
  entry,
  rank,
  index
}) {
  const initials = entry.tribeName.slice(0, 1).toUpperCase();
  const hue = entry.tribeName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const avatarBg = `hsl(${hue} 55% 28%)`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/tribe/$tribeId", params: { tribeId: entry.tribeId }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06 },
      className: "flex items-center gap-4 bg-card border border-border p-4 hover:border-accent/60 hover:shadow-[0_0_12px_rgba(0,255,65,0.15)] transition-smooth cursor-pointer group",
      "data-ocid": `score.tribe_card.${rank}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-display text-2xl tabular-nums w-10 shrink-0 text-center",
            style: rankStyle(rank),
            children: rank
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "shrink-0 w-10 h-10 rounded-none overflow-hidden border border-border/60",
            style: { background: entry.photoUrl ? void 0 : avatarBg },
            children: entry.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: entry.photoUrl,
                alt: entry.tribeName,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl text-foreground", children: initials }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-foreground truncate group-hover:text-accent transition-smooth", children: entry.tribeName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-accent text-sm uppercase tracking-widest text-muted-foreground mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "inline h-2.5 w-2.5 mr-1" }),
            entry.memberCount,
            " ",
            entry.memberCount === 1 ? "member" : "members"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-lg", style: rankStyle(rank), children: entry.score.toFixed(2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-accent text-sm uppercase tracking-widest text-muted-foreground", children: "AK69" })
        ] })
      ]
    }
  ) });
}
function LoadingRows({ count }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: count }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full bg-muted" }, i)
  )) });
}
function EmptyState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "border border-dashed border-border/60 py-16 flex flex-col items-center justify-center gap-4 text-center",
      "data-ocid": "score.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 border border-border bg-muted/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-7 w-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-foreground uppercase tracking-wide", children: "No Scores Yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: message })
        ] })
      ]
    }
  );
}
function ScorePage() {
  const [mode, setMode] = reactExports.useState("players");
  const [timescale, setTimescale] = reactExports.useState("all-time");
  const { data: players = [], isLoading: playersLoading } = useTopPlayers(timescale);
  const { data: tribes = [], isLoading: tribesLoading } = useTopTribes(timescale);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-8",
      "data-ocid": "score.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-7 w-7 sm:h-8 sm:w-8 text-accent" }),
            "SKOREBOARD"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm mt-1 break-words", children: [
            "Top players and tribes ranked by",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-mono", children: "AK69" }),
            " — a composite of GRIT burned and AKK won."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ModeToggle, { value: mode, onChange: setMode }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TimescaleSelector, { value: timescale, onChange: setTimescale })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
        mode === "players" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "score.players_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl uppercase tracking-widest text-white mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent" }),
            "Top Players"
          ] }),
          playersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, { count: 9 }) : players.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Start burning tokens and mining AKK to appear on the leaderboard." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "score.players_list", children: players.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PlayerCard,
            {
              entry,
              rank: i + 1,
              index: i
            },
            entry.principal
          )) })
        ] }),
        mode === "tribes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "score.tribes_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl uppercase tracking-widest text-white mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-accent" }),
            "Top Tribes"
          ] }),
          tribesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingRows, { count: 6 }) : tribes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Tribes need at least 2 members and active GRIT burns to appear here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "score.tribes_list", children: tribes.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TribeCard,
            {
              entry,
              rank: i + 1,
              index: i
            },
            entry.tribeId
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(VideoSection, {})
      ]
    }
  );
}
export {
  ScorePage
};
