import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Clock, Cpu, PickaxeIcon, Plus, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MinerStatus } from "../backend";
import type { BlockRecord, MinerView } from "../backend";
import { CreateMinerModal } from "../components/CreateMinerModal";
import { EditMinerModal } from "../components/EditMinerModal";
import { useAuth } from "../hooks/use-auth";
import {
  useBlockHistory,
  useGetLaunchGateConfig,
  useMyMiners,
  useUserMiningStats,
} from "../hooks/use-backend";
import { formatGrit, truncateAddress } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatAkk(amount: bigint): string {
  const num = Number(amount) / 1e8;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

function formatRate(rate: bigint): string {
  const bn = Number(rate) / 1_000_000_000;
  return `${bn.toLocaleString("en-US", { maximumFractionDigits: 2 })} B GRIT/day`;
}

function formatTimestamp(ts: bigint): string {
  // ts is nanoseconds
  return new Date(Number(ts / 1_000_000n)).toLocaleString();
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function MinerStatusBadge({ status }: { status: MinerStatus }) {
  if (status === MinerStatus.active)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded border font-accent text-sm uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
        Active
      </span>
    );
  if (status === MinerStatus.paused)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded border font-accent text-sm uppercase tracking-widest bg-yellow-500/15 text-yellow-400 border-yellow-500/30">
        Paused
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded border font-accent text-sm uppercase tracking-widest bg-red-500/15 text-red-400 border-red-500/30">
      Exhausted
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  labelClass,
  valueClass,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-card border border-border p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span
          className={
            labelClass ?? "text-xs uppercase tracking-widest font-mono"
          }
        >
          {label}
        </span>
      </div>
      <p
        className={valueClass ?? "font-mono font-bold text-xl text-foreground"}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Miner card ───────────────────────────────────────────────────────────────
function MinerCard({
  miner,
  index,
  onEdit,
}: {
  miner: MinerView;
  index: number;
  onEdit: (m: MinerView) => void;
}) {
  const isExhausted = miner.status === MinerStatus.exhausted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={[
        "bg-card border border-border p-4 flex flex-col gap-3 transition-smooth",
        isExhausted ? "opacity-50" : "",
      ].join(" ")}
      data-ocid={`mining.miner_card.${index + 1}`}
    >
      {/* Top row: name / status badge / rate / edit — wraps on very narrow screens */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Name + status badge @ rate */}
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          <p className="font-display font-bold text-foreground truncate shrink-0 max-w-[150px] sm:max-w-[180px] text-[1.1rem] sm:text-[1.275rem]">
            {miner.name}
          </p>
          <MinerStatusBadge status={miner.status} />
          <span className="font-mono text-xs text-muted-foreground">
            @ {formatRate(miner.miningRate)}
          </span>
        </div>

        {/* Edit button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(miner)}
          className="shrink-0 ml-auto border-border hover:border-accent/60 font-mono text-xs uppercase tracking-widest transition-smooth"
          data-ocid={`mining.edit_button.${index + 1}`}
        >
          Edit
        </Button>
      </div>

      {/* Bottom stats: GRIT Spent | Blocks Mined | GRIT Balance */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 border-t border-border/50 pt-3 items-end">
        {/* GRIT Spent */}
        <div className="flex flex-col items-center justify-between gap-1">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white text-center">
            GRIT SPENT
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground text-center">
            {formatGrit(
              (miner as MinerView & { gritSpent?: bigint }).gritSpent ?? 0n,
            )}
          </span>
        </div>
        {/* Blocks Mined */}
        <div className="flex flex-col items-center justify-between gap-1">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white text-center">
            BLOCKS MINED
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground text-center">
            {(
              (miner as MinerView & { blocksMined?: bigint }).blocksMined ?? 0n
            ).toString()}
          </span>
        </div>
        {/* GRIT Balance */}
        <div className="flex flex-col items-center justify-between gap-1">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white text-center">
            GRIT BALANCE
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-accent text-center">
            {formatGrit(miner.gritBalance)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Block history row ────────────────────────────────────────────────────────
function BlockHistoryRow({
  block,
  index,
}: { block: BlockRecord; index: number }) {
  return (
    <div
      className="py-2.5 border-b border-border/50 last:border-0 text-xs font-mono"
      data-ocid={`mining.block_history.item.${index + 1}`}
    >
      {/* Top line: block number + winner address + reward */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-muted-foreground tabular-nums shrink-0">
          #{Number(block.blockNumber)}
        </span>
        <span className="text-foreground truncate flex-1 min-w-0">
          {block.winnerOwner ? (
            truncateAddress(block.winnerOwner.toText(), 8)
          ) : (
            <span className="text-muted-foreground">No winner</span>
          )}
        </span>
        <span className="text-accent font-bold shrink-0">
          {formatAkk(block.akkReward)} AKK
        </span>
      </div>
      {/* Timestamp on its own line — always fits */}
      <div className="text-muted-foreground mt-0.5">
        {formatTimestamp(block.timestamp)}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function MiningPage({ embedded = false }: { embedded?: boolean }) {
  const { isAuthenticated } = useAuth();
  const { data: miners = [], isLoading: minersLoading } = useMyMiners();
  const { data: miningStats } = useUserMiningStats();
  const { data: blockHistory = [], isLoading: historyLoading } =
    useBlockHistory(10n);

  const [createOpen, setCreateOpen] = useState(false);
  const [editMiner, setEditMiner] = useState<MinerView | null>(null);

  const { data: launchGateData } = useGetLaunchGateConfig();
  const [launchCountdown, setLaunchCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const isLaunchTimeBlocked = !!(
    launchGateData?.launchTimeEnabled &&
    Date.now() < Number(launchGateData?.launchTime ?? 0)
  );

  useEffect(() => {
    if (!launchGateData?.launchTimeEnabled || !launchGateData.launchTime)
      return;
    const target = Number(launchGateData.launchTime);
    if (Date.now() >= target) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLaunchCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setLaunchCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [launchGateData?.launchTimeEnabled, launchGateData?.launchTime]);

  return (
    <div
      className={
        embedded ? "space-y-4" : "max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4"
      }
      data-ocid="mining.page"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-[2.4rem] sm:text-[3rem] font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5">
            <PickaxeIcon className="h-[1.53rem] w-[1.53rem] text-accent" />
            MINE
          </h1>
          <p className="text-white text-sm mt-0.5">
            Spend GRIT to mine{" "}
            <span className="text-accent font-mono">$AKK</span> — deploy miners,
            set rates, and compete for each block reward.
          </p>
        </div>
      </div>

      {isLaunchTimeBlocked && (
        <div className="rounded border border-accent/40 bg-accent/5 px-4 py-5 text-center space-y-2 mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono">
            LAUNCH OPENS IN
          </p>
          <p className="font-mono text-2xl font-bold text-accent tracking-widest">
            {String(launchCountdown.days).padStart(2, "0")}d{" "}
            {String(launchCountdown.hours).padStart(2, "0")}h{" "}
            {String(launchCountdown.minutes).padStart(2, "0")}m{" "}
            {String(launchCountdown.seconds).padStart(2, "0")}s
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="BLOCKS MINED"
          value={miningStats ? miningStats.blocksMined.toString() : "0"}
          labelClass="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white"
          valueClass="text-base sm:text-xl text-foreground font-bold font-mono truncate"
        />
        <StatCard
          label="AKK WON"
          value={miningStats ? formatAkk(miningStats.akkWon) : "0"}
          labelClass="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white"
          valueClass="text-base sm:text-2xl text-accent font-bold font-mono truncate"
        />
        <StatCard
          label="GRIT SPENT"
          value={miningStats ? formatGrit(miningStats.gritSpent) : "0"}
          labelClass="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white"
          valueClass="text-base sm:text-2xl text-accent font-bold font-mono truncate"
        />
        <StatCard
          label="ACTIVE MINERS"
          value={
            miners
              ? miners
                  .filter((m) => m.status === MinerStatus.active)
                  .length.toString()
              : "0"
          }
          labelClass="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white"
          valueClass="text-base sm:text-xl text-foreground font-bold font-mono truncate"
        />
      </div>

      {/* Miners list */}
      <div data-ocid="mining.miners_section">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="font-display font-bold text-[1.43rem] uppercase tracking-widest text-accent flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            MY MINERS
          </h2>
          {isAuthenticated && (
            <Button
              type="button"
              disabled={isLaunchTimeBlocked}
              onClick={() => setCreateOpen(true)}
              className="bg-accent text-background hover:bg-accent/90 font-display font-black uppercase tracking-widest gap-2 h-9 px-4 text-sm transition-smooth"
              data-ocid="mining.create_miner_button"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Miner
            </Button>
          )}
        </div>

        {minersLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-muted" />
            ))}
          </div>
        ) : miners.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-border/60 py-12 flex flex-col items-center justify-center gap-3 text-center"
            data-ocid="mining.miners_empty_state"
          >
            <div className="w-12 h-12 border border-border bg-muted/20 flex items-center justify-center">
              <Cpu className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground uppercase tracking-wide">
                No Miners Yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Create your first miner to start competing for AKK block
                rewards.
              </p>
            </div>
            {isAuthenticated && (
              <Button
                type="button"
                disabled={isLaunchTimeBlocked}
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="bg-accent text-background hover:bg-accent/90 font-mono text-xs uppercase tracking-widest gap-1.5 transition-smooth"
                data-ocid="mining.empty_create_button"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Miner
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2" data-ocid="mining.miners_list">
              {miners.map((miner, i) => (
                <MinerCard
                  key={Number(miner.id)}
                  miner={miner}
                  index={i}
                  onEdit={setEditMiner}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Block history */}
      <Card
        className="bg-card border-border"
        data-ocid="mining.block_history_card"
      >
        <CardHeader className="pb-0">
          <CardTitle className="font-display text-xl sm:text-3xl uppercase tracking-widest text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            RECENT BLOCKS
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {historyLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full bg-muted" />
              ))}
            </div>
          ) : blockHistory.length === 0 ? (
            <div
              className="py-8 text-center text-muted-foreground text-sm"
              data-ocid="mining.block_history_empty_state"
            >
              No blocks mined yet. Mining starts once a miner is created.
            </div>
          ) : (
            <div data-ocid="mining.block_history_list" className="-mt-2">
              {[...blockHistory]
                .sort((a, b) => Number(b.blockNumber - a.blockNumber))
                .slice(0, 5)
                .map((block, i) => (
                  <BlockHistoryRow
                    key={Number(block.blockNumber)}
                    block={block}
                    index={i}
                  />
                ))}
              <div className="pt-3 text-center">
                <Link
                  to="/mining/blocks"
                  className="font-mono text-xs text-gray-400 hover:text-[#00ff41] hover:drop-shadow-[0_0_6px_#00ff41] uppercase tracking-widest transition-colors duration-200"
                  data-ocid="mining.blocks_history_link"
                >
                  FULL BLOCK HISTORY
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateMinerModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      {editMiner && (
        <EditMinerModal
          miner={editMiner}
          open={!!editMiner}
          onClose={() => setEditMiner(null)}
        />
      )}
    </div>
  );
}
