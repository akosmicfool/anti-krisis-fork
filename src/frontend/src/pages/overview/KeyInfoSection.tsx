import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useProtocolStats } from "../../hooks/use-backend";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAkk(amount: bigint): string {
  const num = Number(amount) / 1e8;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatGrit(amount: bigint): string {
  const num = Number(amount);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toLocaleString();
}

function formatCountdown(seconds: bigint): string {
  const s = Number(seconds);
  if (s <= 0) return "00:00";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div
      className="bg-card border border-border p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 min-w-0"
      data-ocid={`overview.keyinfo.${label.toLowerCase().replace(/\s+/g, "_")}`}
    >
      <span className="text-xs uppercase tracking-widest font-mono text-white leading-tight truncate">
        {label}
      </span>
      <span
        className={[
          "font-mono font-bold text-base sm:text-xl text-accent truncate",
          isLink ? "" : "",
        ]
          .join(" ")
          .trim()}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function KeyInfoSection() {
  const { data: stats, isLoading } = useProtocolStats();

  // Local countdown timer
  const [countdown, setCountdown] = useState<bigint>(0n);

  useEffect(() => {
    if (!stats) return;
    setCountdown(stats.nextBlockIn);
  }, [stats]);

  useEffect(() => {
    if (!stats || !stats.isMiningActive) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0n) return 0n;
        return prev - 1n;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stats]);

  const loading = isLoading || !stats;

  return (
    <section
      className="py-8 sm:py-16 px-4 bg-card/40 border-t border-b border-border"
      data-ocid="overview.keyinfo_section"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <img
            src="/assets/key_info_icon.png"
            alt="Key Info"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
          />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-widest">
            PROTOCOL STATE
          </h2>
        </div>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-base text-foreground/85 leading-relaxed mb-6 sm:mb-8 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 shrink-0 animate-[blink_1.4s_ease-in-out_infinite]" />
          Live Action
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <StatCard
            label="CURRENT BLOCK"
            value={loading ? "—" : stats.currentBlock.toString()}
          />
          <StatCard
            label="NEXT BLOCK"
            value={
              loading
                ? "—"
                : !stats.isMiningActive
                  ? "Paused"
                  : formatCountdown(countdown)
            }
          />
          <StatCard
            label="BLOCK REWARD"
            value={loading ? "—" : `${formatAkk(stats.blockReward)} AKK`}
          />
          <StatCard
            label="CURRENT SUPPLY"
            value={
              loading
                ? "—"
                : `${(Number(stats.totalAkkMined) / 1e8).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AKK`
            }
          />
          <StatCard
            label="ACTIVE MINERS"
            value={loading ? "—" : stats.activeMiners.toString()}
          />
          <StatCard
            label="TOTAL MINERS"
            value={loading ? "—" : stats.totalMiners.toString()}
          />
          <StatCard
            label="GRIT SPENT"
            value={loading ? "—" : formatGrit(stats.totalGritSpent)}
          />
          <StatCard
            label="NEXT HALVING"
            value={
              loading
                ? "—"
                : `${Number((stats as any).blocksUntilHalving ?? 0n).toLocaleString("en-US")} blocks`
            }
          />
        </div>

        {/* Action buttons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/mining/blocks"
            className="inline-flex items-center gap-2 font-accent text-sm sm:text-base tracking-widest uppercase text-accent hover:text-accent/80 transition-colors group"
            data-ocid="overview.full_history_link"
          >
            <span>[Full History]</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
          <Link
            to="/akore"
            className="inline-flex items-center gap-2 border border-accent px-5 py-2.5 sm:px-6 sm:py-3 font-accent text-accent text-sm sm:text-base tracking-widest uppercase hover:bg-accent/10 transition-all duration-200 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)]"
            data-ocid="overview.get_mining_button"
          >
            GET MINING
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
