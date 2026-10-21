import { useEffect, useState } from "react";
import { useProtocolStats } from "../hooks/use-backend";
import { formatGrit } from "../lib/format";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAkk(amount: bigint): string {
  const num = Number(amount) / 1e8;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
          "font-display font-bold text-xl sm:text-[25px] text-accent truncate",
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

// ─── Protocol Stats Grid ──────────────────────────────────────────────────────

export function ProtocolStatsGrid() {
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
            : `${stats.blocksUntilHalving.toLocaleString("en-US")} blocks`
        }
      />
    </div>
  );
}
