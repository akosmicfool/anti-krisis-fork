import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Trophy, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { VideoSection } from "../components/VideoSection";
import type {
  PlayerScoreEntry,
  Timescale,
  TribeScoreEntry,
} from "../hooks/use-score";
import { useTopPlayers, useTopTribes } from "../hooks/use-score";

// ─── Rank medal colours ───────────────────────────────────────────────────────
const RANK_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

function rankStyle(rank: number): React.CSSProperties {
  const color = RANK_COLORS[rank] ?? "hsl(var(--muted-foreground))";
  return { color };
}

// ─── Timescale selector ───────────────────────────────────────────────────────
const TIMESCALES: { value: Timescale; label: string }[] = [
  { value: "weekly", label: "WEEKLY" },
  { value: "monthly", label: "MONTHLY" },
  { value: "quarterly", label: "QUARTERLY" },
  { value: "yearly", label: "YEARLY" },
  { value: "all-time", label: "ALL TIME" },
];

function TimescaleSelector({
  value,
  onChange,
}: {
  value: Timescale;
  onChange: (v: Timescale) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const activeLabel =
    TIMESCALES.find((ts) => ts.value === value)?.label ?? "ALL TIME";

  return (
    <div ref={ref} className="relative" data-ocid="score.timescale_selector">
      {/* Single button — shows active label and opens full dropdown */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-ocid="score.timescale_dropdown_toggle"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={[
          "flex items-center gap-2 font-accent text-sm uppercase tracking-widest px-3 py-1.5 border transition-smooth",
          value !== "all-time"
            ? "border-accent text-[#00ff41] bg-accent/10"
            : "border-border text-white hover:border-accent/60 hover:text-[#00ff41] bg-transparent",
        ].join(" ")}
      >
        {activeLabel}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-label="Timescale options"
          className="absolute top-full left-0 mt-1 z-50 bg-card border border-border shadow-[0_0_12px_rgba(0,255,65,0.12)] min-w-[130px]"
          data-ocid="score.timescale_dropdown"
        >
          {TIMESCALES.map((ts) => (
            <button
              key={ts.value}
              type="button"
              role="menuitemradio"
              aria-checked={value === ts.value}
              onClick={() => {
                onChange(ts.value);
                setOpen(false);
              }}
              data-ocid={`score.timescale.${ts.value}`}
              className={[
                "w-full text-left font-accent text-sm uppercase tracking-widest px-3 py-2 transition-smooth",
                value === ts.value
                  ? "text-[#00ff41] bg-accent/10"
                  : "text-white hover:text-[#00ff41] hover:bg-muted/30",
              ].join(" ")}
            >
              {ts.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
type LeaderboardMode = "players" | "tribes";

function ModeToggle({
  value,
  onChange,
}: {
  value: LeaderboardMode;
  onChange: (v: LeaderboardMode) => void;
}) {
  return (
    <div
      className="flex border border-border"
      role="tablist"
      aria-label="Leaderboard mode"
      data-ocid="score.mode_toggle"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "players"}
        onClick={() => onChange("players")}
        data-ocid="score.mode_toggle.players"
        className={[
          "flex items-center gap-1.5 font-accent text-sm uppercase tracking-widest px-4 py-2 transition-smooth",
          value === "players"
            ? "bg-accent text-background"
            : "bg-transparent text-white hover:text-[#00ff41]",
        ].join(" ")}
      >
        <Zap className="h-3 w-3" />
        Players
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "tribes"}
        onClick={() => onChange("tribes")}
        data-ocid="score.mode_toggle.tribes"
        className={[
          "flex items-center gap-1.5 font-accent text-sm uppercase tracking-widest px-4 py-2 border-l border-border transition-smooth",
          value === "tribes"
            ? "bg-accent text-background"
            : "bg-transparent text-white hover:text-[#00ff41]",
        ].join(" ")}
      >
        <Users className="h-3 w-3" />
        Tribes
      </button>
    </div>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────
function PlayerCard({
  entry,
  rank,
  index,
}: {
  entry: PlayerScoreEntry;
  rank: number;
  index: number;
}) {
  // Display Name first → username → shortened principal
  const rawLabel = entry.displayName?.trim() || entry.username?.trim() || "";
  const displayLabel = rawLabel || `${entry.principal.slice(0, 8)}\u2026`;

  // Avatar: real photo or colored initial circle
  const initials = (entry.username || entry.displayName || entry.principal)
    .slice(0, 1)
    .toUpperCase();
  // Deterministic hue from principal string for variety
  const hue =
    entry.principal.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    360;
  const avatarBg = `hsl(${hue} 60% 30%)`;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-4 bg-card border border-border p-4 hover:border-accent/60 hover:shadow-[0_0_12px_rgba(0,255,65,0.15)] transition-smooth cursor-pointer group"
      data-ocid={`score.player_card.${rank}`}
    >
      {/* Rank */}
      <span
        className="font-display text-2xl tabular-nums w-10 shrink-0 text-center"
        style={rankStyle(rank)}
      >
        {rank}
      </span>

      {/* Avatar */}
      <div
        className="shrink-0 w-10 h-10 rounded-none overflow-hidden border border-border/60"
        style={{ background: entry.profilePicture ? undefined : avatarBg }}
      >
        {entry.profilePicture ? (
          <img
            src={entry.profilePicture}
            alt={displayLabel}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-xl text-foreground">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-xl text-foreground truncate group-hover:text-accent transition-smooth">
          {displayLabel}
        </p>
        <p className="font-mono text-xs text-muted-foreground truncate mt-0.5">
          {entry.tribeName === "Solo" ? (
            <span className="text-muted-foreground/60">Solo</span>
          ) : (
            <span className="text-accent/80">{entry.tribeName}</span>
          )}
        </p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className="font-mono font-bold text-lg" style={rankStyle(rank)}>
          {entry.score.toFixed(2)}
        </p>
        <p className="font-accent text-sm uppercase tracking-widest text-white">
          AK69
        </p>
      </div>
    </motion.div>
  );

  // Only navigate to profile when a valid username is available.
  // Routing to /profile/$principal returns "Profile not found" since
  // PublicProfilePage only resolves by username.
  const usernameParam = entry.username?.trim();
  if (!usernameParam) {
    // Non-clickable: no username means no routable profile
    return <div>{cardContent}</div>;
  }
  return (
    <Link to="/profile/$username" params={{ username: usernameParam }}>
      {cardContent}
    </Link>
  );
}

// ─── Tribe Card ───────────────────────────────────────────────────────────────
function TribeCard({
  entry,
  rank,
  index,
}: {
  entry: TribeScoreEntry;
  rank: number;
  index: number;
}) {
  const initials = entry.tribeName.slice(0, 1).toUpperCase();
  const hue =
    entry.tribeName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    360;
  const avatarBg = `hsl(${hue} 55% 28%)`;

  return (
    <Link to="/tribe/$tribeId" params={{ tribeId: entry.tribeId }}>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.06 }}
        className="flex items-center gap-4 bg-card border border-border p-4 hover:border-accent/60 hover:shadow-[0_0_12px_rgba(0,255,65,0.15)] transition-smooth cursor-pointer group"
        data-ocid={`score.tribe_card.${rank}`}
      >
        {/* Rank */}
        <span
          className="font-display text-2xl tabular-nums w-10 shrink-0 text-center"
          style={rankStyle(rank)}
        >
          {rank}
        </span>

        {/* Tribe photo */}
        <div
          className="shrink-0 w-10 h-10 rounded-none overflow-hidden border border-border/60"
          style={{ background: entry.photoUrl ? undefined : avatarBg }}
        >
          {entry.photoUrl ? (
            <img
              src={entry.photoUrl}
              alt={entry.tribeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-xl text-foreground">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl text-foreground truncate group-hover:text-accent transition-smooth">
            {entry.tribeName}
          </p>
          <p className="font-accent text-sm uppercase tracking-widest text-muted-foreground mt-0.5">
            <Users className="inline h-2.5 w-2.5 mr-1" />
            {entry.memberCount} {entry.memberCount === 1 ? "member" : "members"}
          </p>
        </div>

        {/* Score */}
        <div className="text-right shrink-0">
          <p className="font-mono font-bold text-lg" style={rankStyle(rank)}>
            {entry.score.toFixed(2)}
          </p>
          <p className="font-accent text-sm uppercase tracking-widest text-muted-foreground">
            AK69
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Skeleton rows ─────────────────────────────────────────────────────────────
function LoadingRows({ count }: { count: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton
        <Skeleton key={i} className="h-20 w-full bg-muted" />
      ))}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-dashed border-border/60 py-16 flex flex-col items-center justify-center gap-4 text-center"
      data-ocid="score.empty_state"
    >
      <div className="w-14 h-14 border border-border bg-muted/20 flex items-center justify-center">
        <Trophy className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <p className="font-display text-2xl text-foreground uppercase tracking-wide">
          No Scores Yet
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{message}</p>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function ScorePage() {
  const [mode, setMode] = useState<LeaderboardMode>("players");
  const [timescale, setTimescale] = useState<Timescale>("all-time");

  const { data: players = [], isLoading: playersLoading } =
    useTopPlayers(timescale);

  const { data: tribes = [], isLoading: tribesLoading } =
    useTopTribes(timescale);

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
      data-ocid="score.page"
    >
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
          <Trophy className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
          SKOREBOARD
        </h1>
        <p className="text-white text-sm mt-1 break-words">
          Top players and tribes ranked by{" "}
          <span className="text-accent font-mono">AK69</span> — a composite of
          GRIT burned and AKK won.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <ModeToggle value={mode} onChange={setMode} />
        <TimescaleSelector value={timescale} onChange={setTimescale} />
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Players leaderboard */}
      {mode === "players" && (
        <div data-ocid="score.players_section">
          <h2 className="font-display text-xl uppercase tracking-widest text-white mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Top Players
          </h2>
          {playersLoading ? (
            <LoadingRows count={9} />
          ) : players.length === 0 ? (
            <EmptyState message="Start burning tokens and mining AKK to appear on the leaderboard." />
          ) : (
            <div className="space-y-2" data-ocid="score.players_list">
              {players.map((entry, i) => (
                <PlayerCard
                  key={entry.principal}
                  entry={entry}
                  rank={i + 1}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tribes leaderboard */}
      {mode === "tribes" && (
        <div data-ocid="score.tribes_section">
          <h2 className="font-display text-xl uppercase tracking-widest text-white mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            Top Tribes
          </h2>
          {tribesLoading ? (
            <LoadingRows count={6} />
          ) : tribes.length === 0 ? (
            <EmptyState message="Tribes need at least 2 members and active GRIT burns to appear here." />
          ) : (
            <div className="space-y-2" data-ocid="score.tribes_list">
              {tribes.map((entry, i) => (
                <TribeCard
                  key={entry.tribeId}
                  entry={entry}
                  rank={i + 1}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <VideoSection />
    </div>
  );
}
