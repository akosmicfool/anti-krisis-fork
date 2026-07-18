import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Flame, RefreshCw, Search, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import {
  useGetFeePercent,
  useGetFeeRecipient,
  useGetGritIssuanceRate,
  useGetTokens,
  useMyBalance,
  useMyClaimHistory,
  useRecheckClaim,
  useRetryFeeClaim,
} from "../hooks/use-backend";
import { useWallet } from "../hooks/use-wallet";
import {
  type AllowlistedToken,
  CHAIN_LABELS,
  type ClaimRecord,
  ClaimStatus,
  formatGrit,
  formatUSDValue,
  getClaimStatus,
  isPendingFee,
  truncateAddress,
} from "../types";

// ─── Block explorer URLs ──────────────────────────────────────────────────────
const EXPLORER_BASE: Record<string, string> = {
  ethereum: "https://etherscan.io/tx",
  arbitrum: "https://arbiscan.io/tx",
  polygon: "https://polygonscan.com/tx",
  optimism: "https://optimistic.etherscan.io/tx",
  base: "https://basescan.org/tx",
};

function explorerUrl(chain: string, txHash: string) {
  const base = EXPLORER_BASE[chain] ?? "https://etherscan.io/tx";
  return `${base}/${txHash}`;
}

function formatGritFull(amount: bigint): string {
  return Number(amount).toLocaleString("en-US");
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ claim }: { claim: ClaimRecord }) {
  const { color, label } = getClaimStatus(claim.status);
  const styles: Record<string, string> = {
    pending:
      "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 animate-pulse",
    verified: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    failed: "border-red-500/40 bg-red-500/10 text-red-400",
    pending_fee:
      "border-amber-500/40 bg-amber-500/10 text-amber-400 animate-pulse",
  };
  const displayLabel =
    color === "pending"
      ? "Confirming…"
      : color === "verified"
        ? "Confirmed"
        : color === "pending_fee"
          ? "Fee Failed"
          : label;
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 border font-mono text-[10px] tracking-widest uppercase ${styles[color] ?? ""}`}
    >
      {displayLabel}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-card border ${accent ? "border-accent/40" : "border-border"} p-4 flex flex-col gap-1`}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-white">
        {label}
      </span>
      <span
        className={`font-mono text-xl font-bold ${accent ? "text-accent" : "text-foreground"}`}
      >
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[10px] text-muted-foreground">
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: 7 }, (_, i) => (
        <td key={`skeleton-cell-col${i + 1}`} className="px-3 py-3">
          <Skeleton className="h-4 w-full bg-muted/60" />
        </td>
      ))}
    </tr>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <tr>
      <td colSpan={7}>
        <div
          className="flex flex-col items-center justify-center py-16 gap-4"
          data-ocid="dashboard.claims.empty_state"
        >
          <div className="w-14 h-14 border border-accent/30 bg-accent/5 flex items-center justify-center">
            <Flame className="h-6 w-6 text-accent/60" />
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground mb-1">
              No burns recorded yet
            </p>
            <p className="font-body text-sm text-muted-foreground">
              Burn your first ERC-20 tokens to earn GRIT
            </p>
          </div>
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-accent/40 text-accent hover:bg-accent/10 font-mono text-xs uppercase tracking-widest"
              data-ocid="dashboard.claims.burn_cta_button"
            >
              <Flame className="h-3.5 w-3.5" />
              Start Burning
            </Button>
          </Link>
        </div>
      </td>
    </tr>
  );
}

// ─── Login Prompt ─────────────────────────────────────────────────────────────
function LoginPrompt() {
  const { login, isLoading } = useAuth();
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      data-ocid="dashboard.login_prompt"
    >
      <div className="w-16 h-16 border border-accent/30 bg-accent/5 flex items-center justify-center">
        <Zap className="h-7 w-7 text-accent energy-pulse" />
      </div>
      <div className="text-center max-w-sm">
        <h2 className="font-display font-semibold text-xl text-foreground mb-2">
          Authentication Required
        </h2>
        <p className="font-body text-sm text-muted-foreground">
          Connect your Internet Identity to view your GRIT balance and claim
          history.
        </p>
      </div>
      <Button
        onClick={login}
        disabled={isLoading}
        className="gap-2 bg-accent text-accent-foreground hover:bg-accent/80 font-mono text-xs uppercase tracking-widest transition-smooth"
        data-ocid="dashboard.login_button"
      >
        <Zap className="h-3.5 w-3.5" />
        {isLoading ? "Connecting…" : "Login with Internet Identity"}
      </Button>
    </div>
  );
}

// ─── Recheck attempt tracking ────────────────────────────────────────────────
interface RecheckAttemptState {
  count: number;
  lastAttemptAt: number;
  cooldownUntil: number | null;
}

// ─── Claim Row ─────────────────────────────────────────────────────────────────
function ClaimRow({
  claim,
  idx,
  tokenMap,
  recheckAttempts,
  onRecheckAttempt,
  tick,
}: {
  claim: ClaimRecord;
  idx: number;
  tokenMap: Map<string, AllowlistedToken>;
  recheckAttempts: Record<string, RecheckAttemptState>;
  onRecheckAttempt: (txHash: string) => void;
  tick: number;
}) {
  const date = new Date(Number(claim.timestamp / BigInt(1_000_000)));
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const chainLabel = CHAIN_LABELS[claim.chain] ?? claim.chain;
  const pos = idx + 1;

  const tokenInfo = tokenMap.get(claim.tokenAddress.toLowerCase());
  const tokenLabel =
    tokenInfo?.symbol ?? truncateAddress(claim.tokenAddress, 6);

  const rawFloat = Number(claim.amountBurned);
  const humanAmount =
    rawFloat === 0
      ? "0"
      : rawFloat < 0.001
        ? rawFloat.toExponential(2)
        : rawFloat.toLocaleString(undefined, { maximumFractionDigits: 6 });

  // Retry fee state for this row
  const wallet = useWallet();
  const { data: feePercent } = useGetFeePercent();
  const { data: feeRecipient } = useGetFeeRecipient();
  const retryFeeClaim = useRetryFeeClaim();
  const recheckClaim = useRecheckClaim();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");
  const [retrySuccess, setRetrySuccess] = useState(false);
  const [rechecking, setRechecking] = useState(false);
  const [recheckMsg, setRecheckMsg] = useState("");
  const feeRate = feePercent != null ? feePercent / 100 : 0.0069;
  const claimIsPendingFee = isPendingFee(claim.status);
  const claimNeedsRecheck =
    claim.status === ClaimStatus.pending ||
    getClaimStatus(claim.status).color === "failed";

  // Cooldown state for this claim
  const attemptState = recheckAttempts[claim.txHash];
  const now = Date.now();
  const inCooldown =
    attemptState?.cooldownUntil != null && now < attemptState.cooldownUntil;
  const remainingMs = inCooldown
    ? Math.max(0, (attemptState?.cooldownUntil ?? 0) - now)
    : 0;
  const remainingMM = String(Math.floor(remainingMs / 60000)).padStart(2, "0");
  const remainingSS = String(Math.floor((remainingMs % 60000) / 1000)).padStart(
    2,
    "0",
  );
  // tick is used to re-render the countdown every second
  void tick;

  async function handleRecheck() {
    if (inCooldown) return;
    onRecheckAttempt(claim.txHash);
    setRechecking(true);
    setRecheckMsg("");
    try {
      await recheckClaim.mutateAsync(claim.txHash);
      setRecheckMsg("✓ Re-checked");
    } catch (err) {
      setRecheckMsg(err instanceof Error ? err.message : "Re-check failed.");
    } finally {
      setRechecking(false);
      setTimeout(() => setRecheckMsg(""), 2000);
    }
  }

  async function handleRetryFee() {
    if (!feeRecipient || !wallet.isConnected) return;
    setRetrying(true);
    setRetryError("");
    try {
      const chainId =
        claim.chain === "celo"
          ? 42220
          : claim.chain === "optimism"
            ? 10
            : claim.chain === "base"
              ? 8453
              : 1;
      const newFeeHash = await wallet.sendPlatformFee(
        Number(claim.amountBurned),
        chainId,
        feeRecipient,
        feeRate,
      );
      await retryFeeClaim.mutateAsync({
        txHash: claim.txHash,
        feeTxHash: newFeeHash,
      });
      setRetrySuccess(true);
    } catch (err) {
      setRetryError(err instanceof Error ? err.message : "Fee retry failed.");
    } finally {
      setRetrying(false);
    }
  }

  return (
    <tr
      className="border-b border-border hover:bg-muted/20 transition-colors duration-150"
      data-ocid={`dashboard.claims.item.${pos}`}
    >
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-foreground font-semibold">
            {tokenLabel}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            {chainLabel}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="font-mono text-xs text-foreground">{humanAmount}</span>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="font-mono text-xs text-foreground">
          {formatUSDValue(claim.usdValue ?? 0)}
        </span>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="font-mono text-xs text-accent font-bold">
          +{formatGrit(claim.gritMinted)}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1.5">
          <StatusBadge claim={claim} />
          {claimIsPendingFee && !retrySuccess && (
            <>
              <button
                type="button"
                onClick={handleRetryFee}
                disabled={retrying || !wallet.isConnected}
                className="inline-flex items-center gap-1 px-2 py-1 border border-amber-500/50 bg-amber-500/10 text-amber-300 font-mono text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                data-ocid={`dashboard.claims.retry_fee_button.${pos}`}
              >
                {retrying ? "Sending…" : "Retry Fee"}
              </button>
              {retryError && (
                <p
                  className="font-mono text-[10px] text-red-400"
                  data-ocid={`dashboard.claims.retry_fee_error.${pos}`}
                >
                  {retryError}
                </p>
              )}
            </>
          )}
          {retrySuccess && (
            <span
              className="font-mono text-[10px] text-emerald-400"
              data-ocid={`dashboard.claims.retry_fee_success.${pos}`}
            >
              Fee paid ✓
            </span>
          )}
          {claimNeedsRecheck && (
            <>
              <button
                type="button"
                onClick={handleRecheck}
                disabled={rechecking || !wallet.address || inCooldown}
                className={`inline-flex items-center gap-1 px-2 py-1 border font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  inCooldown
                    ? "border-border bg-muted/20 text-muted-foreground cursor-not-allowed opacity-60"
                    : "border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20 disabled:opacity-50"
                }`}
                data-ocid={`dashboard.claims.recheck_button.${pos}`}
              >
                {inCooldown ? (
                  `Wait ${remainingMM}:${remainingSS}`
                ) : rechecking ? (
                  <>
                    <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                    Checking…
                  </>
                ) : (
                  "Re-check Tx"
                )}
              </button>
              {recheckMsg && (
                <p
                  className={`font-mono text-[10px] ${
                    recheckMsg.startsWith("✓")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                  data-ocid={`dashboard.claims.recheck_msg.${pos}`}
                >
                  {recheckMsg}
                </p>
              )}
            </>
          )}
        </div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-foreground">{dateStr}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {timeStr}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <a
          href={explorerUrl(claim.chain, claim.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-accent/80 transition-smooth"
          data-ocid={`dashboard.claims.tx_link.${pos}`}
        >
          {truncateAddress(claim.txHash, 8)}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      </td>
    </tr>
  );
}

// ─── Burn History Page ───────────────────────────────────────────────────────────
export function BurnHistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useMyBalance();
  const {
    data: claims,
    isLoading: claimsLoading,
    refetch: refetchClaims,
  } = useMyClaimHistory();
  const { data: tokens } = useGetTokens();
  const { data: gritIssuanceRate, isLoading: issuanceLoading } =
    useGetGritIssuanceRate();

  // Build a lowercase-address → token lookup for symbol + decimals resolution
  const tokenMap = useMemo(
    () =>
      new Map<string, AllowlistedToken>(
        (tokens ?? []).map((t) => [t.tokenAddress.toLowerCase(), t]),
      ),
    [tokens],
  );

  const [chainFilter, setChainFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 10;

  // Per-claim recheck cooldown tracking (in-memory only, no localStorage)
  const [recheckAttempts, setRecheckAttempts] = useState<
    Record<string, RecheckAttemptState>
  >({});
  // Tick counter for real-time countdown rendering (increments every second)
  const [tick, setTick] = useState(0);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop the 1-second tick only while at least one claim is in cooldown
  const hasActiveCooldown = useMemo(() => {
    const now = Date.now();
    return Object.values(recheckAttempts).some(
      (s) => s.cooldownUntil != null && now < s.cooldownUntil,
    );
  }, [recheckAttempts]);

  useEffect(() => {
    if (hasActiveCooldown) {
      if (!tickIntervalRef.current) {
        tickIntervalRef.current = setInterval(() => {
          setTick((t) => t + 1);
        }, 1000);
      }
    } else {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    }
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [hasActiveCooldown]);

  const handleRecheckAttempt = useCallback((txHash: string) => {
    setRecheckAttempts((prev) => {
      const existing = prev[txHash];
      const now = Date.now();

      // If cooldown has expired, reset and start fresh
      if (existing?.cooldownUntil != null && now >= existing.cooldownUntil) {
        return {
          ...prev,
          [txHash]: { count: 1, lastAttemptAt: now, cooldownUntil: null },
        };
      }

      const newCount = (existing?.count ?? 0) + 1;
      const cooldownUntil =
        newCount >= 3
          ? now + 30 * 60 * 1000
          : (existing?.cooldownUntil ?? null);

      return {
        ...prev,
        [txHash]: { count: newCount, lastAttemptAt: now, cooldownUntil },
      };
    });
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Track pending/pendingFee claims for the "Live Updating" badge.
  const hasPending = useMemo(
    () =>
      (claims ?? []).some(
        (c) => c.status === ClaimStatus.pending || isPendingFee(c.status),
      ),
    [claims],
  );

  // Always poll claims every 10s so the dashboard stays live after a burn
  // regardless of whether the user has pending claims when the page loads.
  // The balance is already polled by useMyBalance's own refetchInterval.
  useEffect(() => {
    const id = setInterval(() => {
      refetchBalance();
      refetchClaims();
    }, 10_000);
    return () => clearInterval(id);
  }, [refetchBalance, refetchClaims]);

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([refetchBalance(), refetchClaims()]);
    setRefreshing(false);
  }

  // Reset to page 0 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter change
  useEffect(() => {
    setCurrentPage(0);
  }, [chainFilter, statusFilter, searchQuery]);

  // Filtered claims
  const filtered = useMemo(() => {
    const all = claims ?? [];
    return all.filter((c) => {
      if (chainFilter !== "all" && c.chain !== chainFilter) return false;
      if (statusFilter !== "all") {
        const { color } = getClaimStatus(c.status);
        if (statusFilter === "pending_fee") {
          if (!isPendingFee(c.status)) return false;
        } else if (color !== statusFilter) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.txHash.toLowerCase().includes(q);
      }
      return true;
    });
  }, [claims, chainFilter, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedClaims = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  // Stats
  const totalGrit = useMemo(
    () => (claims ?? []).reduce((acc, c) => acc + c.gritMinted, BigInt(0)),
    [claims],
  );
  const totalBurnsCount = (claims ?? []).length;
  const pendingCount = (claims ?? []).filter(
    (c) => c.status === ClaimStatus.pending || isPendingFee(c.status),
  ).length;
  const totalUsdBurned = useMemo(
    () => (claims ?? []).reduce((acc, c) => acc + (c.usdValue ?? 0), 0),
    [claims],
  );

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="dashboard.page">
        <LoginPrompt />
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8 space-y-6"
      data-ocid="dashboard.page"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
            <Flame className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
            BURN HISTORY
          </h1>
          <p className="text-white text-sm mt-1 break-words">
            Your GRIT balance and burn history
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || claimsLoading}
          className="gap-1.5 border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth"
          data-ocid="dashboard.refresh_button"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* ── GRIT Balance Hero ── */}
      <div
        className="bg-card border border-accent/40 p-6 relative overflow-hidden"
        data-ocid="dashboard.balance.card"
      >
        {/* Scanline decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_3px)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-accent energy-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white">
                GRIT Balance
              </span>
              {hasPending && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-400 animate-pulse border border-yellow-500/30 px-1.5 py-0.5">
                  Live Updating
                </span>
              )}
            </div>
            {balanceLoading ? (
              <Skeleton
                className="h-12 w-64 bg-muted/60"
                data-ocid="dashboard.balance.loading_state"
              />
            ) : (
              <div
                className="font-mono font-bold leading-none"
                data-ocid="dashboard.balance.value"
              >
                <span className="text-[1.18rem] sm:text-[1.47rem] text-accent">
                  {formatGritFull(balance ?? BigInt(0))}
                </span>
                <span className="text-2xl text-accent/60 ml-2">GRIT</span>
              </div>
            )}
          </div>
          {/* Rate reference */}
          <div className="border border-border bg-background/60 p-3 shrink-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white">
              Issuance Rate
            </p>
            <p className="font-mono text-sm text-foreground font-bold mt-1">
              {issuanceLoading ? (
                <span className="text-muted-foreground">…</span>
              ) : (
                `${Number(gritIssuanceRate ?? BigInt(100_000_000_000)).toLocaleString("en-US")} GRIT`
              )}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              per $1.00 of token burned
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        data-ocid="dashboard.stats.section"
      >
        {claimsLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton
              key={`stat-skeleton-${i + 1}`}
              className="h-20 bg-muted/60"
            />
          ))
        ) : (
          <>
            <StatCard
              label="Total Burn Claims"
              value={totalBurnsCount.toString()}
              sub={pendingCount > 0 ? `${pendingCount} verifying` : "all time"}
            />
            <StatCard
              label="Total GRIT Earned"
              value={formatGrit(totalGrit)}
              sub="cumulative"
              accent
            />
            <StatCard
              label="USD Value Burned"
              value={formatUSDValue(totalUsdBurned)}
              sub="approximate"
            />
          </>
        )}
      </div>

      {/* ── Claim History ── */}
      <div
        className="bg-card border border-border"
        data-ocid="dashboard.claims.section"
      >
        {/* Table controls */}
        <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground">
            Claim History
          </h2>
          <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search tx hash…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-7 w-full sm:w-44 font-mono text-xs bg-background border-border focus-visible:ring-accent"
                data-ocid="dashboard.search_input"
              />
            </div>
            {/* Chain filter */}
            <Select value={chainFilter} onValueChange={setChainFilter}>
              <SelectTrigger
                className="h-7 w-32 font-mono text-xs border-border focus:ring-accent bg-background"
                data-ocid="dashboard.chain_filter.select"
              >
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border font-mono text-xs">
                <SelectItem value="all">All chains</SelectItem>
                {Object.entries(CHAIN_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="h-7 w-32 font-mono text-xs border-border focus:ring-accent bg-background"
                data-ocid="dashboard.status_filter.select"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border font-mono text-xs">
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Verifying</SelectItem>
                <SelectItem value="verified">Confirmed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending_fee">Fee Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-ocid="dashboard.claims.table">
            <thead>
              <tr className="border-b border-border bg-background/40">
                {[
                  "Token",
                  "Amount Burned",
                  "USD Value",
                  "GRIT Received",
                  "Status",
                  "Date",
                  "Tx Hash",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claimsLoading ? (
                Array.from({ length: 4 }, (_, i) => (
                  <RowSkeleton key={`row-skel-${i + 1}`} />
                ))
              ) : filtered.length === 0 ? (
                <EmptyState />
              ) : (
                pagedClaims.map((claim, idx) => (
                  <ClaimRow
                    key={`${claim.txHash}-${idx}`}
                    claim={claim}
                    idx={currentPage * PAGE_SIZE + idx}
                    tokenMap={tokenMap}
                    recheckAttempts={recheckAttempts}
                    onRecheckAttempt={handleRecheckAttempt}
                    tick={tick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!claimsLoading && filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
            <span className="font-mono text-[10px] text-muted-foreground sm:flex-1">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {filtered.length !== totalBurnsCount &&
                ` (filtered from ${totalBurnsCount})`}
            </span>
            <div
              className="flex items-center justify-between sm:justify-end gap-4"
              data-ocid="burn_history.pagination"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth"
                data-ocid="burn_history.pagination_prev"
              >
                ← PREV
              </button>
              <span className="text-xs font-mono text-muted-foreground">
                PAGE {currentPage + 1} OF {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth"
                data-ocid="burn_history.pagination_next"
              >
                NEXT →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
