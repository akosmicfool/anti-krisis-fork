import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Link2Off, RefreshCw, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { http, createPublicClient } from "viem";
import { mainnet } from "viem/chains";
import { useReadContracts } from "wagmi";
import {
  useAkkBalance,
  useLiveTokenPrice,
  useMyBalance,
} from "../hooks/use-backend";
import { useWallet } from "../hooks/use-wallet";
import {
  CHAIN_IDS,
  CHAIN_LABELS,
  formatGrit,
  formatUSDValue,
  truncateAddress,
} from "../types";
import type { AllowlistedToken } from "../types";
import { ETH_RPC_ENDPOINTS } from "../utils/evm-rpc";

const ERC20_BALANCE_OF_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

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

function formatTokenBalance(raw: bigint, decimals: number): string {
  const divisor = 10 ** decimals;
  const value = Number(raw) / divisor;
  if (value === 0) return "0";
  if (value < 0.0001) return "<0.0001";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(3)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(3)}K`;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
}

interface TokenRowProps {
  token: AllowlistedToken;
  raw: bigint | undefined;
  evmLoading: boolean;
  idx: number;
  chainKey: string;
}

function TokenRow({ token, raw, evmLoading, idx, chainKey }: TokenRowProps) {
  const decimals = Number(token.decimals);
  const { data: price } = useLiveTokenPrice(token.tokenAddress);

  const balanceNum =
    raw !== undefined && raw !== null ? Number(raw) / 10 ** decimals : null;
  const usdValue =
    balanceNum !== null && price != null && price > 0
      ? balanceNum * price
      : null;

  return (
    <div
      key={`${token.tokenAddress}-${token.chain}`}
      className="flex items-center justify-between py-0.5 w-full"
      data-ocid={`wallets.${chainKey}_token.${idx + 1}`}
    >
      {evmLoading ? (
        <Skeleton className="h-3 w-32" />
      ) : (
        <>
          <span className="font-body text-xs text-white">{token.symbol}</span>
          <span className="font-body text-xs text-white text-right">
            {raw !== undefined && raw !== null
              ? formatTokenBalance(raw, decimals)
              : "0.000"}
            {usdValue !== null && <> (~&nbsp;{formatUSDValue(usdValue)})</>}
          </span>
        </>
      )}
    </div>
  );
}

interface WalletsAndBalancesProps {
  tokens: AllowlistedToken[];
  icpPrincipal: string | null;
  onClose: () => void;
  onWithdraw: () => void;
}

// ── Inline Chain Switcher (for the Wallets & Balances modal header) ──────────
const SUPPORTED_CHAINS_MODAL = [
  { chainId: 8453, label: "Base", abbr: "B", color: "#0052FF" },
  { chainId: 42220, label: "Celo", abbr: "C", color: "#FCFF52" },
  { chainId: 10, label: "Optimism", abbr: "OP", color: "#FF0420" },
  { chainId: 1, label: "Ethereum", abbr: "ETH", color: "#627EEA" },
];

function ChainSwitcherInline() {
  const { chainId, isConnected, switchToChain } = useWallet();
  if (!isConnected) return null;
  const active =
    SUPPORTED_CHAINS_MODAL.find((c) => c.chainId === chainId) ??
    SUPPORTED_CHAINS_MODAL[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={active.label}
          aria-label={`Active chain: ${active.label}. Click to switch chain`}
          data-ocid="wallets.chain_switcher"
          className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold uppercase tracking-tight transition-all border border-[#00ff41]/40 hover:border-[#00ff41] hover:shadow-[0_0_6px_rgba(0,255,65,0.4)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff41]"
          style={{ backgroundColor: `${active.color}22`, color: active.color }}
        >
          {active.abbr}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card border-border min-w-[140px] p-1"
        data-ocid="wallets.chain_dropdown"
      >
        {SUPPORTED_CHAINS_MODAL.map((chain) => {
          const isActive = chainId === chain.chainId;
          return (
            <DropdownMenuItem
              key={chain.chainId}
              onClick={() => switchToChain(chain.chainId)}
              data-ocid={`wallets.chain_item.${chain.abbr.toLowerCase()}`}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 focus:bg-muted/40"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[8px] font-bold uppercase flex-shrink-0 border"
                style={{
                  backgroundColor: `${chain.color}22`,
                  color: chain.color,
                  borderColor: `${chain.color}55`,
                }}
              >
                {chain.abbr}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                {chain.label}
              </span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_4px_#00ff41]" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function WalletsAndBalances({
  tokens,
  icpPrincipal,
  onClose,
  onWithdraw,
}: WalletsAndBalancesProps) {
  const { address, isConnected, connectMetaMask, disconnect } = useWallet();
  const [copiedEvm, setCopiedEvm] = useState(false);
  const [copiedIcp, setCopiedIcp] = useState(false);
  const qc = useQueryClient();

  // ICP balances
  const { data: gritBalance, isLoading: gritLoading } = useMyBalance();
  const { data: akkBalance, isLoading: akkLoading } = useAkkBalance();

  // Chain name -> chain ID helper
  function getChainIdFromName(chainName: string): number | undefined {
    const entry = Object.entries(CHAIN_IDS).find(([, v]) => v === chainName);
    return entry ? Number(entry[0]) : undefined;
  }

  // Group tokens by chain
  const CHAIN_ORDER = ["base", "celo", "optimism", "ethereum"] as const;
  type ChainKey = (typeof CHAIN_ORDER)[number];
  const tokensByChain = CHAIN_ORDER.reduce<
    Record<ChainKey, AllowlistedToken[]>
  >(
    (acc, c) => {
      acc[c] = tokens.filter((t) => t.chain === c);
      return acc;
    },
    { base: [], celo: [], optimism: [], ethereum: [] },
  );

  // Build per-chain wagmi contract arrays so a failure on one chain
  // (e.g. Ethereum when wallet is on Base) does not block others.
  function buildContracts(chainKey: ChainKey) {
    const chainId = getChainIdFromName(chainKey);
    return isConnected && address && tokensByChain[chainKey].length > 0
      ? tokensByChain[chainKey].map((t) => ({
          address: t.tokenAddress as `0x${string}`,
          abi: ERC20_BALANCE_OF_ABI,
          functionName: "balanceOf" as const,
          args: [address as `0x${string}`],
          chainId,
          allowFailure: true,
        }))
      : [];
  }

  const baseContracts = buildContracts("base");
  const celoContracts = buildContracts("celo");
  const optimismContracts = buildContracts("optimism");

  const {
    data: baseResults,
    isFetching: baseFetching,
    refetch: refetchBase,
  } = useReadContracts({
    contracts: baseContracts,
    query: { enabled: baseContracts.length > 0 },
  });
  const {
    data: celoResults,
    isFetching: celoFetching,
    refetch: refetchCelo,
  } = useReadContracts({
    contracts: celoContracts,
    query: { enabled: celoContracts.length > 0 },
  });
  const {
    data: optimismResults,
    isFetching: optimismFetching,
    refetch: refetchOptimism,
  } = useReadContracts({
    contracts: optimismContracts,
    query: { enabled: optimismContracts.length > 0 },
  });
  const [ethereumBalances, setEthereumBalances] = useState<
    Record<string, bigint>
  >({});
  const [ethereumLoading, setEthereumLoading] = useState(false);
  const refreshEthTriggerRef = useRef(0);
  const [ethRefreshTick, setEthRefreshTick] = useState(0);

  // "Has loaded once" flags — once data has been fetched (even empty), never
  // show skeletons again on background refetches. Prevents the flash-and-disappear
  // symptom where isFetching=true on a background refetch re-enables skeletons.
  const wagmiHasLoadedRef = useRef(false);
  const ethHasLoadedRef = useRef(false);

  // Mark wagmi chains as loaded once any result set is populated
  if (
    !wagmiHasLoadedRef.current &&
    (baseResults !== undefined ||
      celoResults !== undefined ||
      optimismResults !== undefined)
  ) {
    wagmiHasLoadedRef.current = true;
  }

  // Safety timeout — if wagmi fetches haven't resolved in 8s on FIRST load,
  // stop showing skeletons. On subsequent (background) fetches the hasLoaded
  // flag already prevents skeletons, so the timeout is a no-op.
  const evmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evmTimedOutRef = useRef(false);
  useEffect(() => {
    // Only arm the timeout if we haven't loaded data yet
    if (wagmiHasLoadedRef.current || ethHasLoadedRef.current) return;
    const fetching =
      baseFetching || celoFetching || optimismFetching || ethereumLoading;
    if (fetching && !evmTimedOutRef.current) {
      if (!evmTimeoutRef.current) {
        evmTimeoutRef.current = setTimeout(() => {
          evmTimedOutRef.current = true;
          setEthereumLoading(false);
          // Force a re-render so evmLoading recalculates
          setEthRefreshTick((t) => t); // no-op tick change
        }, 8000);
      }
    } else {
      if (evmTimeoutRef.current) {
        clearTimeout(evmTimeoutRef.current);
        evmTimeoutRef.current = null;
      }
    }
    return () => {
      if (evmTimeoutRef.current) {
        clearTimeout(evmTimeoutRef.current);
        evmTimeoutRef.current = null;
      }
    };
  }, [baseFetching, celoFetching, optimismFetching, ethereumLoading]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ethRefreshTick intentionally triggers manual refetch
  useEffect(() => {
    const ethTokens = tokensByChain.ethereum;
    if (!isConnected || !address || ethTokens.length === 0) {
      setEthereumBalances({});
      ethHasLoadedRef.current = true; // treat "no tokens" as loaded
      return;
    }
    let cancelled = false;
    // Only show loading spinner on the very first fetch, not background refreshes
    if (!ethHasLoadedRef.current) {
      setEthereumLoading(true);
    }
    Promise.all(
      ethTokens.map(async (t) => {
        const bal = await readEthContractWithFallback(
          t.tokenAddress,
          ERC20_BALANCE_OF_ABI,
          "balanceOf",
          [address as `0x${string}`],
        );
        return { addr: t.tokenAddress, bal };
      }),
    )
      .then((results) => {
        if (cancelled) return;
        const map: Record<string, bigint> = {};
        for (const r of results) map[r.addr] = r.bal;
        setEthereumBalances(map);
        ethHasLoadedRef.current = true;
      })
      .catch(() => {
        if (!cancelled) {
          setEthereumBalances({});
          ethHasLoadedRef.current = true;
        }
      })
      .finally(() => {
        if (!cancelled) setEthereumLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, tokensByChain, ethRefreshTick]); // ethRefreshTick intentionally triggers manual refetch

  function refetchEthereum() {
    refreshEthTriggerRef.current += 1;
    setEthRefreshTick(refreshEthTriggerRef.current);
  }

  // Show skeleton ONLY when loading for the first time (hasLoaded flag not yet set).
  // Background refetches (isFetching=true after initial load) must NOT re-show skeletons.
  const wagmiFirstLoad =
    !wagmiHasLoadedRef.current &&
    (baseFetching || celoFetching || optimismFetching);
  const ethFirstLoad = !ethHasLoadedRef.current && ethereumLoading;
  const evmLoading =
    isConnected && !evmTimedOutRef.current && (wagmiFirstLoad || ethFirstLoad);

  const chainResultsMap: Record<string, typeof baseResults> = {
    base: baseResults,
    celo: celoResults,
    optimism: optimismResults,
  };

  function refetchEvm() {
    refetchBase();
    refetchCelo();
    refetchOptimism();
    refetchEthereum();
  }

  // Map per-chain balance results back to each token
  function getBalanceForToken(
    chainKey: ChainKey,
    tokenIdx: number,
  ): bigint | null {
    if (chainKey === "ethereum") {
      const token = tokensByChain.ethereum[tokenIdx];
      return token ? (ethereumBalances[token.tokenAddress] ?? null) : null;
    }
    const results = chainResultsMap[chainKey];
    const result = results?.[tokenIdx];
    return result?.status === "success" ? (result.result as bigint) : null;
  }

  function handleRefresh() {
    refetchEvm();
    qc.invalidateQueries({ queryKey: ["myBalance"] });
    qc.invalidateQueries({ queryKey: ["akkBalance"] });
  }

  function copyAddress(text: string, which: "evm" | "icp") {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    if (which === "evm") {
      setCopiedEvm(true);
      setTimeout(() => setCopiedEvm(false), 2000);
    } else {
      setCopiedIcp(true);
      setTimeout(() => setCopiedIcp(false), 2000);
    }
  }

  return (
    <div
      className="w-80 bg-[#0a0a0a] border border-[#00ff41]/30 shadow-[0_0_20px_rgba(0,255,65,0.08)]"
      data-ocid="wallets.panel"
    >
      {/* Panel title */}
      <div className="px-3 py-2.5 border-b border-[#00ff41]/20 flex items-center justify-between">
        <span className="font-display text-lg tracking-widest text-[#00ff41] uppercase">
          Wallets &amp; Balances
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh balances"
            className="p-1 text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
            data-ocid="wallets.refresh_button"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
          <ChainSwitcherInline />
          <Wallet className="h-3.5 w-3.5 text-[#00ff41]/60" />
        </div>
      </div>

      {/* EVM connect */}
      {!isConnected && (
        <div className="px-3 pt-2.5 pb-1">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onClose();
              setTimeout(connectMetaMask, 50);
            }}
            className="w-full font-accent text-xs uppercase tracking-widest bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/20 hover:border-[#00ff41] transition-smooth"
            data-ocid="wallets.connect_evm_button"
          >
            Connect EVM Wallet
          </Button>
        </div>
      )}

      <div className="max-h-[380px] overflow-y-auto">
        {/* ── EVM TOKENS — one section per chain ─────────────────── */}
        {!isConnected ? (
          <div className="px-3 pt-2 pb-1">
            <p className="font-accent text-base tracking-widest text-[#00ff41] uppercase mb-1">
              EVM Tokens
            </p>
            <p className="text-xs font-body text-muted-foreground py-0.5">
              Connect wallet to see balances
            </p>
          </div>
        ) : (
          CHAIN_ORDER.filter((c) => tokensByChain[c].length > 0).map(
            (chainKey) => (
              <div key={chainKey} className="px-3 pt-2 pb-0.5">
                <p className="font-accent text-base tracking-widest text-[#00ff41] uppercase mb-1">
                  {CHAIN_LABELS[chainKey] ?? chainKey}
                </p>
                <div
                  className="space-y-0.5"
                  data-ocid={`wallets.${chainKey}_token_list`}
                >
                  {tokensByChain[chainKey].map((token, idx) => {
                    const rawResult = getBalanceForToken(chainKey, idx);
                    return (
                      <TokenRow
                        key={`${token.tokenAddress}-${token.chain}`}
                        token={token}
                        raw={rawResult ?? undefined}
                        evmLoading={evmLoading}
                        idx={idx}
                        chainKey={chainKey}
                      />
                    );
                  })}
                </div>
                <Separator className="bg-[#00ff41]/10 mt-1" />
              </div>
            ),
          )
        )}

        {/* ── INTERNET COMPUTER ──────────────────────────────────────────── */}
        <div className="px-3 pt-2 pb-1">
          <p className="font-accent text-base tracking-widest text-[#00ff41] uppercase mb-2">
            Internet Computer
          </p>

          {/* AKK row */}
          <div
            className="flex items-center justify-between py-0.5 w-full"
            data-ocid="wallets.akk_balance_row"
          >
            {akkLoading ? (
              <Skeleton className="h-3 w-32" />
            ) : (
              <>
                <span className="font-body text-xs text-white">AKK</span>
                <span className="font-body text-xs text-white text-right">
                  {akkBalance !== undefined
                    ? (Number(akkBalance) / 100_000_000).toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 3,
                        },
                      )
                    : "—"}
                </span>
              </>
            )}
          </div>

          {/* GRIT row */}
          <div
            className="flex items-center justify-between py-0.5 w-full"
            data-ocid="wallets.grit_balance_row"
          >
            {gritLoading ? (
              <Skeleton className="h-3 w-32" />
            ) : (
              <>
                <span className="font-body text-xs text-white">GRIT</span>
                <span className="font-body text-xs text-white text-right">
                  {gritBalance !== undefined ? formatGrit(gritBalance) : "—"}
                </span>
              </>
            )}
          </div>
        </div>

        <Separator className="bg-[#00ff41]/10 mx-3" />

        {/* ── FOOTER ADDRESSES ─────────────────────────────────────── */}
        <div className="px-3 pt-1.5 pb-1.5 space-y-0.5">
          {isConnected && address && (
            <button
              type="button"
              onClick={() => copyAddress(address, "evm")}
              title="Click to copy EVM address"
              className="w-full flex items-center justify-between group cursor-pointer hover:bg-[#00ff41]/5 px-1 py-0.5 rounded transition-colors"
              data-ocid="wallets.evm_address_copy"
            >
              <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider group-hover:text-[#00ff41] transition-colors">
                EVM
              </span>
              <div className="flex items-center gap-1">
                <span className="font-body text-[10px] text-muted-foreground font-mono group-hover:text-[#00ff41] transition-colors">
                  {truncateAddress(address, 6)}
                </span>
                {copiedEvm ? (
                  <Check className="h-2.5 w-2.5 text-[#00ff41]" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-muted-foreground group-hover:text-[#00ff41] transition-colors" />
                )}
              </div>
            </button>
          )}
          {icpPrincipal && (
            <button
              type="button"
              onClick={() => copyAddress(icpPrincipal, "icp")}
              title="Click to copy ICP principal"
              className="w-full flex items-center justify-between group cursor-pointer hover:bg-[#00ff41]/5 px-1 py-0.5 rounded transition-colors"
              data-ocid="wallets.icp_address_copy"
            >
              <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider group-hover:text-[#00ff41] transition-colors">
                ICP
              </span>
              <div className="flex items-center gap-1">
                <span className="font-body text-[10px] text-muted-foreground font-mono group-hover:text-[#00ff41] transition-colors">
                  {truncateAddress(icpPrincipal, 8)}
                </span>
                {copiedIcp ? (
                  <Check className="h-2.5 w-2.5 text-[#00ff41]" />
                ) : (
                  <Copy className="h-2.5 w-2.5 text-muted-foreground group-hover:text-[#00ff41] transition-colors" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ── ACTION BUTTONS ───────────────────────────────────────────── */}
      <div className="px-3 pb-3 pt-1 border-t border-[#00ff41]/20 flex items-center gap-2">
        {isConnected && (
          <button
            type="button"
            onClick={() => {
              disconnect();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1 font-accent text-xs uppercase tracking-widest border border-[#00ff41]/30 hover:border-red-500/70 hover:bg-red-500/5 text-[#00ff41]/70 hover:text-red-400 transition-colors py-1.5 px-2"
            data-ocid="wallets.disconnect_evm_button"
          >
            <Link2Off className="h-3 w-3" />
            Disconnect EVM
          </button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={() => {
            onClose();
            onWithdraw();
          }}
          className="flex-1 font-accent text-xs uppercase tracking-widest bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/20 hover:border-[#00ff41] transition-smooth"
          data-ocid="wallets.withdraw_button"
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}
