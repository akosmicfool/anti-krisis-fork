import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAbandonedMints,
  useGetMintRetryStats,
  useGetPendingMints,
  useGetSupplyVsBalanceAudit,
  useRecalculateTotalAkkMined,
  useRetryMint,
} from "@/hooks/use-backend";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Clock,
  Cpu,
  DollarSign,
  Download,
  Loader2,
  Lock,
  Percent,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCog,
  UserMinus,
  UserPlus,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { http, createPublicClient } from "viem";
import { useAuth } from "../hooks/use-auth";
import {
  useAddAdmin,
  useAddToken,
  useAllowlistAuditLog,
  useCreditAbandonedMints,
  useGetAdmins,
  useGetAkkLedgerCanisterId,
  useGetAkkTransferFee,
  useGetFeePercent,
  useGetFeeRecipient,
  useGetGritIssuanceRate,
  useGetIsLaunched,
  useGetLaunchGate,
  useGetLaunchGateConfig,
  useGetMinerCreationFees,
  useGetTokens,
  useIsAdmin,
  useRemoveAdmin,
  useRemoveToken,
  useSetAkkLedgerCanisterId,
  useSetAkkTransferFee,
  useSetFeePercent,
  useSetFeeRecipient,
  useSetGritIssuanceRate,
  useSetLaunchGate,
  useSetLaunchTimeGate,
  useSetLaunched,
  useSetMinerCreationFee,
  useSetNftGate,
} from "../hooks/use-backend";
import { useTestScore } from "../hooks/use-test-score";
import type { AllowlistedToken, Chain } from "../types";
import {
  AuditAction,
  CHAIN_LABELS,
  formatUSDValue,
  getChainId,
  truncateAddress,
} from "../types";
import { fetchDexScreenerPrice } from "../utils/dexscreener";
import { ETH_RPC_ENDPOINTS } from "../utils/evm-rpc";

// ─── CreditAbandonedMintsSection ─────────────────────────────────────────────
function CreditAbandonedMintsSection() {
  const creditMints = useCreditAbandonedMints();
  const [result, setResult] = useState<{
    credited: number;
    total: number;
  } | null>(null);

  const handleCredit = async () => {
    try {
      const res = await creditMints.mutateAsync();
      setResult({
        credited: Number((res as unknown as Record<string, bigint>).credited),
        total: Number((res as unknown as Record<string, bigint>).total),
      });
      setTimeout(() => setResult(null), 5000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to credit abandoned mints",
      );
    }
  };

  return (
    <div className="space-y-4" data-ocid="admin.credit_abandoned_mints.section">
      <div>
        <h2 className="font-mono text-base uppercase tracking-widest text-foreground font-semibold">
          CREDIT ABANDONED MINTS
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Retroactively credit all abandoned mints to winners' internal
          balances. Use this after fixing a ledger configuration issue.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={handleCredit}
          disabled={creditMints.isPending}
          className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
          data-ocid="admin.credit_abandoned_mints.button"
        >
          <Zap className="h-3.5 w-3.5" />
          {creditMints.isPending ? "Crediting…" : "Credit Abandoned Mints"}
        </Button>

        {result && (
          <span
            className="flex items-center gap-1 text-xs font-mono text-emerald-400"
            data-ocid="admin.credit_abandoned_mints.success_state"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Credited {result.credited} of {result.total} abandoned mints
          </span>
        )}

        {creditMints.isError && (
          <span
            className="flex items-center gap-1 text-xs font-mono text-destructive"
            data-ocid="admin.credit_abandoned_mints.error_state"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {creditMints.error instanceof Error
              ? creditMints.error.message
              : "Failed to credit abandoned mints"}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── ScoreOverrideSection ────────────────────────────────────────────────────
function ScoreOverrideSection() {
  const {
    testScore,
    setTestScore,
    clearTestScore,
    testBadgeLevel,
    testBadgeName,
  } = useTestScore();
  const [customInput, setCustomInput] = useState("");

  const PRESETS = [
    { label: "PLAYER (690)", value: 690 },
    { label: "SUPER PLAYER (6,900)", value: 6900 },
    { label: "ALPHA PLAYER (69,000)", value: 69000 },
  ] as const;

  const handleSetCustom = () => {
    const n = Number(customInput);
    if (!Number.isFinite(n) || n < 0) return;
    setTestScore(n);
    setCustomInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-base uppercase tracking-widest text-foreground font-semibold">
          SCORE OVERRIDE
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Set a test AK69 score to simulate badge thresholds. For testing only.
        </p>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setTestScore(p.value)}
            data-ocid={`admin.test_score_preset.${p.value}`}
            className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors duration-150"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom input row */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="custom-score-input"
          className="font-mono text-xs uppercase tracking-widest text-foreground whitespace-nowrap"
        >
          CUSTOM SCORE
        </label>
        <Input
          id="custom-score-input"
          type="number"
          min={0}
          placeholder="e.g. 12345"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSetCustom()}
          data-ocid="admin.test_score_input"
          className="w-36 font-mono text-sm h-8"
        />
        <button
          type="button"
          onClick={handleSetCustom}
          data-ocid="admin.test_score_set_button"
          className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors duration-150"
        >
          SET
        </button>
      </div>

      {/* Reset button */}
      <div>
        <button
          type="button"
          onClick={clearTestScore}
          data-ocid="admin.test_score_reset_button"
          className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-destructive text-destructive bg-transparent hover:bg-destructive/10 transition-colors duration-150"
        >
          RESET TO REAL SCORE
        </button>
      </div>

      {/* Status line */}
      {testScore !== null ? (
        <p
          className="font-mono text-sm text-primary"
          data-ocid="admin.test_score_status"
        >
          Test score active: {testScore.toLocaleString()} →{" "}
          {testBadgeLevel > 0 ? testBadgeName : "No badge"}
        </p>
      ) : (
        <p
          className="font-mono text-sm text-muted-foreground"
          data-ocid="admin.test_score_status"
        >
          No test override active.
        </p>
      )}
    </div>
  );
}

// ─── SupplyAuditSection ──────────────────────────────────────────────────────
function SupplyAuditSection() {
  const { data: audit, refetch, isFetching } = useGetSupplyVsBalanceAudit();
  const recalculate = useRecalculateTotalAkkMined();
  const [recalcMsg, setRecalcMsg] = useState<string | null>(null);

  const formatAkk = (e8s: bigint | undefined) =>
    e8s !== undefined
      ? (Number(e8s) / 1e8).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })
      : "—";

  const handleRecalculate = async () => {
    try {
      await recalculate.mutateAsync();
      setRecalcMsg("Supply recalculated from block history.");
      setTimeout(() => setRecalcMsg(null), 5000);
    } catch {
      setRecalcMsg("Recalculation failed.");
      setTimeout(() => setRecalcMsg(null), 5000);
    }
  };

  type SupplyTile = {
    label: string;
    value: string;
    unit: string;
    highlight?: "red" | "green";
  };
  const discrepancy = audit?.discrepancy ?? 0n;
  const hasDiscrepancy = discrepancy !== 0n;

  const tiles = [
    {
      label: "CURRENT SUPPLY",
      value: formatAkk(audit?.totalAkkMined),
      unit: "AKK",
    },
    {
      label: "ACTUAL BALANCES",
      value: formatAkk(audit?.sumOfAllBalances),
      unit: "AKK",
    },
    {
      label: "PENDING MINTS",
      value: formatAkk(audit?.pendingMints),
      unit: "AKK",
    },
    {
      label: "DISCREPANCY",
      value: audit
        ? formatAkk(discrepancy < 0n ? -discrepancy : discrepancy)
        : "—",
      unit: "AKK",
      highlight: hasDiscrepancy ? "red" : "green",
    },
  ] satisfies SupplyTile[];

  return (
    <div className="space-y-5" data-ocid="admin.supply_audit_section">
      <div className="flex items-center justify-between">
        <h3 className="font-['VT323'] text-white text-xl tracking-widest uppercase">
          SUPPLY AUDIT
        </h3>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          data-ocid="admin.supply_audit_refresh_button"
          className="font-['VT323'] text-green-400 text-base tracking-widest hover:text-green-300 transition-colors disabled:opacity-50"
        >
          {isFetching ? "[LOADING…]" : "[REFRESH] →"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiles.map(({ label, value, unit, highlight }) => (
          <div
            key={label}
            className="border border-green-900/40 bg-black/30 p-3 text-center"
          >
            <div className="font-['VT323'] text-green-500/70 text-xs tracking-widest uppercase">
              {label}
            </div>
            <div
              className={`font-['VT323'] text-2xl ${
                highlight === "red"
                  ? "text-red-400"
                  : highlight === "green"
                    ? "text-green-400"
                    : "text-green-400"
              }`}
            >
              {value}
            </div>
            <div className="font-['VT323'] text-green-700 text-xs tracking-widest">
              {unit}
            </div>
          </div>
        ))}
      </div>

      {hasDiscrepancy && (
        <p
          className="font-['VT323'] text-red-400 text-sm tracking-widest"
          data-ocid="admin.supply_audit_discrepancy_warning"
        >
          ⚠ Discrepancy detected. Use RECALCULATE SUPPLY to reset Current Supply
          from block history.
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleRecalculate}
          disabled={recalculate.isPending}
          data-ocid="admin.supply_audit_recalculate_button"
          className="font-['VT323'] text-base tracking-widest px-3 py-1.5 border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors disabled:opacity-50 uppercase"
        >
          {recalculate.isPending ? "[RECALCULATING…]" : "[RECALCULATE SUPPLY]"}
        </button>
        {recalcMsg && (
          <span
            className={`font-['VT323'] text-sm tracking-widest ${
              recalcMsg.includes("failed") ? "text-red-400" : "text-green-400"
            }`}
            data-ocid="admin.supply_audit_success_state"
          >
            {recalcMsg}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CHAINS: Chain[] = ["ethereum", "arbitrum", "polygon", "optimism", "base"];
const CONTRACT_REGEX = /^0x[0-9a-fA-F]{40}$/;

const RPC_URLS: Record<number, string> = {
  8453: "https://mainnet.base.org",
  42220: "https://forno.celo.org",
  10: "https://mainnet.optimism.io",
  1: "https://ethereum.publicnode.com",
  137: "https://polygon-rpc.com",
  42161: "https://arb1.arbitrum.io/rpc",
};

const ERC20_ABI = [
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    name: "name",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    name: "symbol",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;

interface FetchedTokenDetails {
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  priceUSD: number | null;
}

async function fetchTokenDetailsFromRpc(
  tokenAddress: `0x${string}`,
  rpc: string,
): Promise<{
  name: string | null;
  symbol: string | null;
  decimals: number | null;
}> {
  const client = createPublicClient({ transport: http(rpc) });
  const [rawName, rawSymbol, rawDecimals] = await Promise.all([
    client
      .readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "name",
      })
      .catch(() => null),
    client
      .readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "symbol",
      })
      .catch(() => null),
    client
      .readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      })
      .catch(() => null),
  ]);
  return {
    name: typeof rawName === "string" ? rawName : null,
    symbol: typeof rawSymbol === "string" ? rawSymbol : null,
    decimals:
      rawDecimals !== null && rawDecimals !== undefined
        ? Number(rawDecimals)
        : null,
  };
}

async function fetchTokenDetails(
  tokenAddress: `0x${string}`,
  chainId: number,
  _chain: Chain,
): Promise<FetchedTokenDetails> {
  let name: string | null = null;
  let symbol: string | null = null;
  let decimals: number | null = null;
  let priceUSD: number | null = null;

  // For Ethereum (chainId 1) use the shared multi-endpoint fallback list;
  // for all other chains use the single configured RPC.
  const rpcList: string[] =
    chainId === 1
      ? [...ETH_RPC_ENDPOINTS]
      : RPC_URLS[chainId]
        ? [RPC_URLS[chainId]]
        : [];

  for (const rpc of rpcList) {
    try {
      const result = await fetchTokenDetailsFromRpc(tokenAddress, rpc);
      // Accept this result if we got at least one useful field
      if (
        result.name !== null ||
        result.symbol !== null ||
        result.decimals !== null
      ) {
        name = result.name;
        symbol = result.symbol;
        decimals = result.decimals;
        break;
      }
    } catch {
      // try next endpoint
    }
  }

  // Fetch price via shared utility (two-endpoint pattern: tokens → search fallback)
  const fetchedPrice = await fetchDexScreenerPrice(tokenAddress);
  const price = fetchedPrice ?? 0;
  if (price > 0) priceUSD = price;

  return { name, symbol, decimals, priceUSD };
}

/** Hook: fetch live DexScreener prices for a list of token addresses, refresh every 60s */
function useLivePrices(tokens: AllowlistedToken[] | undefined): {
  prices: Record<string, number | null>;
  isLoading: boolean;
} {
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async (list: AllowlistedToken[]) => {
    if (!list.length) return;
    setIsLoading(true);
    const unique = [...new Set(list.map((t) => t.tokenAddress.toLowerCase()))];
    const results = await Promise.all(
      unique.map(async (addr) => {
        const price = await fetchDexScreenerPrice(addr);
        return [addr, price] as [string, number | null];
      }),
    );
    setPrices(Object.fromEntries(results));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!tokens) return;
    fetchAll(tokens);
    timerRef.current = setInterval(() => fetchAll(tokens), 60_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tokens, fetchAll]);

  return { prices, isLoading };
}
// Override display names for known symbols
const SYMBOL_DISPLAY_NAMES: Record<string, string> = {
  kVCM: "Klima Protocol",
  axlREGEN: "Regen Network",
  TGN: "Treegens",
  GIV: "Giveth",
};

function getTokenDisplayName(symbol: string, fallback: string): string {
  return SYMBOL_DISPLAY_NAMES[symbol] ?? fallback;
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function ChainBadge({ chain }: { chain: string }) {
  const colors: Record<string, string> = {
    ethereum: "border-blue-400/40 text-blue-400",
    arbitrum: "border-sky-400/40 text-sky-400",
    polygon: "border-purple-400/40 text-purple-400",
    optimism: "border-red-400/40 text-red-400",
    base: "border-indigo-400/40 text-indigo-400",
  };
  return (
    <Badge
      variant="outline"
      className={`font-mono text-xs ${colors[chain] ?? "border-border text-muted-foreground"}`}
    >
      {CHAIN_LABELS[chain] ?? chain}
    </Badge>
  );
}

function CopyBtn({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied");
      }}
      className="ml-1 text-muted-foreground hover:text-accent transition-smooth"
      aria-label="Copy to clipboard"
    >
      <ClipboardCopy className="h-3 w-3" />
    </button>
  );
}

// ─── Add Token Modal ──────────────────────────────────────────────────────────
interface FormState {
  tokenAddress: string;
  chain: Chain | "";
  name: string;
  symbol: string;
  decimals: string;
  priceUSD: string;
}

interface FetchedState {
  fetched: boolean;
  symbol: string | null;
  decimals: number | null;
  priceUSD: number | null;
  priceNotFound: boolean;
}

type FieldKey = keyof FormState;

const EMPTY_FORM: FormState = {
  tokenAddress: "",
  chain: "",
  name: "",
  symbol: "",
  decimals: "18",
  priceUSD: "",
};

interface FieldErrors {
  tokenAddress?: string;
  chain?: string;
  name?: string;
  symbol?: string;
  decimals?: string;
  priceUSD?: string;
}

function validateForm(form: FormState): FieldErrors {
  const e: FieldErrors = {};
  if (!CONTRACT_REGEX.test(form.tokenAddress))
    e.tokenAddress = "Must be a valid 0x… address (40 hex chars)";
  if (!form.chain) e.chain = "Select a chain";
  if (!form.name.trim()) e.name = "Name is required";
  if (!form.symbol.trim()) e.symbol = "Symbol is required";
  const dec = Number(form.decimals);
  if (!Number.isInteger(dec) || dec < 0 || dec > 18)
    e.decimals = "Integer 0–18 required";
  const price = Number(form.priceUSD);
  if (Number.isNaN(price) || price <= 0) e.priceUSD = "Must be > 0";
  return e;
}

function FieldError({
  message,
  ocid,
}: {
  message: string | undefined;
  ocid: string;
}) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive mt-1" data-ocid={ocid}>
      {message}
    </p>
  );
}

interface AddTokenModalProps {
  open: boolean;
  onClose: () => void;
}

function AddTokenModal({ open, onClose }: AddTokenModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  );
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetched, setFetched] = useState<FetchedState>({
    fetched: false,
    symbol: null,
    decimals: null,
    priceUSD: null,
    priceNotFound: false,
  });
  const addToken = useAddToken();

  const errors = validateForm(form);
  const hasErrors = Object.keys(errors).length > 0;

  const canFetch = CONTRACT_REGEX.test(form.tokenAddress) && !!form.chain;

  async function handleFetchDetails() {
    if (!canFetch) return;
    setIsFetchingDetails(true);
    setFetchError(null);
    try {
      const chainId = getChainId(form.chain as Chain);
      const details = await fetchTokenDetails(
        form.tokenAddress as `0x${string}`,
        chainId,
        form.chain as Chain,
      );
      setFetched({
        fetched: true,
        symbol: details.symbol,
        decimals: details.decimals,
        priceUSD: details.priceUSD,
        priceNotFound: details.priceUSD === null,
      });
      setForm((f) => ({
        ...f,
        name: details.name ?? f.name,
        symbol: details.symbol ?? f.symbol,
        decimals:
          details.decimals !== null ? String(details.decimals) : f.decimals,
        priceUSD:
          details.priceUSD !== null ? String(details.priceUSD) : f.priceUSD,
      }));
      if (
        !details.name &&
        !details.symbol &&
        details.decimals === null &&
        details.priceUSD === null
      ) {
        setFetchError(
          "Could not fetch token details. Check the address and chain, then try again.",
        );
      }
    } catch {
      setFetchError(
        "Fetch failed. Check the address and chain, then try again.",
      );
    } finally {
      setIsFetchingDetails(false);
    }
  }

  function bindInput(key: FieldKey) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
      onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
    };
  }

  function touchAll() {
    setTouched(
      Object.fromEntries(
        (Object.keys(EMPTY_FORM) as FieldKey[]).map((k) => [k, true]),
      ),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    touchAll();
    if (hasErrors) return;
    const token: AllowlistedToken = {
      tokenAddress: form.tokenAddress,
      chain: form.chain as Chain,
      name: form.name.trim(),
      symbol: form.symbol.trim().toUpperCase(),
      decimals: BigInt(form.decimals),
      priceUSD: Number(form.priceUSD),
    };
    try {
      await addToken.mutateAsync(token);
      toast.success(`${token.symbol} added to allowlist`);
      handleClose();
    } catch {
      toast.error("Failed to add token");
    }
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setTouched({});
    setFetched({
      fetched: false,
      symbol: null,
      decimals: null,
      priceUSD: null,
      priceNotFound: false,
    });
    setFetchError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="bg-card border border-border max-w-lg"
        data-ocid="add_token.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground tracking-wide flex items-center gap-2">
            <Plus className="h-4 w-4 text-accent" />
            Add Allowed Token
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Address */}
          <div>
            <Label className="text-xs font-mono uppercase tracking-widest text-white">
              Contract Address <span className="text-destructive">*</span>
            </Label>
            <Input
              {...bindInput("tokenAddress")}
              placeholder="0x…"
              className="mt-1.5 font-mono text-sm bg-background border-input"
              data-ocid="add_token.address_input"
            />
            <FieldError
              message={touched.tokenAddress ? errors.tokenAddress : undefined}
              ocid="add_token.address_input.field_error"
            />
          </div>

          {/* Chain */}
          <div>
            <Label className="text-xs font-mono uppercase tracking-widest text-white">
              Chain <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.chain}
              onValueChange={(v) => {
                setForm((f) => ({ ...f, chain: v as Chain }));
                setTouched((t) => ({ ...t, chain: true }));
                setFetched({
                  fetched: false,
                  symbol: null,
                  decimals: null,
                  priceUSD: null,
                  priceNotFound: false,
                });
              }}
            >
              <SelectTrigger
                className="mt-1.5 bg-background border-input"
                data-ocid="add_token.chain_select"
              >
                <SelectValue placeholder="Select chain…" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {CHAINS.map((c) => (
                  <SelectItem key={c} value={c} className="font-mono text-sm">
                    {CHAIN_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError
              message={touched.chain ? errors.chain : undefined}
              ocid="add_token.chain_select.field_error"
            />
          </div>

          {/* Fetch Details button */}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canFetch || isFetchingDetails}
              onClick={handleFetchDetails}
              className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40"
              data-ocid="add_token.fetch_details_button"
            >
              {isFetchingDetails ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching…
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" /> Fetch Details
                </>
              )}
            </Button>
            {fetchError && (
              <p
                className="text-xs text-destructive mt-1.5 font-mono"
                data-ocid="add_token.fetch_error_state"
              >
                {fetchError}
              </p>
            )}
          </div>

          {/* Name + Symbol */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-white">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                {...bindInput("name")}
                placeholder="Tether USD"
                className="mt-1.5 bg-background border-input"
                data-ocid="add_token.name_input"
              />
              {fetched.fetched && (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Editable
                </p>
              )}
              <FieldError
                message={touched.name ? errors.name : undefined}
                ocid="add_token.name_input.field_error"
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-white">
                Symbol <span className="text-destructive">*</span>
              </Label>
              {fetched.fetched ? (
                <div className="mt-1.5 h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted/30">
                  <span className="font-mono text-sm text-foreground">
                    {form.symbol || "—"}
                  </span>
                </div>
              ) : (
                <Input
                  {...bindInput("symbol")}
                  placeholder="USDT"
                  className="mt-1.5 bg-background border-input font-mono"
                  data-ocid="add_token.symbol_input"
                />
              )}
              {fetched.fetched && (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Auto-fetched
                </p>
              )}
              <FieldError
                message={
                  !fetched.fetched && touched.symbol ? errors.symbol : undefined
                }
                ocid="add_token.symbol_input.field_error"
              />
            </div>
          </div>

          {/* Decimals + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-white">
                Decimals <span className="text-destructive">*</span>
              </Label>
              {fetched.fetched ? (
                <div className="mt-1.5 h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted/30">
                  <span className="font-mono text-sm text-foreground">
                    {form.decimals}
                  </span>
                </div>
              ) : (
                <Input
                  {...bindInput("decimals")}
                  type="number"
                  min={0}
                  max={18}
                  step={1}
                  placeholder="18"
                  className="mt-1.5 bg-background border-input font-mono"
                  data-ocid="add_token.decimals_input"
                />
              )}
              {fetched.fetched && (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Auto-fetched
                </p>
              )}
              <FieldError
                message={
                  !fetched.fetched && touched.decimals
                    ? errors.decimals
                    : undefined
                }
                ocid="add_token.decimals_input.field_error"
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-white">
                USD Price <span className="text-destructive">*</span>
              </Label>
              {fetched.fetched && !fetched.priceNotFound ? (
                <div className="mt-1.5 h-9 flex items-center px-3 rounded-md border border-border/60 bg-muted/30">
                  <span className="font-mono text-sm text-foreground">
                    {form.priceUSD ? (
                      `${Number(form.priceUSD).toLocaleString("en-US", { maximumFractionDigits: 8 })}`
                    ) : (
                      <span className="text-muted-foreground/60">
                        Not listed
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <Input
                  {...bindInput("priceUSD")}
                  type="number"
                  min={0}
                  step="any"
                  placeholder={
                    fetched.priceNotFound ? "Enter price manually…" : "1.00"
                  }
                  className={`mt-1.5 bg-background border-input font-mono${fetched.priceNotFound ? " border-yellow-500/60" : ""}`}
                  data-ocid="add_token.price_input"
                />
              )}
              {fetched.fetched && !fetched.priceNotFound && (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  DexScreener
                </p>
              )}
              {fetched.priceNotFound && (
                <p
                  className="text-xs text-yellow-400/80 mt-1 font-mono"
                  data-ocid="add_token.price_not_found_state"
                >
                  Price not found on DexScreener — enter manually
                </p>
              )}
              <FieldError
                message={
                  (fetched.priceNotFound || !fetched.fetched) &&
                  touched.priceUSD
                    ? errors.priceUSD
                    : undefined
                }
                ocid="add_token.price_input.field_error"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-muted-foreground"
              data-ocid="add_token.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addToken.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 transition-smooth"
              data-ocid="add_token.submit_button"
            >
              <Plus className="h-3.5 w-3.5" />
              {addToken.isPending ? "Adding…" : "Add Token"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Allowed Tokens Tab ───────────────────────────────────────────────────────
function AllowedTokensTab() {
  const { data: tokens, isLoading, isError } = useGetTokens();
  const removeToken = useRemoveToken();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AllowlistedToken | null>(
    null,
  );
  const { prices: livePrices, isLoading: pricesLoading } =
    useLivePrices(tokens);

  function getLivePrice(token: AllowlistedToken): number | null {
    return livePrices[token.tokenAddress.toLowerCase()] ?? null;
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await removeToken.mutateAsync({
        tokenAddress: deleteTarget.tokenAddress,
        chain: deleteTarget.chain,
      });
      toast.success(`${deleteTarget.symbol} removed`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to remove token");
    }
  }

  return (
    <div className="space-y-4" data-ocid="allowed_tokens.section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase tracking-widest text-foreground">
          CURRENT ALLOWLIST
        </h2>
        <div className="flex items-center gap-2">
          {pricesLoading && (
            <span
              className="flex items-center gap-1 text-xs text-muted-foreground font-mono"
              data-ocid="allowed_tokens.prices_loading_state"
            >
              <RefreshCw className="h-3 w-3 animate-spin" />
              Fetching prices…
            </span>
          )}
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
            data-ocid="allowed_tokens.add_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Token
          </Button>
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="space-y-2" data-ocid="allowed_tokens.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div
          className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive font-mono text-center"
          data-ocid="allowed_tokens.error_state"
        >
          Failed to load allowlist
        </div>
      ) : !tokens?.length ? (
        <div
          className="border border-dashed border-border bg-muted/10 py-14 flex flex-col items-center gap-3 text-center"
          data-ocid="allowed_tokens.empty_state"
        >
          <ShieldCheck className="h-8 w-8 text-muted-foreground/30" />
          <div>
            <p className="text-base font-display text-foreground">
              No tokens allowlisted
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add ERC-20 contracts to accept burns from
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs mt-1"
            data-ocid="allowed_tokens.empty_state.add_button"
          >
            <Plus className="h-3.5 w-3.5" />
            Add First Token
          </Button>
        </div>
      ) : (
        <div
          className="border border-border overflow-x-auto"
          data-ocid="allowed_tokens.table"
        >
          {/* Header row */}
          <div className="grid grid-cols-[120px_70px_180px_100px_50px_100px_48px] min-w-[760px] bg-muted/40 border-b border-border px-4 py-2.5 gap-3">
            {[
              "Name",
              "Symbol",
              "Contract Address",
              "Chain",
              "Dec.",
              "USD Price",
              "",
            ].map((h) => (
              <span
                key={h || "actions"}
                className="text-xs font-mono uppercase tracking-widest text-white"
              >
                {h}
              </span>
            ))}
          </div>
          {/* Data rows */}
          {tokens.map((token, idx) => {
            const livePrice = getLivePrice(token);

            return (
              <div
                key={`${token.tokenAddress}-${token.chain}`}
                className="grid grid-cols-[120px_70px_180px_100px_50px_100px_48px] min-w-[760px] items-center px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-smooth gap-3"
                data-ocid={`allowed_tokens.item.${idx + 1}`}
              >
                <span className="text-base font-display text-foreground truncate">
                  {getTokenDisplayName(token.symbol, token.name)}
                </span>
                <span className="font-mono text-xs text-accent uppercase">
                  {token.symbol}
                </span>
                <span className="flex items-center font-mono text-xs text-muted-foreground min-w-0">
                  <span className="truncate" title={token.tokenAddress}>
                    {truncateAddress(token.tokenAddress, 8)}
                  </span>
                  <CopyBtn text={token.tokenAddress} />
                </span>
                <span>
                  <ChainBadge chain={token.chain} />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {Number(token.decimals)}
                </span>
                <span className="font-mono text-xs">
                  {pricesLoading ? (
                    <Skeleton className="h-4 w-16 bg-muted" />
                  ) : livePrice !== null ? (
                    <span className="text-foreground">
                      {formatUSDValue(livePrice)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50 italic text-xs">
                      N/A
                    </span>
                  )}
                </span>
                <span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(token)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive transition-smooth"
                    aria-label={`Remove ${token.symbol}`}
                    data-ocid={`allowed_tokens.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddTokenModal open={addOpen} onClose={() => setAddOpen(false)} />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="delete_token.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Remove {deleteTarget?.symbol}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This removes{" "}
              <span className="font-mono text-foreground">
                {deleteTarget?.symbol}
              </span>{" "}
              ({CHAIN_LABELS[deleteTarget?.chain ?? ""] ?? deleteTarget?.chain})
              from the allowlist. Burns of this token will no longer be
              accepted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border text-muted-foreground"
              data-ocid="delete_token.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={removeToken.isPending}
              className="bg-destructive hover:bg-destructive/80 text-destructive-foreground gap-1.5"
              data-ocid="delete_token.confirm_button"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {removeToken.isPending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Audit Log Tab ────────────────────────────────────────────────────────────
function AuditLogTab() {
  const { data: log, isLoading, isError } = useAllowlistAuditLog();

  return (
    <div className="space-y-4" data-ocid="audit_log.section">
      {isLoading ? (
        <div className="space-y-2" data-ocid="audit_log.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div
          className="border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive font-mono text-center"
          data-ocid="audit_log.error_state"
        >
          Failed to load audit log
        </div>
      ) : !log?.length ? (
        <div
          className="border border-dashed border-border bg-muted/10 py-14 flex flex-col items-center gap-3 text-center"
          data-ocid="audit_log.empty_state"
        >
          <ShieldCheck className="h-8 w-8 text-muted-foreground/30" />
          <div>
            <p className="text-base font-display text-foreground">
              No audit entries yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Allowlist changes will appear here
            </p>
          </div>
        </div>
      ) : (
        <div
          className="border border-border overflow-x-auto"
          data-ocid="audit_log.table"
        >
          <div className="grid grid-cols-[80px_170px_90px_1fr_130px] min-w-[640px] bg-muted/40 border-b border-border px-4 py-2.5 gap-3">
            {[
              "Action",
              "Token Address",
              "Chain",
              "Admin Principal",
              "Timestamp",
            ].map((h) => (
              <span
                key={h}
                className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
              >
                {h}
              </span>
            ))}
          </div>
          {log.map((entry, idx) => {
            const isAdd = entry.action === AuditAction.add;
            const ts = new Date(Number(entry.timestamp / BigInt(1_000_000)));
            return (
              <div
                key={`${entry.tokenAddress}-${entry.chain}-${String(entry.timestamp)}`}
                className="grid grid-cols-[80px_170px_90px_1fr_130px] min-w-[640px] items-center px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-smooth gap-3"
                data-ocid={`audit_log.item.${idx + 1}`}
              >
                <span>
                  <Badge
                    variant="outline"
                    className={
                      isAdd
                        ? "border-green-500/40 text-green-400 font-mono text-xs"
                        : "border-destructive/40 text-destructive font-mono text-xs"
                    }
                  >
                    {isAdd ? "ADDED" : "REMOVED"}
                  </Badge>
                </span>
                <span className="flex items-center font-mono text-xs text-muted-foreground min-w-0">
                  <span className="truncate" title={entry.tokenAddress}>
                    {truncateAddress(entry.tokenAddress, 8)}
                  </span>
                  <CopyBtn text={entry.tokenAddress} />
                </span>
                <span>
                  <ChainBadge chain={entry.chain} />
                </span>
                <span className="font-mono text-xs text-muted-foreground truncate min-w-0">
                  {(() => {
                    const p = entry.adminPrincipal.toText();
                    const isAnon =
                      p ===
                        "2vxsx-fae3t-qaxgo-bbkl3-xoxsa-5anqp-s4jsx-sdeux-3hmne-y52fa-cae" ||
                      p.startsWith("2vxsx-f") ||
                      p === "aaaaa-aa";
                    return isAnon ? (
                      <span className="italic text-muted-foreground/60">
                        System
                      </span>
                    ) : (
                      truncateAddress(p, 10)
                    );
                  })()}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {ts.toLocaleDateString()}{" "}
                  {ts.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Fee Settings Tab ────────────────────────────────────────────────────────
const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

function FeeSettingsTab() {
  const { data: currentRecipient, isLoading, isError } = useGetFeeRecipient();
  const { data: currentFeePercent, isLoading: isFeeLoading } =
    useGetFeePercent();
  const setFeeRecipient = useSetFeeRecipient();
  const setFeePercent = useSetFeePercent();
  const [address, setAddress] = useState("");
  const [addressTouched, setAddressTouched] = useState(false);
  const [feeInput, setFeeInput] = useState("");
  const [feeTouched, setFeeTouched] = useState(false);

  useEffect(() => {
    if (currentRecipient != null) setAddress(currentRecipient);
  }, [currentRecipient]);

  useEffect(() => {
    if (currentFeePercent != null) setFeeInput(String(currentFeePercent));
  }, [currentFeePercent]);

  const addressError =
    addressTouched && !EVM_ADDRESS_REGEX.test(address)
      ? "Must be a valid EVM address (0x followed by 40 hex characters)"
      : null;

  const feeValue = Number(feeInput);
  const feeError =
    feeTouched && (Number.isNaN(feeValue) || feeValue < 0 || feeValue > 100)
      ? "Must be a number between 0 and 100"
      : null;

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddressTouched(true);
    if (!EVM_ADDRESS_REGEX.test(address)) return;
    try {
      await setFeeRecipient.mutateAsync(address.trim());
      toast.success("Fee recipient address saved");
    } catch {
      toast.error("Failed to save fee recipient address");
    }
  }

  async function handleSaveFee(e: React.FormEvent) {
    e.preventDefault();
    setFeeTouched(true);
    if (Number.isNaN(feeValue) || feeValue < 0 || feeValue > 100) return;
    try {
      await setFeePercent.mutateAsync(feeValue);
      toast.success(`Platform fee set to ${feeValue}%`);
    } catch {
      toast.error("Failed to save platform fee");
    }
  }

  return (
    <div className="space-y-6" data-ocid="fee_settings.section">
      {/* Fee Percentage */}
      <div className="border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Percent className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-foreground">
            Platform Fee
          </h3>
        </div>
        {isFeeLoading ? (
          <div className="space-y-2" data-ocid="fee_settings.fee_loading_state">
            <div className="h-4 w-40 bg-muted animate-pulse" />
            <div className="h-10 w-full bg-muted animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="uppercase tracking-widest">Current:</span>
              <span className="text-foreground font-semibold">
                {currentFeePercent != null
                  ? `${currentFeePercent}%`
                  : "Not configured"}
              </span>
              <span className="text-muted-foreground/60 italic">
                of each burn amount
              </span>
            </div>
            <form onSubmit={handleSaveFee} className="space-y-3">
              <div>
                <Label className="text-xs font-mono uppercase tracking-widest text-white">
                  Fee Percentage <span className="text-destructive">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    value={feeInput}
                    onChange={(e) => setFeeInput(e.target.value)}
                    onBlur={() => setFeeTouched(true)}
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    placeholder="0.69"
                    className="font-mono text-sm bg-background border-input pr-8"
                    data-ocid="fee_settings.fee_percent_input"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                    %
                  </span>
                </div>
                {feeError && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="fee_settings.fee_percent_input.field_error"
                  >
                    {feeError}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={setFeePercent.isPending}
                  className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                  data-ocid="fee_settings.save_fee_button"
                >
                  <Percent className="h-3.5 w-3.5" />
                  {setFeePercent.isPending ? "Saving…" : "Save Fee"}
                </Button>
                {setFeePercent.isSuccess && (
                  <span
                    className="flex items-center gap-1 text-xs font-mono text-emerald-400"
                    data-ocid="fee_settings.fee_success_state"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Saved
                  </span>
                )}
              </div>
            </form>
          </>
        )}
      </div>

      {/* Fee Recipient Address */}
      <div className="border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-foreground">
            Fee Recipient Address
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-2" data-ocid="fee_settings.loading_state">
            <div className="h-4 w-64 bg-muted animate-pulse" />
            <div className="h-10 w-full bg-muted animate-pulse" />
          </div>
        ) : isError ? (
          <div
            className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center"
            data-ocid="fee_settings.error_state"
          >
            Failed to load fee recipient
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="uppercase tracking-widest">Current:</span>
              {currentRecipient ? (
                <>
                  <span className="text-foreground">
                    {truncateAddress(currentRecipient, 14)}
                  </span>
                  <CopyBtn text={currentRecipient} />
                </>
              ) : (
                <span className="text-muted-foreground/60 italic">
                  Not configured
                </span>
              )}
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <Label className="text-xs font-mono uppercase tracking-widest text-white">
                  New Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => setAddressTouched(true)}
                  placeholder="0x…"
                  className="mt-1.5 font-mono text-sm bg-background border-input"
                  data-ocid="fee_settings.address_input"
                />
                {addressError && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="fee_settings.address_input.field_error"
                  >
                    {addressError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={setFeeRecipient.isPending}
                  className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                  data-ocid="fee_settings.save_button"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  {setFeeRecipient.isPending ? "Saving…" : "Save Address"}
                </Button>

                {setFeeRecipient.isSuccess && (
                  <span
                    className="flex items-center gap-1 text-xs font-mono text-emerald-400"
                    data-ocid="fee_settings.success_state"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Saved
                  </span>
                )}
                {setFeeRecipient.isError && (
                  <span
                    className="text-xs font-mono text-destructive"
                    data-ocid="fee_settings.error_state"
                  >
                    Failed to save
                  </span>
                )}
              </div>
            </form>
          </>
        )}
      </div>

      {/* GRIT Issuance Rate */}
      <GritIssuanceRateSection />
    </div>
  );
}

// ─── GRIT Issuance Rate Section ──────────────────────────────────────────────
function GritIssuanceRateSection() {
  const { data: currentRate, isLoading, isError } = useGetGritIssuanceRate();
  const { data: isLaunched, isLoading: isLaunchLoading } = useGetIsLaunched();
  const setGritIssuanceRate = useSetGritIssuanceRate();
  const setLaunched = useSetLaunched();
  const [rateInput, setRateInput] = useState("");
  const [rateTouched, setRateTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmLock, setConfirmLock] = useState(false);

  useEffect(() => {
    if (currentRate != null) setRateInput(String(Number(currentRate)));
  }, [currentRate]);

  const rateValue = Number(rateInput);
  const rateError =
    rateTouched &&
    (Number.isNaN(rateValue) || !Number.isInteger(rateValue) || rateValue <= 0)
      ? "Must be a positive whole number"
      : null;

  const locked = isLaunched === true;

  async function handleSaveRate(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    setRateTouched(true);
    if (
      Number.isNaN(rateValue) ||
      !Number.isInteger(rateValue) ||
      rateValue <= 0
    )
      return;
    try {
      await setGritIssuanceRate.mutateAsync(BigInt(rateValue));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success(`GRIT issuance rate set to ${rateValue.toLocaleString()}`);
    } catch {
      toast.error("Failed to save GRIT issuance rate");
    }
  }

  async function handleLockAtLaunch() {
    try {
      await setLaunched.mutateAsync();
      toast.success(
        "Settings locked at launch. GRIT Issuance Rate is now immutable.",
      );
      setConfirmLock(false);
    } catch {
      toast.error("Failed to lock settings");
    }
  }

  return (
    <>
      <div
        className="border border-border bg-card p-5 space-y-4"
        data-ocid="fee_settings.grit_rate.section"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display text-xl font-semibold tracking-widest text-foreground uppercase">
              GRIT ISSUANCE RATE
            </h3>
          </div>
          {!isLaunchLoading &&
            (locked ? (
              <span
                className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border px-2 py-1"
                data-ocid="fee_settings.grit_rate.locked_badge"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                LOCKED AT LAUNCH
              </span>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setConfirmLock(true)}
                disabled={setLaunched.isPending}
                className="text-xs font-mono uppercase tracking-widest gap-1.5 border-amber-600/40 text-amber-400 hover:bg-amber-600/10"
                data-ocid="fee_settings.lock_at_launch_button"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                LOCK SETTINGS AT LAUNCH
              </Button>
            ))}
        </div>

        {isLoading ? (
          <div
            className="space-y-2"
            data-ocid="fee_settings.grit_rate.loading_state"
          >
            <div className="h-4 w-48 bg-muted animate-pulse" />
            <div className="h-10 w-full bg-muted animate-pulse" />
          </div>
        ) : isError ? (
          <div
            className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center"
            data-ocid="fee_settings.grit_rate.error_state"
          >
            Failed to load GRIT issuance rate
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="uppercase tracking-widest">Current:</span>
              <span className="text-foreground font-semibold">
                {currentRate != null
                  ? Number(currentRate).toLocaleString()
                  : "Not configured"}
              </span>
              <span className="text-muted-foreground/60 italic">
                GRIT per $1 burned
              </span>
              {locked && (
                <span className="text-amber-400/70 italic">
                  · immutable after launch
                </span>
              )}
            </div>
            {locked ? (
              <div className="border border-amber-600/20 bg-amber-600/5 p-3 text-xs font-mono text-amber-400/80">
                This parameter is locked and cannot be changed after launch.
              </div>
            ) : (
              <form onSubmit={handleSaveRate} className="space-y-3">
                <div>
                  <Label className="text-xs font-mono uppercase tracking-widest text-white">
                    Issuance Rate <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                    Number of GRIT issued per $1 of token burned. Default:
                    1,000,000,000,000 (1 trillion)
                  </p>
                  <div className="relative">
                    <Input
                      value={rateInput}
                      onChange={(e) => setRateInput(e.target.value)}
                      onBlur={() => setRateTouched(true)}
                      type="number"
                      min={1}
                      step={1}
                      placeholder="100000000000"
                      className="font-mono text-sm bg-background border-input pr-16"
                      data-ocid="fee_settings.grit_rate_input"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono pointer-events-none">
                      GRIT
                    </span>
                  </div>
                  {rateError && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="fee_settings.grit_rate_input.field_error"
                    >
                      {rateError}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={setGritIssuanceRate.isPending}
                    className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                    data-ocid="fee_settings.save_grit_rate_button"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {setGritIssuanceRate.isPending ? "Saving…" : "Save Rate"}
                  </Button>
                  {saved && (
                    <span
                      className="flex items-center gap-1 text-xs font-mono text-emerald-400"
                      data-ocid="fee_settings.grit_rate.success_state"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </span>
                  )}
                  {setGritIssuanceRate.isError && (
                    <span
                      className="text-xs font-mono text-destructive"
                      data-ocid="fee_settings.grit_rate.error_state"
                    >
                      Failed to save
                    </span>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Confirm Lock Dialog */}
      <AlertDialog open={confirmLock} onOpenChange={setConfirmLock}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display tracking-widest uppercase text-foreground">
              LOCK SETTINGS AT LAUNCH?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-sm text-muted-foreground">
              This will permanently lock the GRIT Issuance Rate. Once locked, it
              cannot be changed — ever. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-mono text-xs uppercase tracking-widest"
              data-ocid="fee_settings.lock_confirm_dialog.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLockAtLaunch}
              disabled={setLaunched.isPending}
              className="font-mono text-xs uppercase tracking-widest bg-amber-600 hover:bg-amber-700 text-white"
              data-ocid="fee_settings.lock_confirm_dialog.confirm_button"
            >
              {setLaunched.isPending ? "Locking…" : "LOCK AT LAUNCH"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Transfer Admin ───────────────────────────────────────────────────────────
function AdminManagementSection() {
  const { principal: currentPrincipal } = useAuth();
  const { data: admins, isLoading, isError } = useGetAdmins();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();
  const [newPrincipal, setNewPrincipal] = useState("");
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newPrincipal.trim()) return;
    try {
      await addAdmin.mutateAsync(newPrincipal.trim());
      toast.success("Admin added successfully");
      setNewPrincipal("");
    } catch {
      toast.error("Failed to add admin — check the principal ID");
    }
  }

  async function confirmRemove() {
    if (!removeTarget) return;
    try {
      await removeAdmin.mutateAsync(removeTarget);
      toast.success("Admin removed");
      setRemoveTarget(null);
    } catch {
      toast.error("Failed to remove admin");
    }
  }

  const isLastAdmin = (admins?.length ?? 0) <= 1;

  return (
    <>
      <div
        className="border border-border bg-card p-5 space-y-4"
        data-ocid="admin_management.section"
      >
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <UserCog className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-foreground">
            ADMIN MANAGEMENT
          </h3>
        </div>

        {/* Add Admin Form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newPrincipal}
            onChange={(e) => setNewPrincipal(e.target.value)}
            placeholder="Enter principal ID to add as admin…"
            className="flex-1 font-mono text-sm bg-background border-input"
            data-ocid="admin_management.principal_input"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newPrincipal.trim() || addAdmin.isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth whitespace-nowrap"
            data-ocid="admin_management.add_button"
          >
            <UserPlus className="h-3.5 w-3.5" />
            {addAdmin.isPending ? "Adding…" : "Add Admin"}
          </Button>
        </form>

        {/* Admin List */}
        {isLoading ? (
          <div className="space-y-2" data-ocid="admin_management.loading_state">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <div
            className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center"
            data-ocid="admin_management.error_state"
          >
            Failed to load admin list
          </div>
        ) : !admins?.length ? (
          <div
            className="border border-dashed border-border bg-muted/10 py-8 flex items-center justify-center"
            data-ocid="admin_management.empty_state"
          >
            <p className="text-xs text-muted-foreground font-mono">
              No admins found
            </p>
          </div>
        ) : (
          <div
            className="border border-border"
            data-ocid="admin_management.list"
          >
            {admins.map((p, idx) => {
              const isCurrentUser = p === currentPrincipal;
              return (
                <div
                  key={p}
                  className="flex items-center justify-between px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-smooth"
                  data-ocid={`admin_management.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <UserCog className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span
                      className="font-mono text-xs text-foreground truncate"
                      title={p}
                    >
                      {truncateAddress(p, 16)}
                    </span>
                    <CopyBtn text={p} />
                    {isCurrentUser && (
                      <Badge
                        variant="outline"
                        className="border-accent/40 text-accent font-mono text-xs ml-1 flex-shrink-0"
                      >
                        You
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setRemoveTarget(p)}
                    disabled={isLastAdmin}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive transition-smooth flex-shrink-0"
                    aria-label={`Remove admin ${p}`}
                    title={
                      isLastAdmin ? "Cannot remove the last admin" : undefined
                    }
                    data-ocid={`admin_management.delete_button.${idx + 1}`}
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          All listed principals have full admin access. You cannot remove the
          last admin.
        </p>
      </div>

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="remove_admin.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Remove Admin?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Principal{" "}
              <span className="font-mono text-foreground">
                {removeTarget ? truncateAddress(removeTarget, 12) : ""}
              </span>{" "}
              will lose all admin privileges immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border text-muted-foreground"
              data-ocid="remove_admin.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              disabled={removeAdmin.isPending}
              className="bg-destructive hover:bg-destructive/80 text-destructive-foreground gap-1.5"
              data-ocid="remove_admin.confirm_button"
            >
              <UserMinus className="h-3.5 w-3.5" />
              {removeAdmin.isPending ? "Removing…" : "Remove Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Mining Fees Tab ─────────────────────────────────────────────────────────

const WEI_PER_UNIT = BigInt("1000000000000000000"); // 1e18

function weiToDisplay(wei: bigint): string {
  const whole = wei / WEI_PER_UNIT;
  const frac = wei % WEI_PER_UNIT;
  if (frac === BigInt(0)) return String(whole);
  const fracStr = frac.toString().padStart(18, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

function displayToWei(val: string): bigint | null {
  const trimmed = val.trim();
  if (!trimmed || Number.isNaN(Number(trimmed))) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  const fracPadded = fracPart.slice(0, 18).padEnd(18, "0");
  return BigInt(wholePart || "0") * WEI_PER_UNIT + BigInt(fracPadded);
}

const CHAIN_DISPLAY_MAP: Record<
  string,
  { label: string; currency: string; badgeClass: string }
> = {
  ethereum: {
    label: "Ethereum",
    currency: "ETH",
    badgeClass: "border-blue-400/40 text-blue-400",
  },
  base: {
    label: "Base",
    currency: "ETH",
    badgeClass: "border-indigo-400/40 text-indigo-400",
  },
  celo: {
    label: "Celo",
    currency: "CELO",
    badgeClass: "border-yellow-400/40 text-yellow-400",
  },
  optimism: {
    label: "Optimism",
    currency: "ETH",
    badgeClass: "border-red-400/40 text-red-400",
  },
  arbitrum: {
    label: "Arbitrum",
    currency: "ETH",
    badgeClass: "border-sky-400/40 text-sky-400",
  },
  polygon: {
    label: "Polygon",
    currency: "MATIC",
    badgeClass: "border-purple-400/40 text-purple-400",
  },
};

function MiningFeesTab() {
  const { data: currentFees, isLoading, isError } = useGetMinerCreationFees();
  const setMinerCreationFee = useSetMinerCreationFee();

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentFees) {
      const map: Record<string, string> = {};
      for (const entry of currentFees) {
        map[entry.chain] = weiToDisplay(entry.feeWei);
      }
      setInputs(map);
    }
  }, [currentFees]);

  function getError(chain: string, currency: string): string | null {
    if (!touched[chain]) return null;
    const val = Number(inputs[chain]);
    if (Number.isNaN(val) || val < 0) return "Must be ≥ 0";
    if (val > 1) return `Max 1 ${currency}`;
    return null;
  }

  const feeEntries = currentFees ?? [];

  const hasErrors = feeEntries.some(
    (entry) =>
      getError(
        entry.chain,
        CHAIN_DISPLAY_MAP[entry.chain]?.currency ?? "ETH",
      ) !== null,
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    for (const entry of feeEntries) {
      allTouched[entry.chain] = true;
    }
    setTouched(allTouched);
    if (hasErrors) return;

    try {
      for (const entry of feeEntries) {
        const wei = displayToWei(inputs[entry.chain] ?? "");
        if (wei === null) {
          toast.error(`Invalid fee value for ${entry.chain}`);
          return;
        }
        await setMinerCreationFee.mutateAsync({
          chain: entry.chain,
          feeWei: wei,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Miner creation fees saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save fees");
    }
  }

  return (
    <div className="space-y-6" data-ocid="mining_fees.section">
      <div className="border border-border bg-card p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Cpu className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-foreground">
            Miner Creation Fee
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="mining_fees.loading_state">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 bg-muted animate-pulse" />
                <div className="h-10 w-full bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive font-mono text-center"
            data-ocid="mining_fees.error_state"
          >
            Failed to load miner creation fees
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {feeEntries.map((entry) => {
              const display = CHAIN_DISPLAY_MAP[entry.chain] ?? {
                label:
                  entry.chain.charAt(0).toUpperCase() + entry.chain.slice(1),
                currency: "ETH",
                badgeClass: "border-border text-muted-foreground",
              };
              const err = getError(entry.chain, display.currency);
              const ocid = `mining_fees.${entry.chain}_input`;
              return (
                <div key={entry.chain}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="text-xs font-mono uppercase tracking-widest text-white">
                      {display.label}
                    </Label>
                    <span
                      className={`inline-flex items-center border rounded-sm px-1.5 py-0.5 font-mono text-xs ${display.badgeClass}`}
                    >
                      {display.currency}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground/60 ml-auto">
                      current:{" "}
                      <span className="text-foreground">
                        {weiToDisplay(entry.feeWei)}
                      </span>{" "}
                      {display.currency}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step="any"
                      value={inputs[entry.chain] ?? ""}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          [entry.chain]: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, [entry.chain]: true }))
                      }
                      placeholder="0.001"
                      className="font-mono text-sm bg-background border-input pr-16"
                      data-ocid={ocid}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono pointer-events-none">
                      {display.currency}
                    </span>
                  </div>
                  {err && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid={`${ocid}.field_error`}
                    >
                      {err}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={setMinerCreationFee.isPending}
                className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                data-ocid="mining_fees.save_button"
              >
                <Cpu className="h-3.5 w-3.5" />
                {setMinerCreationFee.isPending ? "Saving…" : "Save Fees"}
              </Button>
              {saved && (
                <span
                  className="flex items-center gap-1 text-xs font-mono text-emerald-400"
                  data-ocid="mining_fees.success_state"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved
                </span>
              )}
              {setMinerCreationFee.isError && (
                <span
                  className="text-xs font-mono text-destructive"
                  data-ocid="mining_fees.error_state"
                >
                  Failed to save
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        This fee is charged in the chain&apos;s native gas token when a user
        creates a new miner. Set to 0 to disable the fee for that chain.
      </p>
    </div>
  );
}

// ─── Launch Gate Section ─────────────────────────────────────────────────────
// ─── AKK Ledger Section ──────────────────────────────────────────────────────
function AkkLedgerSection() {
  const { data: currentId, isLoading } = useGetAkkLedgerCanisterId();
  const setCanisterId = useSetAkkLedgerCanisterId();
  const [inputId, setInputId] = useState("");
  const [saveMsg, setSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // AKK Transfer Fee subsection state
  const { data: currentFee, isLoading: feeLoading } = useGetAkkTransferFee();
  const setFee = useSetAkkTransferFee();
  const [feeInput, setFeeInput] = useState("");
  const [feeMsg, setFeeMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (currentFee !== undefined) {
      setFeeInput(String(currentFee));
    }
  }, [currentFee]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (currentId) {
      setSaveMsg({
        type: "error",
        text: "Canister ID is locked and cannot be changed",
      });
      return;
    }
    const trimmed = inputId.trim();
    if (!trimmed) {
      setSaveMsg({ type: "error", text: "Canister ID is required" });
      return;
    }
    setSaveMsg(null);
    try {
      await setCanisterId.mutateAsync(trimmed);
      setInputId("");
      setSaveMsg({ type: "success", text: "AKK ledger canister ID saved" });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      setSaveMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save",
      });
    }
  }

  async function handleFeeSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = feeInput.trim();
    if (!trimmed) {
      setFeeMsg({ type: "error", text: "Fee is required" });
      return;
    }
    setFeeMsg(null);
    try {
      await setFee.mutateAsync(BigInt(trimmed));
      setFeeMsg({ type: "success", text: "AKK transfer fee saved" });
      setTimeout(() => setFeeMsg(null), 3000);
    } catch (err) {
      setFeeMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save",
      });
    }
  }

  const feeInAkk = feeInput
    ? (Number(feeInput) / 1e8).toFixed(8).replace(/\.?0+$/, "")
    : "0";

  return (
    <div
      className="border border-border bg-card p-5 space-y-6"
      data-ocid="akk_ledger.section"
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Cpu className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-white">
          AKK LEDGER CANISTER
        </h3>
      </div>

      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
        Set the ICRC-1/2/3 AKK token ledger canister ID to enable real on-chain
        AKK minting and transfers.
      </p>

      {isLoading ? (
        <div className="space-y-2" data-ocid="akk_ledger.loading_state">
          <div className="h-4 w-48 bg-muted animate-pulse" />
          <div className="h-10 w-full bg-muted animate-pulse" />
        </div>
      ) : (
        <>
          {/* Current value */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-mono uppercase tracking-widest text-white shrink-0">
              Current ID
            </Label>
            <span
              className="text-xs font-mono text-green-400 truncate"
              data-ocid="akk_ledger.current_id"
            >
              {currentId ?? (
                <span className="text-yellow-400">Not configured</span>
              )}
            </span>
            {currentId && (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400">
                <Lock className="h-3 w-3" />
                Locked
              </span>
            )}
          </div>

          {/* Locked message */}
          {currentId && (
            <div className="flex items-start gap-2 text-xs font-mono text-amber-400/80 bg-amber-950/20 border border-amber-900/30 p-2.5">
              <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                The ledger canister ID is locked and cannot be changed once set.
                This protects the protocol from accidental misconfiguration.
              </span>
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-white">
                New Canister ID <span className="text-destructive">*</span>
              </Label>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder={
                  currentId ? "Locked — cannot be changed" : "aaaaa-aa"
                }
                disabled={!!currentId}
                className="mt-1.5 border border-green-500 bg-black text-green-400 font-mono px-2 py-1 w-full rounded-none text-sm placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="akk_ledger.input"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                size="sm"
                disabled={setCanisterId.isPending || !!currentId}
                className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                data-ocid="akk_ledger.save_button"
              >
                <Cpu className="h-3.5 w-3.5" />
                {setCanisterId.isPending
                  ? "Saving…"
                  : currentId
                    ? "Locked"
                    : "Save"}
              </Button>
              {saveMsg && (
                <span
                  className={`flex items-center gap-1 text-xs font-mono ${
                    saveMsg.type === "success"
                      ? "text-emerald-400"
                      : "text-destructive"
                  }`}
                  data-ocid={`akk_ledger.${
                    saveMsg.type === "success" ? "success_state" : "error_state"
                  }`}
                >
                  {saveMsg.type === "success" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  {saveMsg.text}
                </span>
              )}
            </div>
          </form>
        </>
      )}

      {/* ─── AKK Transfer Fee Subsection ───────────────────────────────────── */}
      <div className="border-t border-border pt-5 space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-foreground">
            AKK TRANSFER FEE
          </h3>
        </div>

        {feeLoading ? (
          <div className="space-y-2" data-ocid="akk_fee.loading_state">
            <div className="h-4 w-32 bg-muted animate-pulse" />
            <div className="h-10 w-full bg-muted animate-pulse" />
          </div>
        ) : (
          <form onSubmit={handleFeeSave} className="space-y-3">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-white">
                Fee (e8s) <span className="text-destructive">*</span>
              </Label>
              <input
                type="number"
                min="0"
                step="1"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                placeholder="10000"
                className="mt-1.5 border border-green-500 bg-black text-green-400 font-mono px-2 py-1 w-full rounded-none text-sm placeholder:text-muted-foreground"
                data-ocid="akk_fee.input"
              />
              <p className="text-xs font-mono text-muted-foreground mt-1">
                = {feeInAkk} AKK
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                size="sm"
                disabled={setFee.isPending}
                className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                data-ocid="akk_fee.save_button"
              >
                <DollarSign className="h-3.5 w-3.5" />
                {setFee.isPending ? "Saving…" : "Save"}
              </Button>
              {feeMsg && (
                <span
                  className={`flex items-center gap-1 text-xs font-mono ${
                    feeMsg.type === "success"
                      ? "text-emerald-400"
                      : "text-destructive"
                  }`}
                  data-ocid={`akk_fee.${
                    feeMsg.type === "success" ? "success_state" : "error_state"
                  }`}
                >
                  {feeMsg.type === "success" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  {feeMsg.text}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function LaunchGateSection() {
  const { data: config, isLoading } = useGetLaunchGateConfig();
  const setLaunchTimeGate = useSetLaunchTimeGate();
  const setNftGate = useSetNftGate();

  const [launchTimeEnabled, setLaunchTimeEnabled] = useState(false);
  const [launchTimeValue, setLaunchTimeValue] = useState("");
  const [nftGateEnabled, setNftGateEnabled] = useState(false);
  const [timeSaveMsg, setTimeSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [nftSaveMsg, setNftSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!config) return;
    setLaunchTimeEnabled(config.launchTimeEnabled);
    setNftGateEnabled(config.nftGateEnabled);
    if (Number(config.launchTime) > 0) {
      setLaunchTimeValue(
        new Date(Number(config.launchTime)).toISOString().slice(0, 16),
      );
    } else {
      setLaunchTimeValue("");
    }
  }, [config]);

  async function handleSaveLaunchTime(e: React.FormEvent) {
    e.preventDefault();
    setTimeSaveMsg(null);
    try {
      const ms = new Date(launchTimeValue).getTime();
      await setLaunchTimeGate.mutateAsync({
        enabled: launchTimeEnabled,
        launchTime: BigInt(ms),
      });
      setTimeSaveMsg({ type: "success", text: "Saved!" });
      setTimeout(() => setTimeSaveMsg(null), 3000);
    } catch {
      setTimeSaveMsg({ type: "error", text: "Failed to save" });
    }
  }

  async function handleSaveNftGate(e: React.FormEvent) {
    e.preventDefault();
    setNftSaveMsg(null);
    try {
      await setNftGate.mutateAsync(nftGateEnabled);
      setNftSaveMsg({ type: "success", text: "Saved!" });
      setTimeout(() => setNftSaveMsg(null), 3000);
    } catch {
      setNftSaveMsg({ type: "error", text: "Failed to save" });
    }
  }

  return (
    <div
      className="border border-border bg-card p-5 space-y-6"
      data-ocid="launch_gate.section"
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-display text-xl font-semibold uppercase tracking-widest text-foreground">
          LAUNCH GATE ACCESS
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-2" data-ocid="launch_gate.loading_state">
          <div className="h-4 w-48 bg-muted animate-pulse" />
          <div className="h-10 w-full bg-muted animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* ─── LAUNCH TIME GATE subsection ─────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm uppercase tracking-widest text-primary">
              LAUNCH TIME GATE
            </h4>

            <form onSubmit={handleSaveLaunchTime} className="space-y-4">
              {/* Toggle */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-mono uppercase tracking-widest text-white">
                  Enable
                </Label>
                <button
                  type="button"
                  onClick={() => setLaunchTimeEnabled((v) => !v)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    launchTimeEnabled
                      ? "border-green-500 bg-green-500/20"
                      : "border-border bg-muted/30"
                  }`}
                  aria-label="Toggle launch time gate"
                  data-ocid="launch_gate.time_toggle"
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 rounded-full shadow-md ring-0 transition-transform ${
                      launchTimeEnabled
                        ? "translate-x-5 bg-green-400"
                        : "translate-x-0.5 bg-muted-foreground"
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-mono font-semibold ${
                    launchTimeEnabled ? "text-green-400" : "text-yellow-400"
                  }`}
                  data-ocid="launch_gate.time_status_display"
                >
                  {launchTimeEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>

              {/* Datetime input */}
              {launchTimeEnabled && (
                <div>
                  <Label className="text-xs font-mono uppercase tracking-widest text-white">
                    Launch Time (UTC){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <input
                    type="datetime-local"
                    value={launchTimeValue}
                    onChange={(e) => setLaunchTimeValue(e.target.value)}
                    className="mt-1.5 border border-green-500 bg-black text-green-400 font-mono px-2 py-1 w-full rounded-none text-sm"
                    data-ocid="launch_gate.time_input"
                  />
                </div>
              )}

              {/* Save + feedback */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={setLaunchTimeGate.isPending}
                  className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                  data-ocid="launch_gate.save_time_button"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {setLaunchTimeGate.isPending ? "Saving…" : "SAVE"}
                </Button>
                {timeSaveMsg && (
                  <span
                    className={`flex items-center gap-1 text-xs font-mono ${
                      timeSaveMsg.type === "success"
                        ? "text-emerald-400"
                        : "text-destructive"
                    }`}
                    data-ocid={`launch_gate.${
                      timeSaveMsg.type === "success"
                        ? "time_success_state"
                        : "time_error_state"
                    }`}
                  >
                    {timeSaveMsg.type === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                    {timeSaveMsg.text}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* ─── NFT GATE subsection ─────────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm uppercase tracking-widest text-primary">
              NFT GATE
            </h4>

            <form onSubmit={handleSaveNftGate} className="space-y-4">
              {/* Toggle */}
              <div className="flex items-center gap-3">
                <Label className="text-xs font-mono uppercase tracking-widest text-white">
                  Enable
                </Label>
                <button
                  type="button"
                  onClick={() => setNftGateEnabled((v) => !v)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    nftGateEnabled
                      ? "border-green-500 bg-green-500/20"
                      : "border-border bg-muted/30"
                  }`}
                  aria-label="Toggle NFT gate"
                  data-ocid="launch_gate.nft_toggle"
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 rounded-full shadow-md ring-0 transition-transform ${
                      nftGateEnabled
                        ? "translate-x-5 bg-green-400"
                        : "translate-x-0.5 bg-muted-foreground"
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-mono font-semibold ${
                    nftGateEnabled ? "text-green-400" : "text-yellow-400"
                  }`}
                  data-ocid="launch_gate.nft_status_display"
                >
                  {nftGateEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>

              {/* Save + feedback */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={setNftGate.isPending}
                  className="bg-accent text-accent-foreground hover:bg-accent/80 gap-1.5 text-xs transition-smooth"
                  data-ocid="launch_gate.save_nft_button"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {setNftGate.isPending ? "Saving…" : "SAVE"}
                </Button>
                {nftSaveMsg && (
                  <span
                    className={`flex items-center gap-1 text-xs font-mono ${
                      nftSaveMsg.type === "success"
                        ? "text-emerald-400"
                        : "text-destructive"
                    }`}
                    data-ocid={`launch_gate.${
                      nftSaveMsg.type === "success"
                        ? "nft_success_state"
                        : "nft_error_state"
                    }`}
                  >
                    {nftSaveMsg.type === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                    {nftSaveMsg.text}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Not Authorized ───────────────────────────────────────────────────────────
function NotAuthorized() {
  return (
    <div
      className="flex-1 flex items-center justify-center min-h-[60vh]"
      data-ocid="admin.not_authorized"
    >
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 border border-destructive/30 bg-destructive/5 flex items-center justify-center mx-auto">
          <ShieldAlert className="h-8 w-8 text-destructive/60" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Not Authorized
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            This panel is restricted to protocol administrators.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export function AdminPage() {
  const { isAuthenticated } = useAuth();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  if (!isAuthenticated || (!isAdminLoading && !isAdmin)) {
    return <NotAuthorized />;
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
      data-ocid="admin.page"
    >
      {/* Page header */}
      <div className="min-w-0">
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
          ADMIN PANEL
        </h1>
        <p className="text-white text-sm mt-1 max-w-md">
          Manage the ERC-20 burn allowlist and protocol settings
        </p>
      </div>

      {/* Main tabs */}
      <Tabs defaultValue="tokens" data-ocid="admin.tabs">
        <TabsList
          className="bg-muted/40 border border-border h-auto p-0.5 gap-0.5 flex-wrap"
          data-ocid="admin.tabs_list"
        >
          <TabsTrigger
            value="tokens"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="admin.allowed_tokens_tab"
          >
            <span className="sm:hidden">TOKENS</span>
            <span className="hidden sm:inline">ALLOWED TOKENS</span>
          </TabsTrigger>
          <TabsTrigger
            value="protocol"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="admin.protocol_settings_tab"
          >
            <span className="sm:hidden">SETTINGS</span>
            <span className="hidden sm:inline">PROTOCOL SETTINGS</span>
          </TabsTrigger>
          <TabsTrigger
            value="testing"
            className="font-accent text-sm uppercase tracking-widest h-9 px-3 sm:px-4 data-[state=active]:bg-card data-[state=active]:text-[#00ff41] text-white hover:text-[#00ff41] transition-smooth"
            data-ocid="admin.testing_tab"
          >
            TESTING
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-6 space-y-8">
          <AllowedTokensTab />
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <h2 className="font-display text-2xl uppercase tracking-widest text-foreground">
                AUDIT LOG
              </h2>
            </div>
            <AuditLogTab />
          </div>
        </TabsContent>

        <TabsContent value="protocol" className="mt-6">
          <MintRetryQueuePanel />
          <div className="mt-6">
            <AkkLedgerSection />
          </div>
          <div className="mt-6">
            <FeeSettingsTab />
          </div>
          <div className="mt-6">
            <MiningFeesTab />
          </div>
          <div className="mt-6">
            <LaunchGateSection />
          </div>
          <div className="mt-6">
            <AdminManagementSection />
          </div>
        </TabsContent>

        <TabsContent value="testing" className="mt-6 space-y-8">
          <ScoreOverrideSection />
          <div className="border-t border-green-900/30 pt-6">
            <SupplyAuditSection />
          </div>
          <div className="border-t border-green-900/30 pt-6">
            <CreditAbandonedMintsSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── MintRetryQueuePanel ────────────────────────────────────────────────────
function MintRetryQueuePanel() {
  const { data: stats, refetch: refetchStats } = useGetMintRetryStats();
  const { data: pending, refetch: refetchPending } = useGetPendingMints();
  const { data: abandoned, refetch: refetchAbandoned } = useGetAbandonedMints();
  const retryMint = useRetryMint();
  const [showAbandoned, setShowAbandoned] = useState(false);

  const refresh = () => {
    refetchStats();
    refetchPending();
    refetchAbandoned();
  };

  const formatOwner = (p: { toString(): string }) => {
    const s = p.toString();
    return s.length > 14 ? `${s.slice(0, 8)}...${s.slice(-4)}` : s;
  };
  const formatAkk = (e8s: bigint) => (Number(e8s) / 1e8).toFixed(4);
  const formatTime = (ns: bigint) =>
    ns === 0n ? "—" : new Date(Number(ns / 1_000_000n)).toLocaleString();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-['VT323'] text-white text-xl tracking-widest uppercase">
          MINT RETRY QUEUE
        </h3>
        <button
          type="button"
          onClick={refresh}
          className="font-['VT323'] text-green-400 text-base tracking-widest hover:text-green-300 transition-colors"
        >
          [REFRESH QUEUE] →
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "QUEUE DEPTH",
            value: stats ? Number(stats.queueDepth) : "—",
          },
          { label: "RETRIED", value: stats ? Number(stats.totalRetried) : "—" },
          {
            label: "SUCCEEDED",
            value: stats ? Number(stats.totalSucceeded) : "—",
          },
          {
            label: "ABANDONED",
            value: stats ? Number(stats.totalAbandoned) : "—",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="border border-green-900/40 bg-black/30 p-3 text-center"
          >
            <div className="font-['VT323'] text-green-500/70 text-xs tracking-widest uppercase">
              {label}
            </div>
            <div className="font-['VT323'] text-green-400 text-2xl">
              {String(value)}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-green-900/40">
        <div className="overflow-x-auto">
          {!pending || pending.length === 0 ? (
            <p className="font-['VT323'] text-green-700 text-sm p-3 tracking-widest">
              No pending mints.
            </p>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-green-900/40">
                  {[
                    "BLOCK #",
                    "OWNER",
                    "AMOUNT",
                    "ATTEMPTS",
                    "LAST ATTEMPT",
                    "ERROR",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="font-['VT323'] text-white text-left px-3 py-2 tracking-widest text-sm whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((entry) => (
                  <tr
                    key={Number(entry.blockId)}
                    className="border-b border-green-900/20 hover:bg-green-900/5"
                  >
                    <td className="px-3 py-2 text-green-300">
                      {Number(entry.blockId)}
                    </td>
                    <td className="px-3 py-2 text-green-400/70">
                      {formatOwner(entry.owner)}
                    </td>
                    <td className="px-3 py-2 text-white">
                      {formatAkk(entry.amount)}
                    </td>
                    <td className="px-3 py-2 text-green-300">
                      {Number(entry.attempts)}
                    </td>
                    <td className="px-3 py-2 text-green-400/60 whitespace-nowrap">
                      {formatTime(entry.lastAttemptTime)}
                    </td>
                    <td className="px-3 py-2 text-red-400/70 max-w-32 truncate">
                      {entry.error}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => retryMint.mutate(entry.blockId)}
                        className="font-['VT323'] text-green-400 border border-green-700 px-2 py-0.5 text-sm hover:bg-green-900/30 tracking-widest"
                      >
                        [RETRY]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAbandoned((s) => !s)}
          className="font-['VT323'] text-green-400 text-base tracking-widest hover:text-green-300 transition-colors"
        >
          [ABANDONED MINTS] {showAbandoned ? "↑" : "↓"}
        </button>
        {showAbandoned && (
          <div className="border border-green-900/40 mt-2 overflow-x-auto">
            {!abandoned || abandoned.length === 0 ? (
              <p className="font-['VT323'] text-green-700 text-sm p-3 tracking-widest">
                No abandoned mints.
              </p>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-green-900/40">
                    {[
                      "BLOCK #",
                      "OWNER",
                      "AMOUNT",
                      "ATTEMPTS",
                      "LAST ATTEMPT",
                      "ERROR",
                    ].map((h) => (
                      <th
                        key={h}
                        className="font-['VT323'] text-white text-left px-3 py-2 tracking-widest text-sm whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {abandoned.map((entry) => (
                    <tr
                      key={Number(entry.blockId)}
                      className="border-b border-green-900/20"
                    >
                      <td className="px-3 py-2 text-green-300">
                        {Number(entry.blockId)}
                      </td>
                      <td className="px-3 py-2 text-green-400/70">
                        {formatOwner(entry.owner)}
                      </td>
                      <td className="px-3 py-2 text-white">
                        {formatAkk(entry.amount)}
                      </td>
                      <td className="px-3 py-2 text-red-400">
                        {Number(entry.attempts)}
                      </td>
                      <td className="px-3 py-2 text-green-400/60 whitespace-nowrap">
                        {formatTime(entry.lastAttemptTime)}
                      </td>
                      <td className="px-3 py-2 text-red-400/70 max-w-32 truncate">
                        {entry.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
