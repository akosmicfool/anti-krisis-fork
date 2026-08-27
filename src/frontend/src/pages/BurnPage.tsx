import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Flame,
  Info,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Link } from "@tanstack/react-router";
import { http, createPublicClient, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import { useReadContracts } from "wagmi";
import { BurnProgressModal } from "../components/BurnProgressModal";
import { ClaimStatusBadge } from "../components/ClaimStatusBadge";
import { WalletButton } from "../components/WalletButton";
import { useAuth } from "../hooks/use-auth";
import {
  useGetFeePercent,
  useGetFeeRecipient,
  useGetGritIssuanceRate,
  useGetLaunchGateConfig,
  useGetTokens,
  useInitiateClaim,
  useLiveTokenPrice,
  useMyBalance,
  useMyClaimHistory,
  useRetryFeeClaim,
} from "../hooks/use-backend";
import { type PlatformFeeInfo, useWallet } from "../hooks/use-wallet";
import { KVCM_RETIREMENT, retireKvcm } from "../lib/kvcm-retirement";
import {
  CHAIN_LABELS,
  ClaimStatus,
  formatGrit,
  formatUSDValue,
  getChainId,
  getClaimStatus,
  getExplorerUrl,
  isPendingFee,
  truncateAddress,
} from "../types";
import type { AllowlistedToken } from "../types";
import { ETH_RPC_ENDPOINTS } from "../utils/evm-rpc";

type BurnStep =
  | "idle"
  | "burning"
  | "awaiting_confirm"
  | "confirming_on_chain"
  | "paying_fee"
  | "awaiting_fee_confirm"
  | "submitting_claim"
  | "pending_verification"
  | "pending_fee"
  | "verified"
  | "failed";

export type { BurnStep };

const STEP_BUTTON_LABELS: Partial<Record<BurnStep, string>> = {
  burning: "Preparing transaction…",
  awaiting_confirm: "Awaiting wallet confirmation…",
  confirming_on_chain: "Waiting for RPC indexing…",
  paying_fee: "Calculating platform fee…",
  awaiting_fee_confirm: "Awaiting fee payment confirmation…",
  submitting_claim: "Submitting claim to ICP…",
  pending_verification: "Pending — monitoring transaction…",
};

// ─── Auth gate ────────────────────────────────────────────────────────────────
function AuthGate({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="burn.auth_gate"
    >
      <div className="w-16 h-16 rounded-none border border-accent/40 bg-accent/5 flex items-center justify-center mb-6">
        <Shield className="h-7 w-7 text-accent" />
      </div>
      <h2 className="text-3xl font-display font-black tracking-tight text-foreground mb-2 uppercase">
        Identity Required
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        Connect your Internet Identity to begin burning tokens and accumulating
        GRIT fuel.
      </p>
      <Button
        onClick={onLogin}
        className="bg-accent text-background hover:bg-accent/90 font-display font-bold tracking-widest gap-2 h-12 px-8 transition-smooth uppercase"
        data-ocid="burn.connect_identity_button"
      >
        <Shield className="h-4 w-4" />
        Connect Internet Identity
      </Button>
    </motion.div>
  );
}

// ─── Wallet gate ──────────────────────────────────────────────────────────────
function WalletGate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="burn.wallet_gate"
    >
      <div className="w-16 h-16 rounded-none border border-border bg-muted/30 flex items-center justify-center mb-6">
        <Zap className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-display font-black tracking-tight text-foreground mb-2 uppercase">
        Connect EVM Wallet
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        Link your MetaMask or browser wallet to sign the burn transaction on
        Base.
      </p>
      <WalletButton />
    </motion.div>
  );
}

// ─── Wrong chain banner ───────────────────────────────────────────────────────
function WrongChainBanner({
  chainLabel,
  onSwitch,
}: {
  chainLabel: string;
  onSwitch: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 flex items-center justify-between gap-3"
      data-ocid="burn.wrong_chain_banner"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200">
          Your wallet is not on{" "}
          <span className="font-bold text-amber-300">{chainLabel}</span>. Switch
          networks to continue.
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSwitch}
        className="shrink-0 bg-amber-500/20 border border-amber-500/50 text-amber-200 hover:bg-amber-500/30 font-mono text-xs uppercase tracking-widest h-8 px-3"
        data-ocid="burn.switch_chain_button"
      >
        Switch to {chainLabel}
      </Button>
    </motion.div>
  );
}

// ─── Token balance display ──────────────────────────────────────────────────
async function readEthContractWithFallback(
  contractAddress: string,
  abi: readonly {
    name: string;
    type: string;
    stateMutability: string;
    inputs: readonly { name: string; type: string }[];
    outputs: readonly { name: string; type: string }[];
  }[],
  functionName: string,
  args: readonly unknown[],
): Promise<bigint> {
  for (const rpcUrl of ETH_RPC_ENDPOINTS) {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
      });
      const result = await Promise.race([
        client.readContract({
          address: contractAddress as `0x${string}`,
          abi,
          functionName,
          args,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 5000),
        ),
      ]);
      return result as bigint;
    } catch {
      // try next endpoint
    }
  }
  return BigInt(0);
}

const ERC20_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

function TokenBalanceDisplay({
  selectedToken,
  walletAddress,
  livePrice,
}: {
  selectedToken: AllowlistedToken | null;
  walletAddress: `0x${string}` | undefined;
  livePrice: number | null;
}) {
  const isEthereum = selectedToken?.chain === "ethereum";
  const [ethBalance, setEthBalance] = useState<bigint | null>(null);

  useEffect(() => {
    if (!isEthereum || !selectedToken || !walletAddress) {
      setEthBalance(null);
      return;
    }
    let cancelled = false;
    readEthContractWithFallback(
      selectedToken.tokenAddress,
      ERC20_BALANCE_ABI,
      "balanceOf",
      [walletAddress],
    ).then((bal) => {
      if (!cancelled) setEthBalance(bal);
    });
    return () => {
      cancelled = true;
    };
  }, [isEthereum, selectedToken, walletAddress]);

  const contracts =
    !isEthereum && selectedToken && walletAddress
      ? [
          {
            address: selectedToken.tokenAddress as `0x${string}`,
            abi: ERC20_BALANCE_ABI,
            functionName: "balanceOf" as const,
            args: [walletAddress],
            chainId: getChainId(selectedToken.chain),
          },
        ]
      : [];

  const { data: balanceResults } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  if (!selectedToken || !walletAddress) return null;

  const rawValue = isEthereum
    ? (ethBalance ?? BigInt(0))
    : balanceResults?.[0]?.status === "success"
      ? (balanceResults[0].result as bigint)
      : BigInt(0);
  const decimals = Number(selectedToken.decimals);
  const rawBalance = Number.parseFloat(formatUnits(rawValue, decimals));
  const usdValue = rawBalance * (livePrice ?? 0);
  const formattedBalance = rawBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedUsd =
    usdValue < 0.01
      ? "<$0.01"
      : `$${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <p
      className="text-xs text-muted-foreground font-mono mt-1"
      data-ocid="burn.token_balance_display"
    >
      Balance :{" "}
      <span className="text-foreground font-semibold">
        {formattedBalance} {selectedToken.symbol}
      </span>{" "}
      ~ {formattedUsd}
    </p>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function BurnPage({ embedded = false }: { embedded?: boolean }) {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const wallet = useWallet();
  const { data: tokens, isLoading: tokensLoading } = useGetTokens();
  const { data: claimHistory, refetch: refetchHistory } = useMyClaimHistory();
  const initiateClaim = useInitiateClaim();
  const { data: feeRecipient } = useGetFeeRecipient();
  const { data: feePercent } = useGetFeePercent();
  // Convert percent (e.g. 0.42) to decimal rate (e.g. 0.0042) for fee calculations.
  // Fall back to 0.0069 only while the backend value is still loading.
  const feeRate = feePercent != null ? feePercent / 100 : 0.0069;
  const feeDisplay = feePercent != null ? `${feePercent.toFixed(2)}%` : "…%";
  const { data: gritBalance } = useMyBalance();

  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [selectedToken, setSelectedToken] = useState<AllowlistedToken | null>(
    null,
  );
  const [amount, setAmount] = useState<string>("");
  const [step, setStep] = useState<BurnStep>("idle");
  const stepRef = useRef<BurnStep>("idle");
  const setStepAndRef = useCallback((s: BurnStep) => {
    setStep(s);
    stepRef.current = s;
  }, []);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [_confirmCountdown, setConfirmCountdown] = useState<number>(0);
  const [verifiedGrit, setVerifiedGrit] = useState<bigint | null>(null);
  const [_feeInfo, setFeeInfo] = useState<PlatformFeeInfo | null>(null);
  const [_feeTxHash, setFeeTxHash] = useState<string | null>(null);
  const [_retryingFee, setRetryingFee] = useState<boolean>(false);
  const [_retryFeeMsg, setRetryFeeMsg] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [priceNote, setPriceNote] = useState<string | null>(null);
  const [userRejected, setUserRejected] = useState<boolean>(false);
  const burnChainIdRef = useRef<number>(1);
  const burnValueUsdRef = useRef<number>(0);

  const retryFeeClaim = useRetryFeeClaim();

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const priceNoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const claimedTxRef = useRef<string | null>(null);

  // Derive chains that have at least one token (for the chain filter dropdown)
  const availableChains = Array.from(
    new Set((tokens ?? []).map((t) => t.chain)),
  );

  // Tokens filtered by selected chain
  const filteredTokens =
    selectedChain === "all"
      ? (tokens ?? [])
      : (tokens ?? []).filter((t) => t.chain === selectedChain);

  // Gas currency label by chain
  function gasTokenForChain(chain: string): string {
    return chain === "celo" ? "CELO" : "ETH";
  }

  // Live price fetch — re-runs when selected token changes
  const qc = useQueryClient();

  const {
    data: livePrice,
    isLoading: priceLoading,
    isError: priceError,
    refetch: refetchPrice,
  } = useLiveTokenPrice(selectedToken?.tokenAddress ?? null);

  const priceUnavailable =
    selectedToken !== null && !priceLoading && (priceError || !livePrice);

  // ── Launch Gate + NFT check ───────────────────────────────────────────────
  const { data: launchGateData } = useGetLaunchGateConfig();
  const [isNftHolder, setIsNftHolder] = useState(true);

  // Countdown state for launch time gate
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!launchGateData?.launchTimeEnabled || !launchGateData.launchTime)
      return;
    const target = Number(launchGateData.launchTime);
    if (Date.now() >= target) return;

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [launchGateData?.launchTimeEnabled, launchGateData?.launchTime]);

  useEffect(() => {
    const evmAddress = wallet.address;
    if (!evmAddress) {
      setIsNftHolder(true);
      return;
    }
    const NFT_ABI = [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "owner", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const;
    const NFT_CONTRACTS = [
      "0x48e727F3052ea0497e5d939B9B52a1B601F166bb",
      "0x9c4642e8456e05BCF3da1922eE9ee5868A602cbA",
    ] as const;
    let cancelled = false;
    async function checkNfts() {
      try {
        const results = await Promise.all(
          NFT_CONTRACTS.map((addr) =>
            readEthContractWithFallback(addr, NFT_ABI, "balanceOf", [
              evmAddress as `0x${string}`,
            ]),
          ),
        );
        if (!cancelled) {
          setIsNftHolder(results.every((bal) => (bal as bigint) > 0n));
        }
      } catch {
        if (!cancelled) setIsNftHolder(false);
      }
    }
    void checkNfts();
    return () => {
      cancelled = true;
    };
  }, [wallet.address]);

  const isGateActive = !!(
    launchGateData?.nftGateEnabled &&
    Date.now() >= Number(launchGateData.startTime ?? 0) &&
    Date.now() <= Number(launchGateData.endTime ?? 0)
  );
  const isLaunchTimeBlocked = !!(
    launchGateData?.launchTimeEnabled &&
    Date.now() < Number(launchGateData.launchTime ?? 0)
  );
  const isBurnBlocked = (isGateActive && !isNftHolder) || isLaunchTimeBlocked;

  // GRIT estimate — floating-point math so fractional amounts (e.g. 0.1, 0.001)
  // are handled correctly. BigInt integer division would floor sub-1-token amounts
  // to 0 before the price multiplication, so we use floats throughout.
  // Formula: floor(amount * tokenPriceUSD * gritIssuanceRate)
  //   amount * tokenPriceUSD  → USD value burned
  //   * gritIssuanceRate      → GRIT per $1 burned
  // Format issuance rate as short form: 100_000_000_000 -> "100B", 1_000_000_000 -> "1B"
  function formatGritRate(rate: bigint): string {
    const n = Number(rate);
    if (n >= 1_000_000_000_000) return `${n / 1_000_000_000_000}T`;
    if (n >= 1_000_000_000) return `${n / 1_000_000_000}B`;
    if (n >= 1_000_000) return `${n / 1_000_000}M`;
    return n.toLocaleString("en-US");
  }
  const { data: gritIssuanceRate } = useGetGritIssuanceRate();
  const effectiveRate = gritIssuanceRate ?? BigInt(100_000_000_000);
  const parsedAmount = amount.trim() ? Number.parseFloat(amount.trim()) : 0;
  const priceLoaded = !priceLoading && !!livePrice && livePrice > 0;
  const gritEstimate = (() => {
    if (!selectedToken || parsedAmount <= 0 || !livePrice || livePrice <= 0)
      return 0;
    return Math.floor(parsedAmount * livePrice * Number(effectiveRate));
  })();

  // Poll for verification
  useEffect(() => {
    if (step !== "pending_verification" || !claimedTxRef.current) return;

    // Hard timeout: stop polling after 35 minutes and do a final sync.
    const POLL_TIMEOUT_MS = 35 * 60 * 1_000;
    const startedAt = Date.now();

    async function stopPolling(reason: "timeout" | "settled") {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      // Claim settled (or timed out) — never flash the "price busy" note after.
      if (priceNoteTimerRef.current) {
        clearTimeout(priceNoteTimerRef.current);
        priceNoteTimerRef.current = null;
      }
      // Always do a final re-fetch so the claim list reflects the latest
      // backend state — catches the case where the backend already settled
      // the claim while we were polling with a stale in-memory copy.
      await refetchHistory();
      if (reason === "timeout") {
        // Backend is still working — leave step as pending_verification so
        // the user sees the amber banner. The 8s auto-refetch on
        // useMyClaimHistory will update the history card automatically.
        setErrorMsg(
          "Verification is taking longer than usual. We're still monitoring — your GRIT will be credited once confirmed.",
        );
      }
    }

    // AKK-3 UX nicety (all allowlisted tokens, incl. kVCM retirement): if the
    // claim isn't verified within ~20s — e.g. the price service is busy, so the
    // backend leaves the claim pending and retries (fail-closed) — reassure the
    // user instead of leaving them in silent limbo. Cleared on settle.
    priceNoteTimerRef.current = setTimeout(() => {
      priceNoteTimerRef.current = null;
      // Functional update: keep a more specific already-shown note if present.
      setPriceNote(
        (prev) =>
          prev ??
          "Price service is busy — your burn is still being verified and your GRIT will be credited automatically. No action needed.",
      );
    }, 20_000);

    pollingRef.current = setInterval(async () => {
      // Check hard timeout first.
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        await stopPolling("timeout");
        return;
      }

      const result = await refetchHistory();
      const records = result.data ?? [];
      const match = records.find((r) => r.txHash === claimedTxRef.current);
      if (!match) return;

      if (match.status === ClaimStatus.verified) {
        // Immediately refetch the balance so it reflects the newly minted GRIT.
        setTimeout(() => {
          qc.invalidateQueries({ queryKey: ["myBalance"] });
          qc.refetchQueries({ queryKey: ["myBalance"] });
        }, 1_500);
        setVerifiedGrit(match.gritMinted);
        setStepAndRef("verified");
        // Claim settled successfully — retire the reassurance note.
        setPriceNote(null);
        await stopPolling("settled");
      } else if (isPendingFee(match.status)) {
        // Burn verified but fee payment failed — prompt user to retry fee.
        setStepAndRef("pending_fee");
        await stopPolling("settled");
      } else if (match.status === ClaimStatus.failed) {
        setStepAndRef("failed");
        setErrorMsg(
          "Verification failed — transaction could not be confirmed on-chain.",
        );
        await stopPolling("settled");
      }
      // ClaimStatus.pending: keep polling — backend timer will recheck.
    }, 3_000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      if (priceNoteTimerRef.current) {
        clearTimeout(priceNoteTimerRef.current);
        priceNoteTimerRef.current = null;
      }
    };
  }, [step, refetchHistory, qc, setStepAndRef]);

  async function handleSwitchChain() {
    if (!selectedToken) return;
    const targetChainId = getChainId(selectedToken.chain);
    const targetLabel =
      CHAIN_LABELS[selectedToken.chain] ?? selectedToken.chain;
    try {
      await wallet.switchToChain(targetChainId);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : `Failed to switch to ${targetLabel}. Please switch manually in your wallet.`,
      );
    }
  }

  async function handleBurn() {
    if (!selectedToken || !amount || !wallet.address) return;
    const parsedAmt = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmt) || parsedAmt <= 0) return;

    // Guard: fee recipient must be configured before a burn can proceed
    if (!feeRecipient || !feeRecipient.startsWith("0x")) {
      setErrorMsg(
        "Platform fee recipient is not configured. Please ask an admin to set the fee address in the Admin Panel before burning.",
      );
      return;
    }

    setErrorMsg(null);
    setFeeInfo(null);
    setFeeTxHash(null);
    setStepAndRef("burning");
    setModalOpen(true);

    try {
      const tokenDecimals = Number(selectedToken.decimals);
      const targetChainId = getChainId(selectedToken.chain);

      setStepAndRef("awaiting_confirm");

      // Step 1: Burn the token.
      // kVCM retires real carbon credits through the KlimaDAO Retirement
      // Aggregator (approve AAM -> retireCreditViaKlima) instead of a plain
      // ERC-20 transfer-to-dead-address. All other tokens keep the standard
      // burn flow.
      const isKvcm =
        selectedToken.tokenAddress.toLowerCase() ===
        KVCM_RETIREMENT.kvcm.toLowerCase();
      let hash: string;
      if (isKvcm) {
        const retirement = await retireKvcm({
          amount: amount.trim(),
          beneficiaryAddress: wallet.address as `0x${string}`,
          sendContractTransaction: wallet.sendContractTransaction,
        });
        hash = retirement.retireHash;
      } else {
        const AXLREGEN_ADDR = "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754";
        const effectiveDecimals =
          selectedToken.tokenAddress.toLowerCase() === AXLREGEN_ADDR
            ? 6
            : tokenDecimals;
        hash = await wallet.burnToken(
          selectedToken.tokenAddress,
          amount.trim(),
          effectiveDecimals,
          targetChainId,
        );
      }

      setTxHash(hash);
      setStepAndRef("confirming_on_chain");

      // Wait 15 seconds for the RPC node to index the burn transaction.
      const DELAY_SECS = 15;
      setConfirmCountdown(DELAY_SECS);
      await new Promise<void>((resolve) => {
        let remaining = DELAY_SECS;
        const ticker = setInterval(() => {
          remaining -= 1;
          setConfirmCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(ticker);
            resolve();
          }
        }, 1000);
      });
      setConfirmCountdown(0);

      // Step 2: Calculate and send platform fee (0.69% of burn USD value)
      setStepAndRef("paying_fee");
      const burnValueUsd = parsedAmt * (livePrice ?? 0);
      burnValueUsdRef.current = burnValueUsd;
      burnChainIdRef.current = targetChainId;
      const feeData = await wallet.getPlatformFeeInfo(
        burnValueUsd,
        targetChainId,
        feeRate,
      );
      setFeeInfo(feeData);

      setStepAndRef("awaiting_fee_confirm");
      const feeHash = await wallet.sendPlatformFee(
        burnValueUsd,
        targetChainId,
        feeRecipient ?? "",
        feeRate,
      );
      setFeeTxHash(feeHash);

      // Step 3: Submit claim to ICP
      setStepAndRef("submitting_claim");
      claimedTxRef.current = hash;
      await initiateClaim.mutateAsync({
        txHash: hash,
        feeTxHash: feeHash ?? "",
        tokenAddress: selectedToken.tokenAddress,
        chain: selectedToken.chain,
        frontendPrice: livePrice ?? 0,
      });

      setStepAndRef("pending_verification");
    } catch (err: unknown) {
      console.error("[handleBurn] burn failed (raw error):", err);
      if (err && typeof err === "object") {
        const e = err as Record<string, unknown>;
        if (e.code !== undefined)
          console.error("[handleBurn] error code:", e.code);
        if (e.details !== undefined)
          console.error("[handleBurn] error details:", e.details);
        if (e.cause !== undefined)
          console.error("[handleBurn] error cause:", e.cause);
      }

      // Determine if this error is a non-fatal price oracle issue that fired
      // AFTER the burn tx was already submitted (step was at submitting_claim
      // or later). In that case we must NOT mark the flow as failed — the
      // backend may have already credited GRIT successfully.
      const isPriceOracleError =
        err instanceof Error &&
        (err.message.toLowerCase().includes("price unavailable") ||
          err.message.toLowerCase().includes("network error") ||
          err.message.toLowerCase().includes("real-time price") ||
          err.message.toLowerCase().includes("fetch price") ||
          err.message.toLowerCase().includes("usd price") ||
          err.message.toLowerCase().includes("oracle") ||
          (err.message.toLowerCase().includes("price") &&
            !err.message.toLowerCase().includes("native price fetch failed") &&
            !err.message.toLowerCase().includes("invalid native token price")));

      // Steps that indicate the burn tx was already submitted
      const burnAlreadySubmitted =
        step === "submitting_claim" || step === "pending_verification";

      if (isPriceOracleError && burnAlreadySubmitted) {
        // Non-fatal: price hiccup after the burn was already on-chain.
        // Keep the step at pending_verification so the poller can still
        // detect a CONFIRMED result and credit GRIT.
        setPriceNote(
          "Price service is temporarily unavailable — your claim stays pending and GRIT will be credited automatically once pricing resumes. No action needed.",
        );
        setStepAndRef("pending_verification");
        return;
      }

      // If the error occurred while waiting for fee confirmation and it was NOT
      // a user rejection, the fee tx may still be pending on-chain (e.g. slow
      // network on Ethereum). Keep the step as awaiting_fee_confirm so the
      // modal shows the correct spinner state instead of a false failure.
      const isUserRejection =
        err instanceof Error &&
        (err.message.includes("User denied") ||
          err.message.includes("user rejected") ||
          err.message.includes("User rejected") ||
          (err as unknown as Record<string, unknown>).code === 4001);

      // Set userRejected immediately for ALL rejection paths — both
      // message-based and code-4001-based — so the modal shows
      // "Cancelled" for past steps regardless of which wallet sent the rejection.
      if (isUserRejection) {
        setUserRejected(true);
      }

      const feeStillPending =
        (stepRef.current === "paying_fee" ||
          stepRef.current === "awaiting_fee_confirm") &&
        !isUserRejection &&
        err instanceof Error &&
        !err.message.toLowerCase().includes("reverted") &&
        !err.message.toLowerCase().includes("denied") &&
        !err.message.toLowerCase().includes("rejected");

      if (feeStillPending) {
        // Fee tx was submitted but confirmation timed-out or RPC error.
        // Keep step as awaiting_fee_confirm and let the poller handle it.
        // The backend already knows the burn hash; it will settle once the
        // fee is confirmed on-chain.
        setPriceNote(
          "Platform fee is still pending on-chain — this may take a few minutes on Ethereum. Your GRIT will be credited once confirmed.",
        );
        setStepAndRef("awaiting_fee_confirm");
        return;
      }

      // Backend returned FEE_PENDING — the fee tx is still in-flight on-chain.
      // Do NOT show the amber retry UI yet. Stay in awaiting_fee_confirm and
      // start a polling loop that watches for actual on-chain resolution.
      // Only when the backend confirms a fee failure do we show the retry UI.
      const isFeeStillPendingBackend =
        err instanceof Error && err.message.includes("FEE_PENDING");
      if (isFeeStillPendingBackend) {
        setStepAndRef("awaiting_fee_confirm");
        setPriceNote(
          "Platform fee is still confirming on-chain — awaiting confirmation. Your GRIT will be credited once the fee settles.",
        );
        // Start a polling loop to detect when the fee settles on-chain.
        // Poll every 10 seconds, max 35 minutes (210 attempts).
        const FEE_POLL_INTERVAL_MS = 10_000;
        const FEE_POLL_MAX_ATTEMPTS = 210; // 35 min
        let feeAttempts = 0;
        const feePollRef = pollingRef; // reuse the existing ref slot
        if (feePollRef.current) clearInterval(feePollRef.current);
        feePollRef.current = setInterval(async () => {
          feeAttempts += 1;
          if (feeAttempts > FEE_POLL_MAX_ATTEMPTS) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setStepAndRef("failed");
            setErrorMsg(
              "Fee confirmation timed out. The platform fee did not settle within 35 minutes.",
            );
            return;
          }
          const result = await refetchHistory();
          const records = result.data ?? [];
          const match = claimedTxRef.current
            ? records.find((r) => r.txHash === claimedTxRef.current)
            : null;
          if (!match) return;

          if (match.status === ClaimStatus.verified) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setTimeout(() => {
              qc.invalidateQueries({ queryKey: ["myBalance"] });
              qc.refetchQueries({ queryKey: ["myBalance"] });
            }, 1_500);
            setVerifiedGrit(match.gritMinted);
            setStepAndRef("verified");
          } else if (isPendingFee(match.status)) {
            // Backend has confirmed the fee definitively failed — show retry.
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setStepAndRef("pending_fee");
            setPriceNote(
              "Platform fee failed on-chain — please retry the fee payment.",
            );
          } else if (match.status === ClaimStatus.failed) {
            if (feePollRef.current) {
              clearInterval(feePollRef.current);
              feePollRef.current = null;
            }
            setStepAndRef("failed");
            setErrorMsg(
              "Verification failed — transaction could not be confirmed on-chain.",
            );
          }
          // ClaimStatus.pending: keep polling — fee may still be in-flight.
        }, FEE_POLL_INTERVAL_MS);
        return;
      }

      let msg = "An unexpected error occurred.";
      if (err instanceof Error) {
        if (
          err.message.includes("User denied") ||
          err.message.includes("user rejected")
        ) {
          msg = "Wallet transaction rejected by user.";
          setUserRejected(true);
        } else if (err.message.includes("already claimed")) {
          msg = "This transaction has already been claimed.";
        } else if (err.message.includes("not on allowlist")) {
          msg = "Token is not on the allowlist.";
        } else if (err.message.includes("insufficient")) {
          msg = "Insufficient balance for this transaction.";
        } else if (err.message.includes("LAUNCH_NOT_STARTED")) {
          msg = "Launch has not started yet.";
        } else if (err.message.includes("NFT_GATE_BLOCKED")) {
          msg =
            "Launch NFTs not detected. Burn access disabled. Try again after obtaining the NFTs.";
        } else if (
          err.message.includes("Native price fetch failed") ||
          err.message.includes("Invalid native token price")
        ) {
          msg = `Could not fetch native token price for fee calculation: ${err.message}. Please try again.`;
        } else {
          msg = err.message;
        }
      }
      setErrorMsg(msg);
      setStepAndRef("failed");
    }
  }

  function handleReset() {
    setStepAndRef("idle");
    setUserRejected(false);
    setTxHash(null);
    setErrorMsg(null);
    setAmount("");
    // Keep selectedToken and selectedChain intact so the user can immediately
    // enter a new amount after a burn completes without re-selecting the token.
    setConfirmCountdown(0);
    setVerifiedGrit(null);
    setFeeInfo(null);
    setFeeTxHash(null);
    setRetryingFee(false);
    setRetryFeeMsg("");
    setModalOpen(false);
    setPriceNote(null);
    burnValueUsdRef.current = 0;
    burnChainIdRef.current = 1;
    claimedTxRef.current = null;
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (priceNoteTimerRef.current) {
      clearTimeout(priceNoteTimerRef.current);
      priceNoteTimerRef.current = null;
    }
  }

  function handleModalClose() {
    // Close the modal and reset to idle so the form is ready for a new burn
    handleReset();
  }

  function handleContinueInBackground() {
    // Just close the modal — polling continues, form stays locked
    setModalOpen(false);
  }

  // Auto-reset after a terminal state is reached while the modal is closed
  // (i.e. "Continue in Background" was used). This unlocks the form so the
  // user can start a new burn without a page refresh.
  // biome-ignore lint/correctness/useExhaustiveDependencies: handleReset is stable
  useEffect(() => {
    const isTerminalStep =
      step === "verified" || step === "failed" || step === "pending_fee";
    // Only auto-reset when modal is closed (background mode) so we don't
    // abruptly clear the modal's success/error display.
    if (isTerminalStep && !modalOpen) {
      const t = setTimeout(() => {
        handleReset();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [step, modalOpen]);
  // handleRetryFee: kept for potential future use from Burn History page
  async function _handleRetryFee() {
    if (!txHash || !feeRecipient) return;
    setRetryingFee(true);
    setRetryFeeMsg("");
    try {
      const newFeeHash = await wallet.sendPlatformFee(
        burnValueUsdRef.current,
        burnChainIdRef.current,
        feeRecipient,
        feeRate,
      );
      setFeeTxHash(newFeeHash);
      await retryFeeClaim.mutateAsync({ txHash, feeTxHash: newFeeHash });
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: ["myBalance"] });
        qc.refetchQueries({ queryKey: ["myBalance"] });
      }, 1_500);
      setStepAndRef("verified");
    } catch (err) {
      setRetryFeeMsg(
        err instanceof Error
          ? err.message
          : "Fee retry failed. Please try again.",
      );
    } finally {
      setRetryingFee(false);
    }
  }

  // ── Gate screens ─────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className={
          embedded ? "space-y-4" : "max-w-4xl mx-auto px-4 py-12 space-y-4"
        }
      >
        <Skeleton className="h-10 w-48 bg-muted" />
        <Skeleton className="h-72 w-full bg-muted" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={embedded ? "" : "max-w-4xl mx-auto px-4 py-8"}>
        <AuthGate onLogin={login} />
      </div>
    );
  }

  if (!wallet.isConnected) {
    return (
      <div className={embedded ? "" : "max-w-4xl mx-auto px-4 py-8"}>
        <WalletGate />
      </div>
    );
  }

  const isOnTargetChain =
    !selectedToken || wallet.chainId === getChainId(selectedToken.chain);

  const canBurn =
    step === "idle" &&
    selectedToken !== null &&
    amount !== "" &&
    Number.parseFloat(amount) > 0 &&
    !tokensLoading &&
    !priceLoading &&
    !priceUnavailable &&
    isOnTargetChain &&
    !isBurnBlocked;

  const isTerminal =
    step === "verified" || step === "failed" || step === "pending_fee";
  const isBusy = !isTerminal && step !== "idle";
  const isRunningInBackground = isBusy && !modalOpen;

  return (
    <div
      className={
        embedded ? "space-y-6" : "max-w-4xl mx-auto px-4 py-8 space-y-6"
      }
      data-ocid="burn.page"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[2.4rem] sm:text-[3rem] font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5">
            <Flame className="h-[1.53rem] w-[1.53rem] text-accent" />
            BURN
          </h1>
          <p className="text-white text-sm mt-0.5 break-words">
            Permanently burn RegNet tokens on supported chains and earn GRIT (
            <span className="text-accent font-mono font-bold">
              {formatGritRate(effectiveRate)} per $1
            </span>{" "}
            burned). GRIT is your non-transferable fuel to mine $AKK.
          </p>
        </div>
      </div>

      {/* Burn form */}
      <Card className="bg-card border-border" data-ocid="burn.form_card">
        <CardContent className="space-y-5 pt-6">
          {/* Launch countdown */}
          {isLaunchTimeBlocked && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded border border-accent/40 bg-accent/5 px-4 py-5 text-center space-y-2"
              data-ocid="burn.launch_countdown"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-mono">
                LAUNCH OPENS IN
              </p>
              <p className="font-mono text-2xl sm:text-3xl font-bold text-accent tracking-widest">
                {String(countdown.days).padStart(2, "0")}d{" "}
                {String(countdown.hours).padStart(2, "0")}h{" "}
                {String(countdown.minutes).padStart(2, "0")}m{" "}
                {String(countdown.seconds).padStart(2, "0")}s
              </p>
            </motion.div>
          )}

          {/* GRIT Balance */}
          {!isLaunchTimeBlocked && (
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-white font-mono">
                GRIT BALANCE
              </p>
              <div className="inline-flex items-center h-10 rounded border border-accent/30 bg-accent/5 px-3 w-fit">
                <span className="font-mono font-bold text-accent text-sm truncate">
                  {gritBalance !== undefined ? formatGrit(gritBalance) : "—"}
                </span>
              </div>
            </div>
          )}

          {/* Chain badge + wrong-chain warning */}
          {!isLaunchTimeBlocked && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white uppercase tracking-widest font-mono">
                    Connected Chain
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-mono ${
                      isOnTargetChain
                        ? "border-emerald-500/40 text-emerald-400"
                        : "border-amber-500/40 text-amber-400"
                    }`}
                    data-ocid="burn.chain_badge"
                  >
                    {wallet.chainName
                      ? (CHAIN_LABELS[wallet.chainName] ?? wallet.chainName)
                      : "Unknown"}
                  </Badge>
                </div>
                {selectedToken && !isOnTargetChain && (
                  <WrongChainBanner
                    chainLabel={
                      CHAIN_LABELS[selectedToken.chain] ?? selectedToken.chain
                    }
                    onSwitch={handleSwitchChain}
                  />
                )}
                {/* WrongChainBanner is a fallback for manual chain changes; token selection auto-switches via onValueChange */}
              </div>

              {/* Chain select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="chain-select"
                  className="text-xs uppercase tracking-widest text-white font-mono"
                >
                  Select a Chain
                </label>
                <Select
                  disabled={isBusy || isTerminal}
                  value={selectedChain}
                  onValueChange={async (val) => {
                    setSelectedChain(val);
                    setSelectedToken(null);
                    setAmount("");
                    if (val !== "all") {
                      const targetChainId = getChainId(val);
                      if (targetChainId && wallet.chainId !== targetChainId) {
                        try {
                          await wallet.switchToChain(targetChainId);
                        } catch {
                          // Silently ignore — user may have cancelled the switch
                        }
                      }
                    }
                  }}
                >
                  <SelectTrigger
                    id="chain-select"
                    className="bg-background border-border font-mono text-sm text-gray-400"
                    data-ocid="burn.chain_select"
                  >
                    <SelectValue placeholder="All Chains" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem
                      value="all"
                      className="font-mono text-sm text-gray-400"
                    >
                      All Chains
                    </SelectItem>
                    {availableChains.map((chain) => (
                      <SelectItem
                        key={chain}
                        value={chain}
                        className="font-mono text-sm text-gray-400"
                      >
                        {CHAIN_LABELS[chain] ?? chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Token select + Live price (stacked on mobile, side by side on sm+) */}
              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  {/* Token select — full width on mobile, flex-1 on sm+ */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <label
                      htmlFor="token-select"
                      className="text-xs uppercase tracking-widest text-white font-mono"
                    >
                      Select a Token
                    </label>
                    {tokensLoading ? (
                      <Skeleton
                        className="h-10 w-full bg-muted"
                        data-ocid="burn.token_loading_state"
                      />
                    ) : (
                      <Select
                        disabled={isBusy || isTerminal}
                        onValueChange={async (val) => {
                          const tok = (tokens ?? []).find(
                            (t) => `${t.chain}::${t.tokenAddress}` === val,
                          );
                          setSelectedToken(tok ?? null);
                          setAmount("");
                          if (tok) {
                            const targetChainId = getChainId(tok.chain);
                            if (
                              targetChainId &&
                              wallet.chainId !== targetChainId
                            ) {
                              try {
                                await wallet.switchToChain(targetChainId);
                              } catch {
                                // Silently ignore — user may have cancelled the switch
                              }
                            }
                          }
                        }}
                        data-ocid="burn.token_select"
                      >
                        <SelectTrigger
                          id="token-select"
                          className="bg-background border-border font-mono text-sm"
                          data-ocid="burn.token_select"
                        >
                          <SelectValue placeholder="Select a token…" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {filteredTokens.length === 0 ? (
                            <div
                              className="px-3 py-4 text-xs text-muted-foreground text-center"
                              data-ocid="burn.token_empty_state"
                            >
                              No tokens on allowlist. Ask an admin to add
                              tokens.
                            </div>
                          ) : (
                            filteredTokens.map((t) => (
                              <SelectItem
                                key={`${t.chain}-${t.tokenAddress}`}
                                value={`${t.chain}::${t.tokenAddress}`}
                                className="font-mono text-sm"
                              >
                                <span className="font-bold text-accent">
                                  {t.symbol}
                                </span>
                                <span className="text-muted-foreground ml-2 text-xs">
                                  {CHAIN_LABELS[t.chain] ?? t.chain}
                                </span>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Live price — full width on mobile, fixed width on sm+ */}
                  {selectedToken && (
                    <div className="w-full sm:w-40 sm:shrink-0">
                      <p className="text-xs uppercase tracking-widest text-white font-mono mb-1.5">
                        Live Price
                      </p>
                      <AnimatePresence mode="wait">
                        {priceLoading && (
                          <motion.div
                            key="price-loading"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="flex items-center gap-2 h-10 rounded border border-border/60 bg-muted/30 px-3"
                            data-ocid="burn.price_loading_state"
                          >
                            <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0" />
                            <p className="text-xs text-muted-foreground font-mono">
                              Fetching…
                            </p>
                          </motion.div>
                        )}
                        {!priceLoading && livePrice && (
                          <motion.div
                            key="price-ok"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="flex items-center gap-1.5 h-10 rounded border border-border/60 bg-muted/30 px-3"
                            data-ocid="burn.price_display"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span className="font-mono text-sm font-bold text-foreground">
                              $
                              {livePrice.toLocaleString("en-US", {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 8,
                              })}
                            </span>
                          </motion.div>
                        )}
                        {priceUnavailable && (
                          <motion.div
                            key="price-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 space-y-1"
                            data-ocid="burn.price_error_state"
                          >
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                              <p className="text-xs text-red-400 font-mono">
                                Unavailable
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono uppercase tracking-widest w-full"
                              onClick={() => {
                                if (selectedToken) {
                                  qc.removeQueries({
                                    queryKey: [
                                      "livePrice",
                                      selectedToken.tokenAddress,
                                    ],
                                  });
                                  void refetchPrice();
                                }
                              }}
                              data-ocid="burn.price_retry_button"
                            >
                              Retry
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Token balance — shown below when token is selected and wallet is connected */}
                <TokenBalanceDisplay
                  selectedToken={selectedToken}
                  walletAddress={
                    wallet.isConnected
                      ? (wallet.address as `0x${string}` | undefined)
                      : undefined
                  }
                  livePrice={livePrice ?? null}
                />
              </div>

              {/* Amount to Burn + Estimated GRIT (stacked on mobile, side by side on sm+) */}
              <div className="space-y-0.5">
                <label
                  htmlFor="burn-amount"
                  className="text-xs uppercase tracking-widest text-white font-mono"
                >
                  Amount to Burn
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  {/* Amount input — full width on mobile, flex-1 on sm+ */}
                  <div className="flex-1 min-w-0 relative">
                    <input
                      id="burn-amount"
                      type="number"
                      min="0"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={
                        isBusy ||
                        isTerminal ||
                        !selectedToken ||
                        priceUnavailable
                      }
                      className="w-full bg-background border border-border rounded-md h-10 px-3 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none disabled:opacity-50 transition-smooth"
                      data-ocid="burn.amount_input"
                    />
                    {selectedToken && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                        {selectedToken.symbol}
                      </span>
                    )}
                  </div>

                  {/* Estimated GRIT — full width on mobile, fixed width on sm+ */}
                  <div
                    className="w-full sm:w-40 sm:shrink-0"
                    data-ocid="burn.grit_estimate"
                  >
                    <p className="text-xs uppercase tracking-widest text-white font-accent mb-1.5">
                      Est. GRIT
                    </p>
                    <div className="flex items-center h-10 rounded border border-accent/30 bg-accent/5 px-3">
                      {priceLoading ? (
                        <div className="flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent shrink-0" />
                          <span className="font-mono text-xs text-muted-foreground">
                            …
                          </span>
                        </div>
                      ) : priceUnavailable || !selectedToken ? (
                        <span className="font-mono text-sm text-muted-foreground/60">
                          —
                        </span>
                      ) : parsedAmount > 0 && priceLoaded ? (
                        <span className="font-mono font-bold text-accent text-sm energy-pulse truncate">
                          {gritEstimate > 0
                            ? `~${formatGrit(BigInt(gritEstimate))}`
                            : "< 1"}
                        </span>
                      ) : (
                        <span className="font-mono text-sm text-muted-foreground/50">
                          —
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee preview — shown before burn when amount + price available */}
              <AnimatePresence>
                {step === "idle" &&
                  selectedToken &&
                  parsedAmount > 0 &&
                  priceLoaded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded border border-border/60 bg-muted/20 px-3 py-2.5 flex items-center justify-between gap-2"
                      data-ocid="burn.fee_preview"
                    >
                      <div className="flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground font-mono">
                          Platform fee (
                          <span style={{ color: "#4ade80" }}>{feeDisplay}</span>
                          ):{" "}
                          <span className="text-foreground font-semibold">
                            {formatUSDValue(
                              parsedAmount * (livePrice ?? 0) * feeRate,
                            )}{" "}
                            USD
                          </span>{" "}
                          + Gas fees in{" "}
                          <span style={{ color: "white" }}>
                            {gasTokenForChain(selectedToken.chain)}
                          </span>{" "}
                          are required to complete the burn.
                        </span>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>

              {/* Primary action */}
              <div className="pt-1">
                {priceUnavailable &&
                  step === "idle" &&
                  !isRunningInBackground && (
                    <p
                      className="text-xs text-red-400 font-mono text-center mb-2 flex items-center justify-center gap-1"
                      data-ocid="burn.price_unavailable_label"
                    >
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      Price unavailable — burn disabled until live price is
                      fetched
                    </p>
                  )}
                <Button
                  onClick={() => {
                    if (isRunningInBackground) {
                      setModalOpen(true);
                    } else {
                      void handleBurn();
                    }
                  }}
                  disabled={!canBurn && !isRunningInBackground}
                  className="w-full h-12 bg-accent text-background hover:bg-accent/90 font-display font-black text-lg uppercase tracking-widest gap-2 transition-smooth disabled:opacity-40"
                  data-ocid="burn.burn_button"
                >
                  {isRunningInBackground ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      View Progress
                    </>
                  ) : step === "idle" ? (
                    <>
                      <Flame className="h-5 w-5" />
                      Burn Tokens
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {STEP_BUTTON_LABELS[step] ?? "Processing…"}
                    </>
                  )}
                </Button>
                {isBurnBlocked && !isLaunchTimeBlocked && (
                  <p
                    className="text-yellow-400 font-mono text-xs text-center mt-2 border border-yellow-500 px-3 py-2"
                    data-ocid="burn.gate_blocked_message"
                  >
                    Launch NFTs not detected. Burn access disabled. Try again
                    after obtaining the NFTs.
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Burn Progress Modal */}
      <BurnProgressModal
        open={modalOpen}
        step={step}
        verifiedGrit={verifiedGrit}
        errorMsg={errorMsg}
        priceNote={priceNote}
        userRejected={userRejected}
        onClose={handleModalClose}
        onContinueInBackground={handleContinueInBackground}
        formatGrit={(v) => formatGrit(v)}
      />

      {/* Claim history */}
      <Card className="bg-card border-border" data-ocid="claim_history.card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-xl sm:text-3xl uppercase tracking-widest text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            RECENT BURNS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(claimHistory ?? []).length === 0 ? (
            <div
              className="py-8 text-center text-muted-foreground text-sm"
              data-ocid="claim_history.empty_state"
            >
              No claims yet. Burn tokens above to get started.
            </div>
          ) : (
            <div className="space-y-0" data-ocid="claim_history.list">
              {(claimHistory ?? []).slice(0, 5).map((record, i) => (
                <div
                  key={record.txHash}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] gap-1.5 sm:gap-3 items-start sm:items-center py-2.5 border-b border-border/50 last:border-0"
                  data-ocid={`claim_history.item.${i + 1}`}
                >
                  {/* Mobile/tablet top row: tx hash + GRIT amount */}
                  <div className="flex items-center justify-between gap-2 w-full sm:contents">
                    <div className="min-w-0 flex-1">
                      <a
                        href={getExplorerUrl(record.txHash, record.chain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent hover:underline flex items-center gap-1 group"
                        data-ocid={`claim_history.tx_link.${i + 1}`}
                      >
                        {truncateAddress(record.txHash, 10)}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-smooth" />
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {CHAIN_LABELS[record.chain] ?? record.chain} ·{" "}
                        {record.tokenSymbol ||
                          truncateAddress(record.tokenAddress)}
                      </p>
                    </div>
                    {/* GRIT: visible inline on mobile/tablet, hidden on desktop (desktop uses grid col) */}
                    <span className="font-mono text-sm text-foreground sm:hidden">
                      {formatGrit(record.gritMinted)} GRIT
                    </span>
                  </div>
                  {/* Desktop-only GRIT cell (grid col 2) */}
                  <span className="hidden sm:block font-mono text-sm text-foreground">
                    {formatGrit(record.gritMinted)} GRIT
                  </span>
                  {/* Status badge: right-aligned under GRIT on mobile/tablet, grid col 3 on desktop */}
                  <div className="sm:hidden w-full flex justify-end">
                    <ClaimStatusBadge status={record.status} />
                  </div>
                  <div className="hidden sm:block">
                    <ClaimStatusBadge status={record.status} />
                  </div>
                </div>
              ))}
              <div className="pt-3 text-center">
                <Link
                  to="/dashboard"
                  className="font-mono text-xs text-gray-400 hover:text-[#00ff41] hover:drop-shadow-[0_0_6px_#00ff41] uppercase tracking-widest transition-colors duration-200"
                  data-ocid="claim_history.view_burn_history_link"
                >
                  FULL BURN HISTORY
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
