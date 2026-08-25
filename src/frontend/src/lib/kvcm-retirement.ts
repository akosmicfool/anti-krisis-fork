/**
 * kVCM carbon-retirement burn flow (Option C — frontend-native).
 *
 * Lets users burn kVCM by retiring real carbon credits through the KlimaDAO
 * Retirement Aggregator on Base — fully abstracted: the user only picks kVCM,
 * enters an amount, and signs. Credit selection, quoting, and retirement
 * metadata are auto-filled here.
 *
 * Flow (mirrors the classic DEAD-address burn UX):
 *   1. Build a retirement plan: pick a random eligible credit (subgraph),
 *      reverse-quote kVCM → tonnes, compute maxKvcmIn (+2% slippage buffer).
 *   2. TX A — kVCM.approve(AAM, maxKvcmIn)
 *   3. TX B — aggregator.retireCreditViaKlima(...)  ← the "burn"
 *   Downstream (platform fee + ICP claim) is unchanged; the canister verifies
 *   the retirement receipt via the kVCM Transfer(user → AAM) logs.
 *
 * Trust note: nothing here needs server-side trust — the user's wallet signs
 * every transaction, and the ICP backend independently verifies the receipt.
 */
import { http, createPublicClient, formatUnits, parseUnits } from "viem";
import { base } from "viem/chains";

// ─── Contract addresses (Base Mainnet, chain 8453) ──────────────────────────

export const RETIREMENT_AGGREGATOR =
  "0xda0a793d7c32ab80bcdab7f8c725c96db22464f4" as const;
export const KLIKA_AAM = "0x1C24239309398220883207681602BfF4D10fbde1" as const;
export const KVCM_TOKEN = "0x00fbac94fec8d4089d3fe979f39454f48c71a65d" as const;

/** True when the selected allowlisted token is the kVCM retirement token. */
export function isKvcmRetirement(tokenAddress: string): boolean {
  return tokenAddress.toLowerCase() === KVCM_TOKEN.toLowerCase();
}

/** Slippage buffer on the quoted kVCM cost, in basis points (200 = 2%). */
const SLIPPAGE_BPS = 200n;

// ─── Subgraph endpoints (public Goldsky endpoints, rate limited) ────────────

const PROTOCOL_SUBGRAPH =
  "https://api.goldsky.com/api/public/project_cmgzise2h00195np2gbp35g3d/subgraphs/cm-base-protocol-production/latest/gn";
const CARBON_SUBGRAPH =
  "https://api.goldsky.com/api/public/project_cmgzise2h00195np2gbp35g3d/subgraphs/cm-base-carbon-production/latest/gn";

// ─── Credit eligibility ──────────────────────────────────────────────────────
//
// Instead of a hardcoded registry, eligibility is derived at runtime from the
// CARBON subgraph — newly registered CMARK/UCR credits qualify automatically:
//   - rawRegistryId "VCS"  → Carbonmark Global Credit Factory (CMARK bridge)
//   - rawRegistryId "UCR"  → Universal Carbon Registry (CMARK bridge)
//   - batchId "0"          → excludes Toucan Puro TCO2 (needs real batchIds)
//   - ERC-20 standard only (ECO ERC-1155 needs a separate approval flow)

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

  // Classify via the CARBON subgraph (batched where-clause)
  const addresses = [...new Set(pairs.map((p) => p.creditToken))];
  const carbonRes = await fetch(CARBON_SUBGRAPH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{ creditTokens(first: 50, where: { tokenAddress_in: [${addresses
        .map((a) => `"${a}"`)
        .join(",")}]) { tokenAddress rawRegistryId batchId tokenStandard } }`,
    }),
  });
  if (!carbonRes.ok)
    throw new Error(`Carbon subgraph unavailable (${carbonRes.status})`);
  const carbonJson = (await carbonRes.json()) as {
    data?: {
      creditTokens?: Array<{
        tokenAddress: string;
        rawRegistryId?: string | null;
        batchId?: string | null;
        tokenStandard?: string | null;
      }>;
    };
  };

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

/** Module-level cache so retry attempts don't re-hit the rate-limited subgraphs. */
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
//
// Primary:  quoteRetireCreditForInputTokenInViaKlima — Klima's native inverse
//           quote (kVCM in → tonnes out), one eth_call.
// Fallback: binary search over the forward quote quoteRetireCreditViaKlima
//           (desired tonnes → kVCM cost), ≤10 eth_calls.

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
    address: RETIREMENT_AGGREGATOR,
    abi: QUOTE_INVERSE_ABI,
    functionName: "quoteRetireCreditForInputTokenInViaKlima",
    args: [credit.creditToken, 0n, kvcmWei, KVCM_TOKEN, credit.carbonClass, 0n],
  });
  return { tonnes: result[0], kvcmCost: result[1] };
}

async function forwardSearchQuote(
  client: ReturnType<typeof publicClient>,
  credit: EligibleCredit,
  kvcmWei: bigint,
): Promise<{ tonnes: bigint; kvcmCost: bigint }> {
  // Baseline: cost of 1 tonne
  const base_ = await client.readContract({
    address: RETIREMENT_AGGREGATOR,
    abi: QUOTE_FORWARD_ABI,
    functionName: "quoteRetireCreditViaKlima",
    args: [
      credit.creditToken,
      0n,
      parseUnits("1", 18),
      KVCM_TOKEN,
      credit.carbonClass,
      0n,
    ],
  });
  const oneTonneCost = base_[1];
  if (oneTonneCost <= 0n) throw new Error("Retirement quote unavailable");
  let low = 0n;
  let high = (kvcmWei / oneTonneCost) * 2n + 1n; // generous upper bound
  let bestTonnes = 0n;
  let bestCost = 0n;
  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2n;
    if (mid === 0n) break;
    const q = await client.readContract({
      address: RETIREMENT_AGGREGATOR,
      abi: QUOTE_FORWARD_ABI,
      functionName: "quoteRetireCreditViaKlima",
      args: [credit.creditToken, 0n, mid, KVCM_TOKEN, credit.carbonClass, 0n],
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

// ─── Retirement plan ────────────────────────────────────────────────────────

export interface RetireDetails {
  retiringAddress: string;
  retiringEntityString: string;
  beneficiaryAddress: string;
  beneficiaryString: string;
  retirementMessage: string;
  beneficiaryLocation: string;
  consumptionCountryCode: string;
  consumptionPeriodStart: bigint;
  consumptionPeriodEnd: bigint;
}

export interface RetirementPlan {
  /** TX A — kVCM.approve(AAM, maxKvcmIn), decoded for wallet display. */
  approve: {
    address: string;
    functionName: "approve";
    args: readonly unknown[];
  };
  /** TX B — aggregator.retireCreditViaKlima(...), decoded for wallet display. */
  retire: {
    address: string;
    functionName: "retireCreditViaKlima";
    args: readonly unknown[];
  };
  /** Tonnes (18-decimal) the retirement will fund. */
  tonnes: bigint;
  /** Max kVCM (18-decimal) the transaction may pull (quoted + 2%). */
  maxKvcmIn: bigint;
  /** Human-readable summary for status lines. */
  bridge: string;
  creditToken: string;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/** Auto-filled retirement metadata — the user never sees or edits these. */
export const RETIRE_DETAILS: RetireDetails = {
  retiringAddress: ZERO_ADDRESS, // defaults to msg.sender (user's wallet)
  retiringEntityString: "",
  beneficiaryAddress: ZERO_ADDRESS, // defaults to retiringAddress
  beneficiaryString: "Anti Krisis Protocol",
  retirementMessage: "Mine Anti Krisis Koin",
  beneficiaryLocation: "",
  consumptionCountryCode: "",
  consumptionPeriodStart: 0n,
  consumptionPeriodEnd: 0n,
};

const APPROVE_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

/** ABI for the kVCM approve transaction (spender = Klima Protocol AAM). */
export const KVCM_APPROVE_ABI = APPROVE_ABI;

const RETIRE_ABI = [
  {
    name: "retireCreditViaKlima",
    type: "function",
    stateMutability: "nonpayable",
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
  },
] as const;

/** ABI for the retireCreditViaKlima transaction on the aggregator. */
export const KVCM_RETIRE_ABI = RETIRE_ABI;

/**
 * Build everything the wallet must sign for one kVCM retirement.
 * Throws with user-friendly messages when the amount is too small or no
 * eligible credit exists.
 */
export async function buildRetirementPlan(
  kvcmHumanAmount: string,
): Promise<RetirementPlan> {
  const kvcmWei = parseUnits(kvcmHumanAmount.trim(), 18);

  const credits = await getEligibleCredits();
  if (credits.length === 0) {
    throw new Error(
      "No eligible carbon credits are currently available for retirement. Please try again later.",
    );
  }
  const credit = credits[randomIndex(credits.length)];

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

  const maxKvcmIn = quoted.kvcmCost + (quoted.kvcmCost * SLIPPAGE_BPS) / 10000n;

  return {
    approve: {
      address: KVCM_TOKEN,
      functionName: "approve" as const,
      args: [KLIKA_AAM, maxKvcmIn] as const,
    },
    retire: {
      address: RETIREMENT_AGGREGATOR,
      functionName: "retireCreditViaKlima" as const,
      args: [
        credit.creditToken,
        0n, // tokenId — always 0 for ERC-20 credits
        0n, // batchId — 0 for CMARK/UCR
        quoted.tonnes,
        KVCM_TOKEN,
        credit.carbonClass,
        maxKvcmIn,
        0n, // couponTonnes — none issued
        RETIRE_DETAILS,
      ] as const,
    },
    tonnes: quoted.tonnes,
    maxKvcmIn,
    bridge: credit.bridge,
    creditToken: credit.creditToken,
  };
}

/** Formats an 18-decimal tonnes value for status lines ("0.0421 tCO2e"). */
export function formatTonnes(tonnesWei: bigint): string {
  return `${formatUnits(tonnesWei, 18)} tCO2e`;
}
