/**
 * kVCM carbon-retirement burn flow — KlimaDAO Retirement Aggregator on Base.
 *
 * Burning kVCM retires real carbon credits instead of a plain transfer-to-dead.
 * The user only picks kVCM and an amount; everything else is auto-filled here:
 *
 *   1. Credit discovery  — PROTOCOL subgraph lists every carbon class and its
 *      registered credits; CARBON subgraph classifies them. Eligible set:
 *      rawRegistryId VCS→CMARK or UCR · batchId "0" (excludes Toucan Puro,
 *      which needs real batchIds) · ERC-20 standard (excludes ECO ERC-1155).
 *      Newly registered qualifying credits are picked up automatically.
 *   2. Random pick       — crypto.getRandomValues over the eligible list.
 *   3. Reverse quote     — quoteRetireCreditForInputTokenInViaKlima turns the
 *      kVCM budget into tonnes directly; falls back to a ≤10-step binary
 *      search over the forward quote when the inverse entry point is absent.
 *   4. Slippage          — maxInputTokenIn = quoted cost + 2%.
 *   5. TX A              — kVCM.approve(AAM, maxKvcmIn); waits for receipt.
 *   6. TX B              — aggregator.retireCreditViaKlima(credit, …, kVCM…).
 *
 * Klima Path-2 semantics (USAGE.md): creditToken = a REGISTERED CREDIT
 * (never kVCM itself — that reverts with CarbonCreditNotRegisteredForClass),
 * inputToken = kVCM, carbonClass = the class vault owning that credit.
 *
 * Addresses (Base mainnet, chain 8453) per KlimaDAO USAGE.md.
 */
import {
  http,
  createPublicClient,
  encodeFunctionData,
  fallback,
  formatUnits,
  parseUnits,
} from "viem";
import { base } from "viem/chains";

// ─── Contract addresses ─────────────────────────────────────────────────────

export const KVCM_RETIREMENT = {
  /** Retirement Aggregator diamond contract. */
  aggregator: "0xda0a793d7c32ab80bcdab7f8c725c96db22464f4",
  /** Klima Protocol Aggregation Approval Manager — the kVCM approval target. */
  aam: "0x1C24239309398220883207681602BfF4D10fbde1",
  /** kVCM ERC-20 token contract (the PAYMENT token, not a credit). */
  kvcm: "0x00fbac94fec8d4089d3fe979f39454f48c71a65d",
  chainId: 8453,
  decimals: 18,
} as const;

/** Slippage buffer on the quoted kVCM cost, in basis points (200 = 2%). */
const SLIPPAGE_BPS = 200n;

// ─── Klima credit whitelist (measured 2026-08-28, rescan when inventory shifts) ──
//
// Ranked by live simulation + inventory ceiling. Klima UCR credits sell at a
// FIXED price (1.8158 kVCM/t, zero slippage) until inventory runs out — so a
// credit's "liquidity" is its remaining inventory. Ceilings probed by
// laddering forward quotes until revert:
//   T1 (12k–20k t): c532b6f3, 9623e6c9, 49655fbc (prod-proven), 2037eca7
//   T2 (4k–8k t):   cb4d420f, 10772cdf
//   T3 (1k–2k t):   f218acd8, fc978c0a, f1965ac1
// Excluded: 6 credits that revert at execution at ANY size, 3 dust credits.
// Selection: burn USD ≤ $6.9 → all 9 · ≤ $69 → T1+T2 · above → T1 only.
// The whitelist is an ORDER preference, not a guarantee — the simulation
// gate remains the final arbiter, and full discovery is the fallback.
const KLIMA_CREDIT_WHITELIST: Array<{
  credit: `0x${string}`;
  class: `0x${string}`;
  tier: 1 | 2 | 3;
}> = [
  {
    credit: "0xc532b6f31e4b75557badd24b189fc43663f1bcf4",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 1,
  },
  {
    credit: "0x9623e6c969dc54f1972eb8b311eb9ed4cebc5e3e",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 1,
  },
  {
    credit: "0x49655fbcc66d0ea6c3d0029d60e6762563ae4b82",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 1,
  },
  {
    credit: "0x2037eca75ad1f6f7b28d8ed745c0e0954e383758",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 1,
  },
  {
    credit: "0xcb4d420fbcc9f4319495e4139af37d47becbd031",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 2,
  },
  {
    credit: "0x10772cdf6105d09fd8ab20996e5a4b9b59ba3907",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 2,
  },
  {
    credit: "0xf218acd83d1593e985e3ec7ed95306a04998dc18",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 3,
  },
  {
    credit: "0xfc978c0ae3e7ad8edc6655d9c38bd61f210cd8bf",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 3,
  },
  {
    credit: "0xf1965ac1c0c5bdfdbcb4f3942b2e96040c6f9be7",
    class: "0x1ff9bd464155d32fd2f9d302008d38544c0ae371",
    tier: 3,
  },
];
const SMALL_BURN_USD = 6.9;
const MEDIUM_BURN_USD = 69;

// ─── Subgraph endpoints (public Goldsky endpoints, rate limited) ────────────

const PROTOCOL_SUBGRAPH =
  "https://api.goldsky.com/api/public/project_cmgzise2h00195np2gbp35g3d/subgraphs/cm-base-protocol-production/latest/gn";
const CARBON_SUBGRAPH =
  "https://api.goldsky.com/api/public/project_cmgzise2h00195np2gbp35g3d/subgraphs/cm-base-carbon-production/latest/gn";

// ─── Credit eligibility ─────────────────────────────────────────────────────

interface EligibleCredit {
  creditToken: `0x${string}`;
  carbonClass: `0x${string}`;
  bridge: "CMARK" | "UCR";
}

interface SubgraphCreditsResponse {
  data?: {
    carbonClasses?: Array<{
      carbonClassId: string;
      registeredCredits?: Array<{ creditAddress: string }>;
    }>;
  };
  errors?: Array<{ message?: string }>;
}

async function fetchEligibleCredits(): Promise<EligibleCredit[]> {
  const res = await fetch(PROTOCOL_SUBGRAPH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query:
        "{ carbonClasses { carbonClassId registeredCredits { creditAddress } } }",
    }),
  });
  if (!res.ok) throw new Error(`Subgraph unavailable (${res.status})`);
  const json = (await res.json()) as SubgraphCreditsResponse;

  // Malformed/failed queries return HTTP 200 with errors + empty data.
  // Fail loudly (mirroring the carbon-subgraph check below) instead of
  // silently treating that as an empty eligible set.
  if (json.errors && json.errors.length > 0) {
    throw new Error(
      `Protocol subgraph query failed: ${json.errors[0]?.message ?? "unknown error"}`,
    );
  }

  // Flatten class → credit pairs
  const pairs: Array<{
    creditToken: `0x${string}`;
    carbonClass: `0x${string}`;
  }> = [];
  for (const cls of json.data?.carbonClasses ?? []) {
    for (const credit of cls.registeredCredits ?? []) {
      pairs.push({
        creditToken: credit.creditAddress.toLowerCase() as `0x${string}`,
        carbonClass: cls.carbonClassId.toLowerCase() as `0x${string}`,
      });
    }
  }
  if (pairs.length === 0) return [];

  // Classify via the CARBON subgraph with a parameterized query: the address
  // list travels as GraphQL *variables* (JSON), never interpolated into query
  // text — an earlier string-built where-in clause produced malformed GraphQL,
  // and the endpoint's HTTP-200+errors reply read as "no eligible credits".
  // Pages are looped so newly registered credits are always included no matter
  // how large the registry grows.
  const addresses = [...new Set(pairs.map((p) => p.creditToken))];
  const CARBON_PAGE_SIZE = 500;
  const CARBON_QUERY = `query Credits($addrs: [Bytes!]!, $skip: Int!) { creditTokens(first: ${CARBON_PAGE_SIZE}, skip: $skip, where: { tokenAddress_in: $addrs }) { tokenAddress rawRegistryId batchId tokenStandard } }`;
  const classified: Array<{
    tokenAddress: string;
    rawRegistryId?: string | null;
    batchId?: string | null;
    tokenStandard?: string | null;
  }> = [];
  for (let skip = 0; ; skip += CARBON_PAGE_SIZE) {
    const pageRes = await fetch(CARBON_SUBGRAPH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CARBON_QUERY,
        variables: { addrs: addresses, skip },
      }),
    });
    if (!pageRes.ok)
      throw new Error(`Carbon subgraph unavailable (${pageRes.status})`);
    const pageJson = (await pageRes.json()) as {
      errors?: Array<{ message?: string }>;
      data?: {
        creditTokens?: Array<{
          tokenAddress: string;
          rawRegistryId?: string | null;
          batchId?: string | null;
          tokenStandard?: string | null;
        }>;
      };
    };
    // Malformed/failed queries return HTTP 200 with errors + empty data.
    // Fail loudly instead of silently treating that as an empty eligible set.
    if (pageJson.errors && pageJson.errors.length > 0) {
      throw new Error(
        `Carbon subgraph query failed: ${pageJson.errors[0]?.message ?? "unknown error"}`,
      );
    }
    const page = pageJson.data?.creditTokens ?? [];
    classified.push(...page);
    if (page.length < CARBON_PAGE_SIZE) break;
    if (skip > 10_000)
      throw new Error("Carbon subgraph pagination did not terminate");
  }

  const eligible = new Map<string, EligibleCredit>();
  for (const ct of classified) {
    const addr = (ct.tokenAddress?.toLowerCase() ?? "") as `0x${string}` | "";
    if (!addr) continue;
    if ((ct.tokenStandard ?? "ERC20") !== "ERC20") continue; // ECO (1155) excluded
    if (ct.batchId !== undefined && ct.batchId !== null && ct.batchId !== "0")
      continue; // Puro excluded
    let bridge: EligibleCredit["bridge"] | null = null;
    if (ct.rawRegistryId === "VCS") bridge = "CMARK";
    else if (ct.rawRegistryId === "UCR") bridge = "UCR";
    if (!bridge) continue;

    const pair = pairs.find((p) => p.creditToken === addr);
    if (pair) {
      eligible.set(addr, {
        creditToken: addr,
        carbonClass: pair.carbonClass,
        bridge,
      });
    }
  }
  return [...eligible.values()];
}

/** Module-level cache so retries don't re-hit the rate-limited subgraphs. */
let creditsCache: { credits: EligibleCredit[]; fetchedAt: number } | null =
  null;
const CREDITS_CACHE_TTL_MS = 5 * 60 * 1000;

async function getEligibleCredits(): Promise<EligibleCredit[]> {
  if (
    creditsCache &&
    Date.now() - creditsCache.fetchedAt < CREDITS_CACHE_TTL_MS
  ) {
    return creditsCache.credits;
  }
  const credits = await fetchEligibleCredits();
  if (credits.length > 0) {
    creditsCache = { credits, fetchedAt: Date.now() };
  }
  return credits;
}

/** Cryptographically-seeded random index in [0, n). */
function randomIndex(n: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % n;
}

// ─── Quoting ────────────────────────────────────────────────────────────────

const QUOTE_INVERSE_ABI = [
  {
    name: "quoteRetireCreditForInputTokenInViaKlima",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "creditToken", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "inputTokenAmount", type: "uint256" },
      { name: "inputTokenAddress", type: "address" },
      { name: "carbonClass", type: "address" },
      { name: "couponTonnes", type: "uint256" },
    ],
    outputs: [
      { name: "tonnes", type: "uint256" },
      { name: "tokenAmount", type: "uint256" },
      { name: "retirementPrice", type: "uint256" },
    ],
  },
] as const;

const QUOTE_FORWARD_ABI = [
  {
    name: "quoteRetireCreditViaKlima",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "creditToken", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "inputToken", type: "address" },
      { name: "carbonClass", type: "address" },
      { name: "couponTonnes", type: "uint256" },
    ],
    outputs: [
      { name: "tonnes", type: "uint256" },
      { name: "tokenAmount", type: "uint256" },
    ],
  },
] as const;

function publicClient() {
  // Same fallback set as the backend's fee verifier (llamarpc removed —
  // it 521s dead and stalls viem's fallback transport). A single Base RPC
  // (mainnet.base.org) rate-limits and stalls the quote step; viem's
  // fallback() tries transports in order and skips failed ones.
  return createPublicClient({
    chain: base,
    transport: fallback([
      http("https://mainnet.base.org"),
      http("https://1rpc.io/base"),
      http("https://base.publicnode.com"),
    ]),
  });
}

async function inverseQuote(
  client: ReturnType<typeof publicClient>,
  credit: EligibleCredit,
  kvcmWei: bigint,
): Promise<{ tonnes: bigint; kvcmCost: bigint }> {
  const result = await client.readContract({
    address: KVCM_RETIREMENT.aggregator as `0x${string}`,
    abi: QUOTE_INVERSE_ABI,
    functionName: "quoteRetireCreditForInputTokenInViaKlima",
    args: [
      credit.creditToken,
      0n,
      kvcmWei,
      KVCM_RETIREMENT.kvcm as `0x${string}`,
      credit.carbonClass,
      0n,
    ],
  });
  return { tonnes: result[0], kvcmCost: result[1] };
}

async function forwardSearchQuote(
  client: ReturnType<typeof publicClient>,
  credit: EligibleCredit,
  kvcmWei: bigint,
): Promise<{ tonnes: bigint; kvcmCost: bigint }> {
  // Baseline: cost of 1 tonne → generous upper bound for the search
  const baseline = await client.readContract({
    address: KVCM_RETIREMENT.aggregator as `0x${string}`,
    abi: QUOTE_FORWARD_ABI,
    functionName: "quoteRetireCreditViaKlima",
    args: [
      credit.creditToken,
      0n,
      parseUnits("1", 18),
      KVCM_RETIREMENT.kvcm as `0x${string}`,
      credit.carbonClass,
      0n,
    ],
  });
  const oneTonneCost = baseline[1];
  if (oneTonneCost <= 0n) throw new Error("Retirement quote unavailable");
  let low = 0n;
  let high = (kvcmWei / oneTonneCost) * 2n + 1n;
  let bestTonnes = 0n;
  let bestCost = 0n;
  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2n;
    if (mid === 0n) break;
    const q = await client.readContract({
      address: KVCM_RETIREMENT.aggregator as `0x${string}`,
      abi: QUOTE_FORWARD_ABI,
      functionName: "quoteRetireCreditViaKlima",
      args: [
        credit.creditToken,
        0n,
        mid,
        KVCM_RETIREMENT.kvcm as `0x${string}`,
        credit.carbonClass,
        0n,
      ],
    });
    const cost = q[1];
    if (cost > 0n && cost <= kvcmWei) {
      bestTonnes = mid;
      bestCost = cost;
      low = mid + 1n;
    } else {
      high = mid;
    }
  }
  return { tonnes: bestTonnes, kvcmCost: bestCost };
}

// ─── Retirement execution ───────────────────────────────────────────────────

/** Shape of the generic contract-call helper provided by useWallet. */
export interface SendContractTransactionParams {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint;
  chainId?: number;
  /**
   * Explicit gas cap. The kVCM retirement route walks multiple internal
   * swaps inside the KlimaDAO diamond and can consume far more than the
   * wallet's default estimate; some RPCs then reject the raw tx with
   * "exceeds maximum per-tx gas limit: 140000000 > 25000000" (Base).
   * Passing an explicit cap stops wallets/RPCs from inflating the estimate.
   */
  gas?: bigint;
}

export type SendContractTransaction = (
  params: SendContractTransactionParams,
) => Promise<string>;

export interface RetireKvcmParams {
  /** kVCM amount to spend, as a decimal string (e.g. "1.5"). */
  amount: string;
  /** User's EVM address — becomes the retirement beneficiary. */
  beneficiaryAddress: `0x${string}`;
  /** Generic contract-call helper from useWallet. */
  sendContractTransaction: SendContractTransaction;
  /**
   * USD value of the burn (amount × live kVCM price), used ONLY to pick the
   * whitelist tier: ≤ $6.9 → all 9 credits · ≤ $69 → T1+T2 · above → T1.
   * Unknown price ⇒ all tiers eligible (the dice widen, never block).
   */
  burnValueUsd?: number;
}

export interface RetireKvcmResult {
  /** Hash of the kVCM.approve(AAM, maxKvcmIn) transaction. */
  approveHash: string;
  /** Hash of the retireCreditViaKlima transaction (the actual burn). */
  retireHash: string;
  /** Tonnes (18-decimal) funded by this retirement. */
  tonnes: bigint;
  /** Max kVCM (18-decimal) the transaction may pull. */
  maxKvcmIn: bigint;
  /** Which registry family was retired ("CMARK" | "UCR"). */
  bridge: string;
}

/**
 * Gas cap for the retire tx. The KlimaDAO route executes several internal
 * Uniswap-style swaps in one call — gas estimates from some nodes balloon
 * past the chain's 25M per-tx ceiling ("exceeds maximum per-tx gas limit:
 * 140000000 > 25000000", observed live on Base 2026-08-28). 20M leaves
 * headroom above the real consumption while staying under every RPC cap.
 */
const RETIRE_GAS_CAP = 20_000_000n;

/** Auto-filled retirement metadata — permanent on-chain, never user-edited. */
const RETIRE_DETAILS = {
  retiringAddress: "0x0000000000000000000000000000000000000000" as const, // msg.sender
  retiringEntityString: "",
  beneficiaryAddress: "0x0000000000000000000000000000000000000000" as const, // retiringAddress
  beneficiaryString: "Anti Krisis Protocol",
  retirementMessage: "Mine $AKK",
  beneficiaryLocation: "",
  consumptionCountryCode: "",
  consumptionPeriodStart: 0n,
  consumptionPeriodEnd: 0n,
};

const ERC20_APPROVE_ABI = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

const ERC20_ALLOWANCE_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const RETIRE_CREDIT_VIA_KLIMA_ABI = [
  {
    name: "retireCreditViaKlima",
    type: "function",
    inputs: [
      { name: "creditToken", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "batchId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "inputToken", type: "address" },
      { name: "carbonClass", type: "address" },
      { name: "maxInputTokenIn", type: "uint256" },
      { name: "couponTonnes", type: "uint256" },
      {
        name: "details",
        type: "tuple",
        components: [
          { name: "retiringAddress", type: "address" },
          { name: "retiringEntityString", type: "string" },
          { name: "beneficiaryAddress", type: "address" },
          { name: "beneficiaryString", type: "string" },
          { name: "retirementMessage", type: "string" },
          { name: "beneficiaryLocation", type: "string" },
          { name: "consumptionCountryCode", type: "string" },
          { name: "consumptionPeriodStart", type: "uint256" },
          { name: "consumptionPeriodEnd", type: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/**
 * Retires real carbon credits by spending kVCM through the KlimaDAO Retirement
 * Aggregator on Base. Returns both transaction hashes plus the quote summary.
 */
export async function retireKvcm(
  params: RetireKvcmParams,
): Promise<RetireKvcmResult> {
  const trimmed = params.amount.trim();
  if (!trimmed || Number.parseFloat(trimmed) <= 0) {
    throw new Error("Retirement amount must be greater than zero");
  }
  const kvcmWei = parseUnits(trimmed, KVCM_RETIREMENT.decimals);

  // 1-2. Candidate selection — WHITELIST FIRST. The public Goldsky subgraphs
  // are rate-limited and must not be called per-burn: the happy path uses
  // only the constant whitelist (zero subgraph calls). Full discovery runs
  // ONCE, as a fallback, only if every whitelisted route fails.
  const client = publicClient();
  // Tier policy: ≤ $6.9 → all 9 · ≤ $69 → T1+T2 · above → T1 only.
  // Unknown price ⇒ all tiers eligible (the dice widen, never block).
  const maxTier =
    params.burnValueUsd === undefined
      ? 3
      : params.burnValueUsd <= SMALL_BURN_USD
        ? 3
        : params.burnValueUsd <= MEDIUM_BURN_USD
          ? 2
          : 1;
  const tierPicks = KLIMA_CREDIT_WHITELIST.filter((w) => w.tier <= maxTier);
  let candidates: EligibleCredit[] = tierPicks.map(
    (w): EligibleCredit => ({
      creditToken: w.credit,
      carbonClass: w.class,
      bridge: "UCR",
    }),
  );
  // Shuffle within the tier so every qualifying credit stays in the random mix.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Spend cap up front — the simulation calldata needs it. The retire route
  // is EXACT-IN: it consumes the FULL entered kVCM amount, so the cap must
  // cover the entire budget plus a small buffer. Capping it at the quoted
  // tokenAmount under-funds the pull and the tx reverts (observed as
  // ERC20InsufficientAllowance 0xfb8f41b2).
  const maxKvcmIn = kvcmWei + (kvcmWei * SLIPPAGE_BPS) / 10000n;

  // Allowance awareness: the Klima aggregator swallows the token's allowance
  // revert and re-emits its own, so with a stale/insufficient allowance the
  // simulation CANNOT distinguish "dead route" from "allowance missing" —
  // every healthy route reads as dead (observed live 2026-08-28 → the
  // "(19 routes simulated)" failure on a fully healthy fleet). Read the
  // real allowance once: if it can't cover maxKvcmIn, skip pre-approve
  // simulations entirely (quotes still filter obviously-dead routes) and
  // let the approve fix the world first; phase B re-sims with the
  // allowance live, where DEAD verdicts are trustworthy again.
  let hasAllowance = false;
  try {
    const live = await client.readContract({
      address: KVCM_RETIREMENT.kvcm as `0x${string}`,
      abi: ERC20_ALLOWANCE_ABI,
      functionName: "allowance",
      args: [params.beneficiaryAddress, KVCM_RETIREMENT.aam as `0x${string}`],
    });
    hasAllowance = live >= maxKvcmIn;
  } catch {
    hasAllowance = false;
  }

  // ── Simulation gate, phase A (pre-approve) ──────────────────────────────
  // Runs ONLY when the allowance already covers the burn. For each shuffled
  // candidate: build the EXACT retire calldata and eth_estimateGas it.
  //   • simulates clean → viable, shortlisted
  //   • reverts ONLY on the kVCM allowance (0xfb8f41b2 / *Allowance*) →
  //     route fine, allowance changed concurrently — shortlisted
  //   • any other revert → dead route, skipped BEFORE any wallet popup
  //   • no live allowance → skip sims (allowance-poisoned), trust quotes;
  //     phase B (post-approve) does the real gating
  interface Simulated {
    candidate: EligibleCredit;
    q: { tonnes: bigint; kvcmCost: bigint };
    data: `0x${string}`;
  }
  const shortlist: Simulated[] = [];
  let tried = 0;
  const SIM_LIMIT = 6;

  const buildRetireData = (candidate: EligibleCredit, tonnes: bigint) =>
    encodeFunctionData({
      abi: RETIRE_CREDIT_VIA_KLIMA_ABI,
      functionName: "retireCreditViaKlima",
      args: [
        candidate.creditToken,
        0n,
        0n,
        tonnes,
        KVCM_RETIREMENT.kvcm as `0x${string}`,
        candidate.carbonClass,
        maxKvcmIn,
        0n,
        {
          ...RETIRE_DETAILS,
          beneficiaryAddress: params.beneficiaryAddress,
        },
      ],
    });

  for (const candidate of candidates) {
    if (shortlist.length >= SIM_LIMIT) break;
    let q: { tonnes: bigint; kvcmCost: bigint };
    try {
      q = await inverseQuote(client, candidate, kvcmWei);
    } catch {
      try {
        q = await forwardSearchQuote(client, candidate, kvcmWei);
      } catch {
        continue; // no usable quote entry point for this credit
      }
    }
    if (q.tonnes <= 0n || q.kvcmCost <= 0n) continue;
    tried += 1;
    const data = buildRetireData(candidate, q.tonnes);
    if (!hasAllowance) {
      shortlist.push({ candidate, q, data });
      continue;
    }
    try {
      const est = await client.estimateGas({
        to: KVCM_RETIREMENT.aggregator as `0x${string}`,
        data,
        account: params.beneficiaryAddress,
        gas: RETIRE_GAS_CAP,
      });
      if (est > RETIRE_GAS_CAP) continue; // too heavy for Base RPCs — skip
      shortlist.push({ candidate, q, data });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Allowance") || msg.includes("0xfb8f41b2")) {
        shortlist.push({ candidate, q, data }); // route fine, allowance moved
      }
      // anything else: genuinely dead route — skip
    }
  }

  if (shortlist.length === 0) {
    // Whitelist routes all failed — fall back to FULL subgraph discovery
    // (the only per-burn subgraph call, and only on this path).
    try {
      const discovered = await getEligibleCredits();
      const seen = new Set(candidates.map((c) => c.creditToken));
      const extra = discovered.filter((c) => !seen.has(c.creditToken));
      for (const candidate of extra) {
        if (shortlist.length >= SIM_LIMIT) break;
        let q: { tonnes: bigint; kvcmCost: bigint };
        try {
          q = await inverseQuote(client, candidate, kvcmWei);
        } catch {
          try {
            q = await forwardSearchQuote(client, candidate, kvcmWei);
          } catch {
            continue;
          }
        }
        if (q.tonnes <= 0n || q.kvcmCost <= 0n) continue;
        tried += 1;
        const data = buildRetireData(candidate, q.tonnes);
        shortlist.push({ candidate, q, data });
      }
    } catch {
      // discovery unavailable — fall through to the error below
    }
  }

  if (shortlist.length === 0) {
    throw new Error(
      `No eligible carbon credit can currently fund a burn of this size (${tried} routes simulated). Try a smaller amount or try again later.`,
    );
  }

  // 5. TX A — approve the AAM to pull up to maxKvcmIn, ONLY when the live
  // allowance is insufficient (ONE approve covers every candidate: the
  // allowance is on kVCM to the AAM, not per-credit). A sufficient leftover
  // allowance from a previous burn skips the popup entirely.
  let approveHash: string | null = null;
  if (!hasAllowance) {
    const approveData = encodeFunctionData({
      abi: ERC20_APPROVE_ABI,
      functionName: "approve",
      args: [KVCM_RETIREMENT.aam as `0x${string}`, maxKvcmIn],
    });
    approveHash = await params.sendContractTransaction({
      to: KVCM_RETIREMENT.kvcm as `0x${string}`,
      data: approveData,
      chainId: KVCM_RETIREMENT.chainId,
    });

    // The AAM pulls kVCM during the retire call — the allowance must be live first.
    const receipt = await client.waitForTransactionReceipt({
      hash: approveHash as `0x${string}`,
      timeout: 120_000,
    });
    if (receipt.status !== "success") {
      throw new Error(
        "Approval transaction failed on-chain. Please try again.",
      );
    }
  }

  // ── Simulation gate, phase B (post-approve) ─────────────────────────────
  // The allowance is now live: re-simulate the shortlist and take the first
  // route that executes clean, with real measured gas (1.3x headroom,
  // clamped to the cap). A route that simulated pre-approve but reverts now
  // had its pool move — the next shortlisted candidate takes over, and the
  // only cost so far is the approve's gas (kVCM untouched).
  let credit: EligibleCredit | null = null;
  let quoted: { tonnes: bigint; kvcmCost: bigint } | null = null;
  let retireData: `0x${string}` | null = null;
  let retireGas: bigint = RETIRE_GAS_CAP;
  for (const sim of shortlist) {
    try {
      const est = await client.estimateGas({
        to: KVCM_RETIREMENT.aggregator as `0x${string}`,
        data: sim.data,
        account: params.beneficiaryAddress,
        gas: RETIRE_GAS_CAP,
      });
      if (est > RETIRE_GAS_CAP) continue;
      credit = sim.candidate;
      quoted = sim.q;
      retireData = sim.data;
      retireGas =
        (est * 13n) / 10n > RETIRE_GAS_CAP ? RETIRE_GAS_CAP : (est * 13n) / 10n;
      break;
    } catch {
      // route moved since phase A — fall through to the next shortlisted one
    }
  }
  if (!credit || !quoted || !retireData) {
    throw new Error(
      "The simulated retirement routes moved before execution. No kVCM was spent (only the approve gas). Please try again.",
    );
  }

  // 6. TX B — retire the simulated route, paying with kVCM
  const retireHash = await params.sendContractTransaction({
    to: KVCM_RETIREMENT.aggregator as `0x${string}`,
    data: retireData,
    chainId: KVCM_RETIREMENT.chainId,
    gas: retireGas,
  });

  return {
    approveHash: approveHash ?? "",
    retireHash,
    tonnes: quoted.tonnes,
    maxKvcmIn,
    bridge: credit.bridge,
  };
}

/** Formats an 18-decimal tonnes value for status lines ("0.0421 tCO2e"). */
export function formatTonnes(tonnesWei: bigint): string {
  return `${formatUnits(tonnesWei, 18)} tCO2e`;
}

// ─── Dropped-transaction guard ───────────────────────────────────────────────

/** Public RPC fallbacks per chain (mirrors the backend's rpcUrlForChain sets). */
const TX_INDEX_RPCS: Record<number, string[]> = {
  8453: [
    "https://mainnet.base.org",
    "https://1rpc.io/base",
    "https://base.publicnode.com",
  ],
  1: [
    "https://ethereum.publicnode.com",
    "https://rpc.ankr.com/eth",
    "https://eth.drpc.org",
    "https://cloudflare-eth.com",
  ],
  10: ["https://mainnet.optimism.io"],
  42220: [
    "https://forno.celo.org",
    "https://rpc.ankr.com/celo",
    "https://celo.drpc.org",
    "https://celo.meowrpc.com",
  ],
};

/**
 * Waits for the burn transaction's RECEIPT on one of the chain's public
 * nodes — which proves it MINED, and returns its on-chain outcome.
 * (Replaces waitTxIndexed: a tx *object* existing says nothing about
 * success, and the old dropped-verdict could double-burn a slow tx that
 * later mined.) Returns:
 *   settled=true, success=true   → mined, status 0x1 — proceed to fee
 *   settled=true, success=false  → mined, REVERTED — "Burn Failed", no fee
 *   settled=false                → not mined within the window — submit the
 *     claim without a fee and let it finish from Burn History (the tx may
 *     still be in the wallet relay's queue; declaring it dead risks a
 *     double burn).
 * Unknown chains return settled=true (don't block the flow).
 */
export async function waitBurnReceipt(
  chainId: number,
  hash: string,
  timeoutMs = 90_000,
): Promise<{ settled: boolean; success: boolean }> {
  const urls = TX_INDEX_RPCS[chainId];
  if (!urls || urls.length === 0) return { settled: true, success: true };
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getTransactionReceipt",
            params: [hash],
            id: 1,
          }),
        });
        const j = (await res.json()) as {
          result?: { status?: string } | null;
        };
        if (j.result !== null && j.result !== undefined) {
          return { settled: true, success: j.result.status === "0x1" };
        }
      } catch {
        // try the next fallback
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 10_000));
  }
  return { settled: false, success: false };
}
