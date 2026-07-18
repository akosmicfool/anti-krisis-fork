import { AuditAction, ClaimStatus } from "./backend";

import type { Tribe, TribeId } from "./backend";
export type { Tribe, TribeId };

export { ClaimStatus, AuditAction };

// Re-export backend types used across the app
export type {
  AllowlistedToken,
  AuditLogEntry,
  ClaimRecord,
} from "./backend";

// Chain identifiers
export type Chain =
  | "ethereum"
  | "arbitrum"
  | "polygon"
  | "optimism"
  | "base"
  | "celo";

// UI helpers
export interface ClaimStatusDisplay {
  label: string;
  color: "pending" | "verified" | "failed" | "pending_fee";
}

// pending_fee is a backend variant not yet in the generated enum — match by string value.
export const CLAIM_STATUS_PENDING_FEE = "pendingFee" as unknown as ClaimStatus;

export function isPendingFee(status: ClaimStatus): boolean {
  // Handle both the future enum value and the raw string the backend may emit.
  const s = status as unknown as string;
  return s === "pendingFee" || s === "pending_fee";
}

export function getClaimStatus(status: ClaimStatus): ClaimStatusDisplay {
  if (isPendingFee(status))
    return { label: "Fee Failed — Retry", color: "pending_fee" };
  if (status === ClaimStatus.pending)
    return { label: "CONFIRMING", color: "pending" };
  if (status === ClaimStatus.verified)
    return { label: "VERIFIED", color: "verified" };
  return { label: "FAILED", color: "failed" };
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}…${address.slice(-4)}`;
}

export function formatGrit(amount: bigint): string {
  const num = Number(amount);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toLocaleString();
}

/**
 * Format a USD dollar value:
 * - non-finite         → '$0.00'
 * - < 0                → '<$0.00'  (below zero)
 * - === 0              → '$0.00'
 * - 0 < v < 0.01       → '<$0.01'  (positive but tiny)
 * - 0.01 <= v < 1      → '$X.XX'   (2 dp)
 * - >= 1               → locale string with 2 dp
 * - >= 1000            → locale string with commas
 */
export function formatUSDValue(usd: number): string {
  if (!Number.isFinite(usd)) return "$0.00";
  if (usd < 0) return "<$0.00";
  if (usd === 0) return "$0.00";
  if (usd < 0.01) return "<$0.01";
  if (usd >= 1000)
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (usd >= 1)
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${usd.toFixed(2)}`;
}

export const CHAIN_LABELS: Record<string, string> = {
  ethereum: "Ethereum",
  arbitrum: "Arbitrum",
  polygon: "Polygon",
  optimism: "Optimism",
  base: "Base",
  celo: "Celo",
};

export const CHAIN_IDS: Record<number, string> = {
  1: "ethereum",
  42161: "arbitrum",
  137: "polygon",
  10: "optimism",
  8453: "base",
  42220: "celo",
};

/** Maps a chain string identifier to its numeric EVM chain ID. */
export function getChainId(chain: string): number {
  const map: Record<string, number> = {
    ethereum: 1,
    arbitrum: 42161,
    polygon: 137,
    optimism: 10,
    base: 8453,
    celo: 42220,
  };
  return map[chain] ?? 1;
}

/** Returns the block explorer URL for a given tx hash and chain. */
export function getExplorerUrl(txHash: string, chain: string): string {
  const bases: Record<string, string> = {
    ethereum: "https://etherscan.io/tx/",
    arbitrum: "https://arbiscan.io/tx/",
    polygon: "https://polygonscan.com/tx/",
    optimism: "https://optimistic.etherscan.io/tx/",
    base: "https://basescan.org/tx/",
    celo: "https://celoscan.io/tx/",
  };
  return `${bases[chain] ?? "https://etherscan.io/tx/"}${txHash}`;
}
