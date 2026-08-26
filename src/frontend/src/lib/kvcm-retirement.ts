/**
 * kVCM retirement burn flow — KlimaDAO Retirement Aggregator on Base.
 *
 * Burning kVCM retires real carbon credits instead of a plain ERC-20
 * transfer-to-dead-address. The retirement is a two-step on-chain sequence:
 *
 *   1. kVCM.approve(AAM, amount)  — approve the Klima Protocol Aggregation
 *      Approval Manager (AAM) to pull the kVCM being retired.
 *   2. retireCreditViaKlima(...)  — call the Retirement Aggregator, which
 *      burns the kVCM and retires the corresponding carbon credits.
 *
 * Contract addresses (Base mainnet, chain 8453) are sourced from the official
 * KlimaDAO retirement-aggregator USAGE.md:
 *   - Retirement Aggregator : 0xda0a793d7c32ab80bcdab7f8c725c96db22464f4
 *   - Klima Protocol (AAM)  : 0x1C24239309398220883207681602BfF4D10fbde1
 *   - kVCM                  : 0x00fbac94fec8d4089d3fe979f39454f48c71a65d
 */
import { encodeFunctionData, getAddress, parseUnits } from "viem";

export const KVCM_RETIREMENT = {
  /** Retirement Aggregator diamond contract. */
  aggregator: "0xda0a793d7c32ab80bcdab7f8c725c96db22464f4",
  /** Klima Protocol Aggregation Approval Manager — the kVCM approval target. */
  aam: "0x1C24239309398220883207681602BfF4D10fbde1",
  /** kVCM ERC-20 token contract. */
  kvcm: "0x00fbac94fec8d4089d3fe979f39454f48c71a65d",
  /** Carbon class vault the retired credits belong to. */
  carbonClass: "0xf4699531e0a5f6e9351a36de3753deaad329bf45",
  chainId: 8453,
  decimals: 18,
} as const;

/** ERC-20 approve ABI — used to approve the AAM to pull kVCM. */
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

/**
 * retireCreditViaKlima ABI on the Retirement Aggregator.
 *
 *   retireCreditViaKlima(
 *     address creditToken,
 *     uint256 tokenId,        // 0 for ERC-20 credits
 *     uint256 batchId,        // 0 for non-Puro credits
 *     uint256 amount,         // tonnes to retire
 *     address inputToken,     // kVCM or USDC
 *     address carbonClass,    // class vault for the credit
 *     uint256 maxInputTokenIn,// max input tokens to spend (slippage)
 *     uint256 couponTonnes,   // 0 — no coupons currently issued
 *     RetireDetails details
 *   )
 */
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
  /** kVCM amount to retire, as a decimal string (e.g. "1.5"). */
  amount: string;
  /** EVM address that receives the retirement certificate. */
  beneficiaryAddress: `0x${string}`;
  /** Human-readable beneficiary name. */
  beneficiaryString: string;
  /** Free-text retirement message. */
  retirementMessage: string;
  /** Generic contract-call helper from useWallet. */
  sendContractTransaction: SendContractTransaction;
}

export interface RetireKvcmResult {
  /** Hash of the kVCM.approve(AAM) transaction. */
  approveHash: string;
  /** Hash of the retireCreditViaKlima transaction (the actual retirement). */
  retireHash: string;
}

/**
 * Retires real carbon credits by burning kVCM through the KlimaDAO Retirement
 * Aggregator on Base. Returns both the approval and retirement tx hashes.
 */
export async function retireKvcm(
  params: RetireKvcmParams,
): Promise<RetireKvcmResult> {
  const trimmed = params.amount.trim();
  if (!trimmed || Number.parseFloat(trimmed) <= 0) {
    throw new Error("Retirement amount must be greater than zero");
  }

  const rawAmount = parseUnits(trimmed, KVCM_RETIREMENT.decimals);
  const kvcmAddress = getAddress(KVCM_RETIREMENT.kvcm);
  const aamAddress = getAddress(KVCM_RETIREMENT.aam);
  const aggregatorAddress = getAddress(KVCM_RETIREMENT.aggregator);
  const carbonClassAddress = getAddress(KVCM_RETIREMENT.carbonClass);

  // Step 1 — approve the AAM to pull the kVCM being retired.
  const approveData = encodeFunctionData({
    abi: ERC20_APPROVE_ABI,
    functionName: "approve",
    args: [aamAddress, rawAmount],
  });
  const approveHash = await params.sendContractTransaction({
    to: kvcmAddress,
    data: approveData,
    chainId: KVCM_RETIREMENT.chainId,
  });

  // Step 2 — retire the carbon credits via the aggregator.
  const retireData = encodeFunctionData({
    abi: RETIRE_CREDIT_VIA_KLIMA_ABI,
    functionName: "retireCreditViaKlima",
    args: [
      kvcmAddress, // creditToken
      0n, // tokenId — 0 for ERC-20 credits
      0n, // batchId — 0 for non-Puro credits
      rawAmount, // amount — tonnes to retire (kVCM is 1:1 with tonnes)
      kvcmAddress, // inputToken — paying with kVCM
      carbonClassAddress, // carbonClass
      rawAmount, // maxInputTokenIn — slippage protection (exact amount)
      0n, // couponTonnes — no coupons currently issued
      {
        retiringAddress: "0x0000000000000000000000000000000000000000",
        retiringEntityString: "",
        beneficiaryAddress: params.beneficiaryAddress,
        beneficiaryString: params.beneficiaryString,
        retirementMessage: params.retirementMessage,
        beneficiaryLocation: "",
        consumptionCountryCode: "",
        consumptionPeriodStart: 0n,
        consumptionPeriodEnd: 0n,
      },
    ],
  });
  const retireHash = await params.sendContractTransaction({
    to: aggregatorAddress,
    data: retireData,
    chainId: KVCM_RETIREMENT.chainId,
  });

  return { approveHash, retireHash };
}
