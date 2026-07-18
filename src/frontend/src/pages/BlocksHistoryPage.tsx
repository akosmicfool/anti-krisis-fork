import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Clock, Search, X } from "lucide-react";
import { useState } from "react";
import type { BlockRecord } from "../backend";
import {
  useBlockDetails,
  useGetBlockHistoryPage,
  useGetTotalBlockCount,
} from "../hooks/use-backend";
import type { BlockDetailView } from "../hooks/use-backend";

function formatAkk(amount: bigint): string {
  const num = Number(amount) / 1e8;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

function truncateAddress(address: string, chars = 8): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

function BlockDetailPanel({ blockNumber }: { blockNumber: bigint }) {
  const { data: detail, isLoading } = useBlockDetails(blockNumber);

  if (isLoading) {
    return (
      <div className="px-3 py-3 bg-muted/10 border-t border-border/40 text-xs font-mono text-muted-foreground animate-pulse">
        Loading block details…
      </div>
    );
  }
  if (!detail) {
    return (
      <div className="px-3 py-3 bg-muted/10 border-t border-border/40 text-xs font-mono text-muted-foreground">
        Block details unavailable.
      </div>
    );
  }

  const vrfHex = detail.vrfValue.toString(16).toUpperCase().padStart(16, "0");
  const gritByMiner = new Map(
    detail.minerGritSpent.map(([id, g]) => [id.toString(), g]),
  );
  const weightByMiner = new Map(
    detail.minerWeights.map(([id, w]) => [id.toString(), w]),
  );
  const noMinerData = detail.minerCount === 0n && detail.totalGritSpent === 0n;

  return (
    <div className="bg-muted/8 border-t border-border/40 px-3 py-3 space-y-3 text-xs font-mono">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-card border border-border/50 px-2 py-1.5">
          <div className="text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5">
            Winner
          </div>
          <div className="text-foreground truncate">
            {detail.winnerPrincipal ? (
              truncateAddress(detail.winnerPrincipal.toText(), 8)
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </div>
        <div className="bg-card border border-border/50 px-2 py-1.5">
          <div className="text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5">
            Total GRIT
          </div>
          <div className="text-accent font-bold">
            {detail.totalGritSpent === 0n
              ? "—"
              : `${formatGritSpent(detail.totalGritSpent)} B`}
          </div>
        </div>
        <div className="bg-card border border-border/50 px-2 py-1.5">
          <div className="text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5">
            Miners
          </div>
          <div className="text-foreground">
            {detail.minerCount === 0n ? "—" : detail.minerCount.toString()}
          </div>
        </div>
        <div className="bg-card border border-border/50 px-2 py-1.5">
          <div className="text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5">
            VRF Value
          </div>
          <div className="text-[#00ff41]/80 truncate">
            {detail.vrfValue === 0n ? "—" : vrfHex}
          </div>
        </div>
      </div>
      {noMinerData ? (
        <div className="text-muted-foreground text-[10px] uppercase tracking-widest">
          No miner data available for this block.
        </div>
      ) : detail.minerParticipants.length > 0 ? (
        <div>
          <div className="text-muted-foreground uppercase tracking-widest text-[9px] mb-1.5">
            Miner Breakdown
          </div>
          <div className="space-y-1">
            {detail.minerParticipants.map(([minerId, principal]) => {
              const grit = gritByMiner.get(minerId.toString()) ?? 0n;
              const weight = weightByMiner.get(minerId.toString()) ?? 0;
              const isWinner =
                detail.winnerMinerId?.toString() === minerId.toString();
              return (
                <div
                  key={minerId.toString()}
                  className={[
                    "grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center px-2 py-1 border",
                    isWinner
                      ? "border-[#00ff41]/40 bg-[#00ff41]/5"
                      : "border-border/30 bg-card",
                  ].join(" ")}
                >
                  <span
                    className={
                      isWinner ? "text-[#00ff41]" : "text-muted-foreground"
                    }
                  >
                    {isWinner ? "★" : "·"}
                  </span>
                  <span className="text-muted-foreground truncate">
                    #{minerId.toString()} ·{" "}
                    {truncateAddress(principal.toText(), 6)}
                  </span>
                  <span className="text-foreground tabular-nums">
                    {(Number(grit) / 1_000_000_000).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    B
                  </span>
                  <span className="text-[#00ff41]/70 tabular-nums w-10 text-right">
                    {(weight * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground text-[10px] uppercase tracking-widest">
          No miner data available for this block.
        </div>
      )}
    </div>
  );
}

function formatGritSpent(amount: bigint): string {
  const num = Number(amount) / 1_000_000_000;
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleString();
}

function BlockRow({ block, index }: { block: BlockRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      key={Number(block.blockNumber)}
      className="border-b border-border/50 last:border-0"
      data-ocid={`blocks_history.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left grid grid-cols-[3.5rem_1fr_1fr_1fr_1fr_1.5rem] gap-2 px-3 sm:px-4 py-2.5 text-xs font-mono items-center hover:bg-muted/10 transition-colors min-w-[540px]"
      >
        <span className="text-accent font-bold tabular-nums">
          #{Number(block.blockNumber)}
        </span>
        <span
          className="text-foreground truncate"
          title={block.winnerOwner?.toText()}
        >
          {block.winnerOwner ? (
            truncateAddress(block.winnerOwner.toText())
          ) : (
            <span className="text-muted-foreground">No winner</span>
          )}
        </span>
        <span className="text-accent font-bold text-right">
          {formatAkk(block.akkReward)} AKK
        </span>
        <span className="text-white text-right">
          {formatGritSpent(block.totalGritSpent)} B
        </span>
        <span className="text-muted-foreground text-right">
          {formatTimestamp(block.timestamp)}
        </span>
        {expanded ? (
          <ChevronUp className="h-3 w-3 text-muted-foreground ml-auto" />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
        )}
      </button>
      {expanded && <BlockDetailPanel blockNumber={block.blockNumber} />}
    </div>
  );
}

export function BlocksHistoryPage() {
  const [page, setPage] = useState(0n);
  const [searchInput, setSearchInput] = useState("");
  const [searchBlockNum, setSearchBlockNum] = useState<bigint | null>(null);

  const { data: blocks = [], isLoading } = useGetBlockHistoryPage(page, 10n);
  const { data: totalBlocks = 0n } = useGetTotalBlockCount();
  const { data: searchDetail, isLoading: searchLoading } =
    useBlockDetails(searchBlockNum);

  const totalPages =
    totalBlocks === 0n ? 0 : Math.max(1, Math.ceil(Number(totalBlocks) / 10));

  const sorted = [...blocks].sort((a, b) =>
    Number(b.blockNumber - a.blockNumber),
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    try {
      const parsed = BigInt(trimmed);
      if (parsed < 0n) {
        setSearchBlockNum(null);
        return;
      }
      setSearchBlockNum(parsed);
    } catch {
      setSearchBlockNum(null);
      return;
    }
  }

  function handleClear() {
    setSearchInput("");
    setSearchBlockNum(null);
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      data-ocid="blocks_history.page"
    >
      {/* Page header */}
      <div>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
          <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
          BLOCK HISTORY
        </h1>
        <p className="text-white text-sm mt-1">
          Explore the Anti Krisis consensus protocol.
        </p>
      </div>

      {/* Table */}
      <Card className="bg-card border-border" data-ocid="blocks_history.card">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="font-display text-[1.3rem] uppercase tracking-widest text-white">
              VIEW BLOCK DETAILS
            </CardTitle>
            {/* Search by block number — inside table border */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by block number..."
                  className="border border-border bg-input text-foreground font-mono pl-7 pr-2 py-1 w-full sm:w-48 rounded-none text-xs placeholder:text-muted-foreground focus:ring-1 focus:ring-accent focus:outline-none"
                  data-ocid="blocks_history.search_input"
                />
              </div>
              <button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/80 px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-smooth"
                data-ocid="blocks_history.search_button"
              >
                Search
              </button>
              {searchBlockNum !== null && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-smooth flex items-center gap-1"
                  data-ocid="blocks_history.clear_button"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </form>
          </div>

          {/* Search result — shown directly under search form */}
          {searchLoading && (
            <div className="text-xs font-mono text-muted-foreground animate-pulse pt-2">
              Loading block details…
            </div>
          )}
          {searchBlockNum !== null && !searchLoading && !searchDetail && (
            <div
              className="text-xs font-mono text-muted-foreground pt-2"
              data-ocid="blocks_history.search_not_found"
            >
              Block #{searchBlockNum.toString()} not found.
            </div>
          )}
          {searchBlockNum !== null && !searchLoading && searchDetail && (
            <div
              className="border border-[#00ff41]/30 bg-[#00ff41]/5 mt-2"
              data-ocid="blocks_history.search_result"
            >
              <BlockDetailPanel blockNumber={searchBlockNum} />
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0 px-0">
          {/* Scrollable table wrapper for mobile */}
          <div className="overflow-x-auto">
            {/* Header row */}
            <div className="grid grid-cols-[3.5rem_1fr_1fr_1fr_1fr_1.5rem] gap-2 px-3 sm:px-4 py-2 border-b border-border text-xs font-mono uppercase tracking-widest text-white min-w-[540px]">
              <span>Block</span>
              <span>Winner</span>
              <span className="text-right">AKK Reward</span>
              <span className="text-right">GRIT Spent</span>
              <span className="text-right">Time</span>
            </div>

            {isLoading ? (
              <div className="space-y-1 px-4 pt-2 min-w-[540px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-9 w-full bg-muted" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div
                className="py-12 text-center text-muted-foreground text-sm font-mono"
                data-ocid="blocks_history.empty_state"
              >
                No blocks mined yet. Mining starts once a miner is active.
              </div>
            ) : (
              <div data-ocid="blocks_history.list" className="min-w-[540px]">
                {sorted.map((block, i) => (
                  <BlockRow
                    key={Number(block.blockNumber)}
                    block={block}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div
        className="flex items-center justify-between border border-border bg-card px-3 sm:px-4 py-3"
        data-ocid="blocks_history.pagination"
      >
        <button
          type="button"
          onClick={() => setPage((p) => p - 1n)}
          disabled={page === 0n || totalPages === 0}
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth"
          data-ocid="blocks_history.pagination_prev"
        >
          ← PREV
        </button>
        <span className="text-xs font-mono text-muted-foreground">
          PAGE {Number(page) + 1} OF {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1n)}
          disabled={
            totalPages === 0 || page === BigInt(Math.max(0, totalPages - 1))
          }
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth"
          data-ocid="blocks_history.pagination_next"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
