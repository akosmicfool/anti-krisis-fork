import { Search, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { http, createPublicClient } from "viem";
import { mainnet } from "viem/chains";
import { useAccount } from "wagmi";
import { fetchDexScreenerPrice } from "../utils/dexscreener";
import { ETH_RPC_ENDPOINTS } from "../utils/evm-rpc";

// ── Static token config ────────────────────────────────────────────
interface AcquireToken {
  ticker: string;
  chainName: string;
  chainId: number;
  contract: string;
  link: string;
  rpcEndpoints: string[];
}

const ACQUIRE_TOKENS: AcquireToken[] = [
  {
    ticker: "axlREGEN",
    chainName: "Base",
    chainId: 8453,
    contract: "0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754",
    link: "https://bridge.eco/?to=0x2E6C05f1f7D1f4Eb9A088bf12257f1647682b754&toChain=8453",
    rpcEndpoints: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://rpc.ankr.com/base",
    ],
  },
  {
    ticker: "kVCM",
    chainName: "Base",
    chainId: 8453,
    contract: "0x00fBAC94Fec8D4089d3fe979F39454F48c71A65d",
    link: "https://bridge.eco/?to=0x00fBAC94Fec8D4089d3fe979F39454F48c71A65d&toChain=8453",
    rpcEndpoints: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://rpc.ankr.com/base",
    ],
  },
  {
    ticker: "GIV",
    chainName: "Optimism",
    chainId: 10,
    contract: "0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98",
    link: "https://bridge.eco/?to=0x528CDc92eAB044E1E39FE43B9514bfdAB4412B98&toChain=10",
    rpcEndpoints: [
      "https://mainnet.optimism.io",
      "https://optimism.publicnode.com",
      "https://rpc.ankr.com/optimism",
    ],
  },
  {
    ticker: "axlREGEN",
    chainName: "Celo",
    chainId: 42220,
    contract: "0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754",
    link: "https://bridge.eco/?to=0x2e6c05f1f7d1f4eb9a088bf12257f1647682b754&toChain=42220",
    rpcEndpoints: [
      "https://forno.celo.org",
      "https://celo.publicnode.com",
      "https://rpc.ankr.com/celo",
    ],
  },
  {
    ticker: "TGN",
    chainName: "Base",
    chainId: 8453,
    contract: "0xd75dfa972c6136f1c594fec1945302f885e1ab29",
    link: "https://www.hydrex.fi/swap?tokenIn=ETH&tokenOut=0xd75dfa972c6136f1c594fec1945302f885e1ab29",
    rpcEndpoints: [
      "https://mainnet.base.org",
      "https://base.publicnode.com",
      "https://rpc.ankr.com/base",
    ],
  },
  {
    ticker: "IMPT",
    chainName: "Ethereum",
    chainId: 1,
    contract: "0x04C17b9D3b29A78F7Bd062a57CF44FC633e71f85",
    link: "https://app.uniswap.org/swap?outputCurrency=0x04C17b9D3b29A78F7Bd062a57CF44FC633e71f85",
    rpcEndpoints: [...ETH_RPC_ENDPOINTS],
  },
];

// ── ABIs ───────────────────────────────────────────────────────────
const BALANCE_OF_ABI = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const DECIMALS_ABI = [
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const;

// ── Helpers ────────────────────────────────────────────────────────
function formatBalance(raw: bigint, decimals: number): string {
  const divisor = 10 ** decimals;
  const value = Number(raw) / divisor;
  if (value === 0) return "0.00";
  if (value < 0.0001) return "<0.01";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatUSD(value: number): string {
  if (!Number.isFinite(value)) return "$--";
  if (value === 0) return "$0.00";
  if (value < 0.01) return "<$0.01";
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function readContractWithFallback(
  rpcEndpoints: string[],
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
  for (const rpcUrl of rpcEndpoints) {
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

// ── Component ──────────────────────────────────────────────────────
export function AcquireSection() {
  const { address } = useAccount();
  const [search, setSearch] = useState("");
  const [balances, setBalances] = useState<Record<string, bigint>>({});
  const [decimals, setDecimals] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(false);

  // Fetch balances + decimals + prices in parallel
  useEffect(() => {
    if (!address) {
      setBalances({});
      setDecimals({});
      setPrices({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    const fetchAll = async () => {
      const balancePromises = ACQUIRE_TOKENS.map(async (token) => {
        const bal = await readContractWithFallback(
          token.rpcEndpoints,
          token.contract,
          BALANCE_OF_ABI,
          "balanceOf",
          [address as `0x${string}`],
        );
        const dec = await readContractWithFallback(
          token.rpcEndpoints,
          token.contract,
          DECIMALS_ABI,
          "decimals",
          [],
        );
        const price = await fetchDexScreenerPrice(token.contract);
        return {
          key: `${token.ticker}-${token.chainName}`,
          bal,
          dec: Number(dec),
          price,
        };
      });

      const results = await Promise.all(balancePromises);
      if (cancelled) return;

      const balMap: Record<string, bigint> = {};
      const decMap: Record<string, number> = {};
      const priceMap: Record<string, number | null> = {};

      for (const r of results) {
        balMap[r.key] = r.bal;
        decMap[r.key] = r.dec;
        priceMap[r.key] = r.price;
      }

      setBalances(balMap);
      setDecimals(decMap);
      setPrices(priceMap);
      setLoading(false);
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [address]);

  const filteredTokens = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ACQUIRE_TOKENS;
    return ACQUIRE_TOKENS.filter(
      (t) =>
        t.ticker.toLowerCase().includes(q) ||
        t.chainName.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="space-y-4" data-ocid="acquire.section">
      {/* Section header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[2.4rem] sm:text-[3rem] font-display font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5">
            <ShoppingCart className="h-[1.53rem] w-[1.53rem] text-accent" />
            ACQUIRE
          </h1>
          <p className="text-white text-sm mt-0.5 break-words">
            Buy allowlisted{" "}
            <span className="text-accent font-mono font-bold">
              RegNet tokens
            </span>{" "}
            via the links provided (or any DEX or CEX of your preference). Skip
            if you already own these tokens.
          </p>
        </div>
      </div>
      {/* Search bar */}
      <div className="relative" data-ocid="acquire.search_container">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH TOKENS..."
          className="w-full pl-9 pr-3 py-2 bg-input border border-border font-display text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none"
          data-ocid="acquire.search_input"
        />
      </div>

      {/* Token list */}
      <div className="space-y-2" data-ocid="acquire.token_list">
        {filteredTokens.map((token, idx) => {
          const key = `${token.ticker}-${token.chainName}`;
          const rawBal = balances[key];
          const dec = decimals[key] ?? 18;
          const price = prices[key];

          const balanceStr =
            !address || loading || rawBal === undefined
              ? "--"
              : formatBalance(rawBal, dec);

          const usdStr =
            !address || loading || rawBal === undefined || price == null
              ? "--"
              : formatUSD((Number(rawBal) / 10 ** dec) * price);

          return (
            <a
              key={key}
              href={token.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border bg-card hover:bg-muted/30 transition-colors px-4 py-3"
              data-ocid={`acquire.token.${idx + 1}`}
            >
              <div className="flex items-center justify-between">
                {/* Left: ticker + chain */}
                <div className="min-w-0">
                  <div className="font-display text-lg uppercase tracking-wider text-foreground">
                    {token.ticker}
                  </div>
                  <div className="font-accent text-sm text-muted-foreground uppercase tracking-wide">
                    {token.chainName}
                  </div>
                </div>

                {/* Right: balance + USD */}
                <div className="text-right shrink-0 ml-4">
                  <div className="font-body text-sm text-white">
                    {balanceStr}
                  </div>
                  <div className="font-body text-xs text-accent">{usdStr}</div>
                </div>
              </div>
            </a>
          );
        })}

        {filteredTokens.length === 0 && (
          <div
            className="text-center py-6 text-muted-foreground font-body text-sm"
            data-ocid="acquire.empty_state"
          >
            No tokens match your search
          </div>
        )}
      </div>
    </div>
  );
}
