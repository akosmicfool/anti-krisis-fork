/**
 * One-off credit-liquidity scan (ops tool, not shipped):
 * ranks every eligible Klima credit by live retireability for kVCM burns.
 * Usage: npx tsx scripts/scan-klima-credits.ts
 */
import { createPublicClient, http, fallback, encodeFunctionData, parseUnits } from "viem";
import { base } from "viem/chains";
import { writeFileSync } from "node:fs";

const AGG = "0xda0a793d7c32ab80bcdab7f8c725c96db22464f4";
const KVCM = "0x00fbac94fec8d4089d3fe979f39454f48c71a65d";
const USER = "0x2c8467DA8B7B3D0a7e3886F6Cb6697c49571Ff66";
const CAP = 20_000_000n;

const eligible = JSON.parse(
  (await import("node:fs")).readFileSync("/tmp/eligible_credits.json", "utf8"),
) as Array<{ credit: string; class: string; registry: string }>;

const FORWARD_ABI = [
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
const INVERSE_ABI = [
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
const RETIRE_ABI = [
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

const client = createPublicClient({
  chain: base,
  transport: fallback([
    http("https://mainnet.base.org"),
    http("https://1rpc.io/base"),
    http("https://base.publicnode.com"),
  ]),
});

const details = {
  retiringAddress: "0x0000000000000000000000000000000000000000" as const,
  retiringEntityString: "",
  beneficiaryAddress: USER,
  beneficiaryString: "Anti Krisis Protocol",
  retirementMessage: "Mine $AKK",
  beneficiaryLocation: "",
  consumptionCountryCode: "",
  consumptionPeriodStart: 0n,
  consumptionPeriodEnd: 0n,
};

const kvcmWei = parseUnits("0.05", 18); // representative small burn
const maxIn = (kvcmWei * 10200n) / 10000n;

const results: Array<Record<string, unknown>> = [];

async function scan(entry: { credit: string; class: string; registry: string }) {
  const row: Record<string, unknown> = { ...entry };
  // 1. forward quote: kVCM cost of 1 tonne
  try {
    const q = await client.readContract({
      address: AGG,
      abi: FORWARD_ABI,
      functionName: "quoteRetireCreditViaKlima",
      args: [entry.credit as `0x${string}`, 0n, parseUnits("1", 18), KVCM, entry.class as `0x${string}`, 0n],
    });
    row.oneTonneKvcm = Number(q[1]) / 1e18;
  } catch (e) {
    row.forwardQuote = "REVERT";
  }
  // 2. inverse quote for 0.05 kVCM
  try {
    const q = await client.readContract({
      address: AGG,
      abi: INVERSE_ABI,
      functionName: "quoteRetireCreditForInputTokenInViaKlima",
      args: [entry.credit as `0x${string}`, 0n, kvcmWei, KVCM, entry.class as `0x${string}`, 0n],
    });
    row.tonnesFor005 = Number(q[0]) / 1e18;
  } catch {
    row.inverseQuote = "REVERT";
  }
  // 3. simulate the exact retire call
  if (typeof row.tonnesFor005 === "number" && row.tonnesFor005 > 0) {
    const data = encodeFunctionData({
      abi: RETIRE_ABI,
      functionName: "retireCreditViaKlima",
      args: [
        entry.credit as `0x${string}`,
        0n,
        0n,
        parseUnits(String(row.tonnesFor005), 18),
        KVCM,
        entry.class as `0x${string}`,
        maxIn,
        0n,
        details,
      ],
    });
    try {
      const est = await client.estimateGas({ to: AGG, data, account: USER, gas: CAP });
      row.sim = "CLEAN";
      row.gas = Number(est);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      row.sim = msg.includes("Allowance") || msg.includes("0xfb8f41b2") ? "ALLOWANCE (route OK)" : `DEAD: ${msg.slice(0, 90)}`;
    }
  } else {
    row.sim = "NO-QUOTE";
  }
  results.push(row);
  console.log(
    row.credit,
    "| fwd/t:", row.oneTonneKvcm ?? row.forwardQuote,
    "| t@0.05:", row.tonnesFor005 ?? row.inverseQuote,
    "|", row.sim,
  );
}

for (const entry of eligible) {
  await scan(entry);
}
writeFileSync("/tmp/credit_scan.json", JSON.stringify(results, null, 2));
console.log("\nwrote /tmp/credit_scan.json");
