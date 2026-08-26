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

  // Classify via the CARBON subgraph using a CONSTANT query — fetch every
  // registered creditToken once and intersect with the protocol list here.
  // (A string-interpolated where-in clause produced malformed GraphQL and the
  // endpoint answered HTTP 200 + errors + empty data, which read as "no
  // eligible credits" and failed every burn.)
  const carbonRes = await fetch(CARBON_SUBGRAPH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query:
        "{ creditTokens(first: 1000) { tokenAddress rawRegistryId batchId tokenStandard } }",
    }),
  });
  if (!carbonRes.ok)
    throw new Error(`Carbon subgraph unavailable (${carbonRes.status})`);
  const carbonJson = (await carbonRes.json()) as {
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
  // A malformed/failed query comes back as HTTP 200 with errors + empty data.
  // Surface it loudly instead of silently treating it as "no eligible credits".
  if (carbonJson.errors && carbonJson.errors.length > 0) {
    throw new Error(
      `Carbon subgraph query failed: ${carbonJson.errors[0]?.message ?? "unknown error"}`,
    );
  }

  const eligible = new Map<string, EligibleCredit>();
  for (const ct of carbonJson.data?.creditTokens ?? []) {
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
  return createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org"),
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

  // 1-2. Discover eligible credits and pick one at random
  const credits = await getEligibleCredits();
  if (credits.length === 0) {
    throw new Error(
      "No eligible carbon credits are currently available for retirement. Please try again later.",
    );
  }
  const credit = credits[randomIndex(credits.length)];

  // 3. Reverse-quote the kVCM budget into tonnes (+ fallback search)
  const client = publicClient();
  let quoted: { tonnes: bigint; kvcmCost: bigint };
  try {
    quoted = await inverseQuote(client, credit, kvcmWei);
  } catch {
    quoted = await forwardSearchQuote(client, credit, kvcmWei);
  }
  if (quoted.tonnes <= 0n || quoted.kvcmCost <= 0n) {
    throw new Error(
      "Amount too small — it does not fund any measurable carbon retirement.",
    );
  }

  // 4. Slippage buffer on the quoted cost
  const maxKvcmIn = quoted.kvcmCost + (quoted.kvcmCost * SLIPPAGE_BPS) / 10000n;

  // 5. TX A — approve the AAM to pull up to maxKvcmIn
  const approveData = encodeFunctionData({
    abi: ERC20_APPROVE_ABI,
    functionName: "approve",
    args: [KVCM_RETIREMENT.aam as `0x${string}`, maxKvcmIn],
  });
  const approveHash = await params.sendContractTransaction({
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
    throw new Error("Approval transaction failed on-chain. Please try again.");
  }

  // 6. TX B — retire the picked credit, paying with kVCM
  const retireData = encodeFunctionData({
    abi: RETIRE_CREDIT_VIA_KLIMA_ABI,
    functionName: "retireCreditViaKlima",
    args: [
      credit.creditToken, // creditToken — a REGISTERED credit, never kVCM
      0n, // tokenId — 0 for ERC-20 credits
      0n, // batchId — 0 for CMARK/UCR
      quoted.tonnes, // amount — tonnes from the quote, NOT the raw payment
      KVCM_RETIREMENT.kvcm as `0x${string}`, // inputToken — paying with kVCM
      credit.carbonClass, // carbonClass — vault owning the picked credit
      maxKvcmIn, // slippage-protected spend cap
      0n, // couponTonnes — none issued
      {
        ...RETIRE_DETAILS,
        beneficiaryAddress: params.beneficiaryAddress,
      },
    ],
  });
  const retireHash = await params.sendContractTransaction({
    to: KVCM_RETIREMENT.aggregator as `0x${string}`,
    data: retireData,
    chainId: KVCM_RETIREMENT.chainId,
  });

  return {
    approveHash,
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
