import { u as useAuth, a as useNavigate, b as useMyBalance, c as useMyClaimHistory, d as useGetTokens, e as useGetGritIssuanceRate, r as reactExports, C as ClaimStatus, i as isPendingFee, g as getClaimStatus, j as jsxRuntimeExports, B as Button, R as RefreshCw, S as Skeleton, f as formatGrit, h as formatUSDValue, I as Input, k as CHAIN_LABELS, L as Link, t as truncateAddress, l as useWallet, m as useGetFeePercent, n as useGetFeeRecipient, o as useRetryFeeClaim, p as useRecheckClaim } from "./index-DqUaPUte.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CTPRiq2U.js";
import { F as Flame, E as ExternalLink } from "./flame-B1MJKGpB.js";
import { Z as Zap } from "./zap-DN51KW58.js";
import { S as Search } from "./search-CnvYeMNj.js";
import "./chevron-up-DAT-e9aa.js";
const EXPLORER_BASE = {
  ethereum: "https://etherscan.io/tx",
  arbitrum: "https://arbiscan.io/tx",
  polygon: "https://polygonscan.com/tx",
  optimism: "https://optimistic.etherscan.io/tx",
  base: "https://basescan.org/tx"
};
function explorerUrl(chain, txHash) {
  const base = EXPLORER_BASE[chain] ?? "https://etherscan.io/tx";
  return `${base}/${txHash}`;
}
function formatGritFull(amount) {
  return Number(amount).toLocaleString("en-US");
}
function StatusBadge({ claim }) {
  const { color, label } = getClaimStatus(claim.status);
  const styles = {
    pending: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 animate-pulse",
    verified: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    failed: "border-red-500/40 bg-red-500/10 text-red-400",
    pending_fee: "border-amber-500/40 bg-amber-500/10 text-amber-400 animate-pulse"
  };
  const displayLabel = color === "pending" ? "Confirming…" : color === "verified" ? "Confirmed" : color === "pending_fee" ? "Fee Failed" : label;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-1.5 py-0.5 border font-mono text-[10px] tracking-widest uppercase ${styles[color] ?? ""}`,
      children: displayLabel
    }
  );
}
function StatCard({
  label,
  value,
  sub,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bg-card border ${accent ? "border-accent/40" : "border-border"} p-4 flex flex-col gap-1`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-white", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono text-xl font-bold ${accent ? "text-accent" : "text-foreground"}`,
            children: value
          }
        ),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: sub })
      ]
    }
  );
}
function RowSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: Array.from({ length: 7 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-muted/60" }) }, `skeleton-cell-col${i + 1}`)) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-16 gap-4",
      "data-ocid": "dashboard.claims.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 border border-accent/30 bg-accent/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-6 w-6 text-accent/60" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground mb-1", children: "No burns recorded yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground", children: "Burn your first ERC-20 tokens to earn GRIT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-2 border-accent/40 text-accent hover:bg-accent/10 font-mono text-xs uppercase tracking-widest",
            "data-ocid": "dashboard.claims.burn_cta_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }),
              "Start Burning"
            ]
          }
        ) })
      ]
    }
  ) }) });
}
function LoginPrompt() {
  const { login, isLoading } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center min-h-[60vh] gap-6",
      "data-ocid": "dashboard.login_prompt",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border border-accent/30 bg-accent/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-7 w-7 text-accent energy-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xl text-foreground mb-2", children: "Authentication Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground", children: "Connect your Internet Identity to view your GRIT balance and claim history." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: login,
            disabled: isLoading,
            className: "gap-2 bg-accent text-accent-foreground hover:bg-accent/80 font-mono text-xs uppercase tracking-widest transition-smooth",
            "data-ocid": "dashboard.login_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
              isLoading ? "Connecting…" : "Login with Internet Identity"
            ]
          }
        )
      ]
    }
  );
}
function ClaimRow({
  claim,
  idx,
  tokenMap,
  recheckAttempts,
  onRecheckAttempt,
  tick
}) {
  const date = new Date(Number(claim.timestamp / BigInt(1e6)));
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const chainLabel = CHAIN_LABELS[claim.chain] ?? claim.chain;
  const pos = idx + 1;
  const tokenInfo = tokenMap.get(claim.tokenAddress.toLowerCase());
  const tokenLabel = (tokenInfo == null ? void 0 : tokenInfo.symbol) ?? truncateAddress(claim.tokenAddress, 6);
  const rawFloat = Number(claim.amountBurned);
  const humanAmount = rawFloat === 0 ? "0" : rawFloat < 1e-3 ? rawFloat.toExponential(2) : rawFloat.toLocaleString(void 0, { maximumFractionDigits: 6 });
  const wallet = useWallet();
  const { data: feePercent } = useGetFeePercent();
  const { data: feeRecipient } = useGetFeeRecipient();
  const retryFeeClaim = useRetryFeeClaim();
  const recheckClaim = useRecheckClaim();
  const [retrying, setRetrying] = reactExports.useState(false);
  const [retryError, setRetryError] = reactExports.useState("");
  const [retrySuccess, setRetrySuccess] = reactExports.useState(false);
  const [rechecking, setRechecking] = reactExports.useState(false);
  const [recheckMsg, setRecheckMsg] = reactExports.useState("");
  const feeRate = feePercent != null ? feePercent / 100 : 69e-4;
  const claimIsPendingFee = isPendingFee(claim.status);
  const claimNeedsRecheck = claim.status === ClaimStatus.pending || getClaimStatus(claim.status).color === "failed";
  const attemptState = recheckAttempts[claim.txHash];
  const now = Date.now();
  const inCooldown = (attemptState == null ? void 0 : attemptState.cooldownUntil) != null && now < attemptState.cooldownUntil;
  const remainingMs = inCooldown ? Math.max(0, ((attemptState == null ? void 0 : attemptState.cooldownUntil) ?? 0) - now) : 0;
  const remainingMM = String(Math.floor(remainingMs / 6e4)).padStart(2, "0");
  const remainingSS = String(Math.floor(remainingMs % 6e4 / 1e3)).padStart(
    2,
    "0"
  );
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
      setTimeout(() => setRecheckMsg(""), 2e3);
    }
  }
  async function handleRetryFee() {
    if (!feeRecipient || !wallet.isConnected) return;
    setRetrying(true);
    setRetryError("");
    try {
      const chainId = claim.chain === "celo" ? 42220 : claim.chain === "optimism" ? 10 : claim.chain === "base" ? 8453 : 1;
      const newFeeHash = await wallet.sendPlatformFee(
        Number(claim.amountBurned),
        chainId,
        feeRecipient,
        feeRate
      );
      await retryFeeClaim.mutateAsync({
        txHash: claim.txHash,
        feeTxHash: newFeeHash
      });
      setRetrySuccess(true);
    } catch (err) {
      setRetryError(err instanceof Error ? err.message : "Fee retry failed.");
    } finally {
      setRetrying(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border hover:bg-muted/20 transition-colors duration-150",
      "data-ocid": `dashboard.claims.item.${pos}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground font-semibold", children: tokenLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: chainLabel })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: humanAmount }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: formatUSDValue(claim.usdValue ?? 0) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-accent font-bold", children: [
          "+",
          formatGrit(claim.gritMinted)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { claim }),
          claimIsPendingFee && !retrySuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleRetryFee,
                disabled: retrying || !wallet.isConnected,
                className: "inline-flex items-center gap-1 px-2 py-1 border border-amber-500/50 bg-amber-500/10 text-amber-300 font-mono text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-colors disabled:opacity-50",
                "data-ocid": `dashboard.claims.retry_fee_button.${pos}`,
                children: retrying ? "Sending…" : "Retry Fee"
              }
            ),
            retryError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-[10px] text-red-400",
                "data-ocid": `dashboard.claims.retry_fee_error.${pos}`,
                children: retryError
              }
            )
          ] }),
          retrySuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[10px] text-emerald-400",
              "data-ocid": `dashboard.claims.retry_fee_success.${pos}`,
              children: "Fee paid ✓"
            }
          ),
          claimNeedsRecheck && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleRecheck,
                disabled: rechecking || !wallet.address || inCooldown,
                className: `inline-flex items-center gap-1 px-2 py-1 border font-mono text-[10px] uppercase tracking-widest transition-colors ${inCooldown ? "border-border bg-muted/20 text-muted-foreground cursor-not-allowed opacity-60" : "border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20 disabled:opacity-50"}`,
                "data-ocid": `dashboard.claims.recheck_button.${pos}`,
                children: inCooldown ? `Wait ${remainingMM}:${remainingSS}` : rechecking ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-2.5 w-2.5 animate-spin" }),
                  "Checking…"
                ] }) : "Re-check Tx"
              }
            ),
            recheckMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono text-[10px] ${recheckMsg.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`,
                "data-ocid": `dashboard.claims.recheck_msg.${pos}`,
                children: recheckMsg
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: dateStr }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: timeStr })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: explorerUrl(claim.chain, claim.txHash),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-accent/80 transition-smooth",
            "data-ocid": `dashboard.claims.tx_link.${pos}`,
            children: [
              truncateAddress(claim.txHash, 8),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 shrink-0" })
            ]
          }
        ) })
      ]
    }
  );
}
function BurnHistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance
  } = useMyBalance();
  const {
    data: claims,
    isLoading: claimsLoading,
    refetch: refetchClaims
  } = useMyClaimHistory();
  const { data: tokens } = useGetTokens();
  const { data: gritIssuanceRate, isLoading: issuanceLoading } = useGetGritIssuanceRate();
  const tokenMap = reactExports.useMemo(
    () => new Map(
      (tokens ?? []).map((t) => [t.tokenAddress.toLowerCase(), t])
    ),
    [tokens]
  );
  const [chainFilter, setChainFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [currentPage, setCurrentPage] = reactExports.useState(0);
  const PAGE_SIZE = 10;
  const [recheckAttempts, setRecheckAttempts] = reactExports.useState({});
  const [tick, setTick] = reactExports.useState(0);
  const tickIntervalRef = reactExports.useRef(null);
  const hasActiveCooldown = reactExports.useMemo(() => {
    const now = Date.now();
    return Object.values(recheckAttempts).some(
      (s) => s.cooldownUntil != null && now < s.cooldownUntil
    );
  }, [recheckAttempts]);
  reactExports.useEffect(() => {
    if (hasActiveCooldown) {
      if (!tickIntervalRef.current) {
        tickIntervalRef.current = setInterval(() => {
          setTick((t) => t + 1);
        }, 1e3);
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
  const handleRecheckAttempt = reactExports.useCallback((txHash) => {
    setRecheckAttempts((prev) => {
      const existing = prev[txHash];
      const now = Date.now();
      if ((existing == null ? void 0 : existing.cooldownUntil) != null && now >= existing.cooldownUntil) {
        return {
          ...prev,
          [txHash]: { count: 1, lastAttemptAt: now, cooldownUntil: null }
        };
      }
      const newCount = ((existing == null ? void 0 : existing.count) ?? 0) + 1;
      const cooldownUntil = newCount >= 3 ? now + 30 * 60 * 1e3 : (existing == null ? void 0 : existing.cooldownUntil) ?? null;
      return {
        ...prev,
        [txHash]: { count: newCount, lastAttemptAt: now, cooldownUntil }
      };
    });
  }, []);
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, authLoading, navigate]);
  const hasPending = reactExports.useMemo(
    () => (claims ?? []).some(
      (c) => c.status === ClaimStatus.pending || isPendingFee(c.status)
    ),
    [claims]
  );
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      refetchBalance();
      refetchClaims();
    }, 1e4);
    return () => clearInterval(id);
  }, [refetchBalance, refetchClaims]);
  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([refetchBalance(), refetchClaims()]);
    setRefreshing(false);
  }
  reactExports.useEffect(() => {
    setCurrentPage(0);
  }, [chainFilter, statusFilter, searchQuery]);
  const filtered = reactExports.useMemo(() => {
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
    (currentPage + 1) * PAGE_SIZE
  );
  const totalGrit = reactExports.useMemo(
    () => (claims ?? []).reduce((acc, c) => acc + c.gritMinted, BigInt(0)),
    [claims]
  );
  const totalBurnsCount = (claims ?? []).length;
  const pendingCount = (claims ?? []).filter(
    (c) => c.status === ClaimStatus.pending || isPendingFee(c.status)
  ).length;
  const totalUsdBurned = reactExports.useMemo(
    () => (claims ?? []).reduce((acc, c) => acc + (c.usdValue ?? 0), 0),
    [claims]
  );
  if (!isAuthenticated && !authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", "data-ocid": "dashboard.page", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, {}) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-7xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-7 w-7 sm:h-8 sm:w-8 text-accent" }),
              "BURN HISTORY"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm mt-1 break-words", children: "Your GRIT balance and burn history" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleRefresh,
              disabled: refreshing || claimsLoading,
              className: "gap-1.5 border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth",
              "data-ocid": "dashboard.refresh_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`
                  }
                ),
                "Refresh"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-accent/40 p-6 relative overflow-hidden",
            "data-ocid": "dashboard.balance.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_3px)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col sm:flex-row sm:items-center gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent energy-pulse" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-white", children: "GRIT Balance" }),
                    hasPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-yellow-400 animate-pulse border border-yellow-500/30 px-1.5 py-0.5", children: "Live Updating" })
                  ] }),
                  balanceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Skeleton,
                    {
                      className: "h-12 w-64 bg-muted/60",
                      "data-ocid": "dashboard.balance.loading_state"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-mono font-bold leading-none",
                      "data-ocid": "dashboard.balance.value",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[1.18rem] sm:text-[1.47rem] text-accent", children: formatGritFull(balance ?? BigInt(0)) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl text-accent/60 ml-2", children: "GRIT" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-background/60 p-3 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-white", children: "Issuance Rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground font-bold mt-1", children: issuanceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "…" }) : `${Number(gritIssuanceRate ?? BigInt(1e11)).toLocaleString("en-US")} GRIT` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "per $1.00 of token burned" })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
            "data-ocid": "dashboard.stats.section",
            children: claimsLoading ? Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Skeleton,
              {
                className: "h-20 bg-muted/60"
              },
              `stat-skeleton-${i + 1}`
            )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Burn Claims",
                  value: totalBurnsCount.toString(),
                  sub: pendingCount > 0 ? `${pendingCount} verifying` : "all time"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total GRIT Earned",
                  value: formatGrit(totalGrit),
                  sub: "cumulative",
                  accent: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "USD Value Burned",
                  value: formatUSDValue(totalUsdBurned),
                  sub: "approximate"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border",
            "data-ocid": "dashboard.claims.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-mono text-xs uppercase tracking-widest text-foreground", children: "Claim History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:ml-auto flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "text",
                        placeholder: "Search tx hash…",
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        className: "pl-7 h-7 w-full sm:w-44 font-mono text-xs bg-background border-border focus-visible:ring-accent",
                        "data-ocid": "dashboard.search_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: chainFilter, onValueChange: setChainFilter, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-7 w-32 font-mono text-xs border-border focus:ring-accent bg-background",
                        "data-ocid": "dashboard.chain_filter.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Chain" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border font-mono text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All chains" }),
                      Object.entries(CHAIN_LABELS).map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: key, children: label }, key))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-7 w-32 font-mono text-xs border-border focus:ring-accent bg-background",
                        "data-ocid": "dashboard.status_filter.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border font-mono text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Verifying" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "verified", children: "Confirmed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "failed", children: "Failed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending_fee", children: "Fee Pending" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", "data-ocid": "dashboard.claims.table", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-background/40", children: [
                  "Token",
                  "Amount Burned",
                  "USD Value",
                  "GRIT Received",
                  "Status",
                  "Date",
                  "Tx Hash"
                ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "text-left px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white whitespace-nowrap",
                    children: col
                  },
                  col
                )) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: claimsLoading ? Array.from({ length: 4 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RowSkeleton, {}, `row-skel-${i + 1}`)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : pagedClaims.map((claim, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ClaimRow,
                  {
                    claim,
                    idx: currentPage * PAGE_SIZE + idx,
                    tokenMap,
                    recheckAttempts,
                    onRecheckAttempt: handleRecheckAttempt,
                    tick
                  },
                  `${claim.txHash}-${idx}`
                )) })
              ] }) }),
              !claimsLoading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground sm:flex-1", children: [
                  filtered.length,
                  " record",
                  filtered.length !== 1 ? "s" : "",
                  filtered.length !== totalBurnsCount && ` (filtered from ${totalBurnsCount})`
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between sm:justify-end gap-4",
                    "data-ocid": "burn_history.pagination",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setCurrentPage((p) => Math.max(0, p - 1)),
                          disabled: currentPage === 0,
                          className: "text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth",
                          "data-ocid": "burn_history.pagination_prev",
                          children: "← PREV"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                        "PAGE ",
                        currentPage + 1,
                        " OF ",
                        totalPages
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1)),
                          disabled: currentPage >= totalPages - 1,
                          className: "text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth",
                          "data-ocid": "burn_history.pagination_next",
                          children: "NEXT →"
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  BurnHistoryPage
};
