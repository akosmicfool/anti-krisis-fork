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

/**
 * Chain names this app build can burn on END-TO-END — the 4 chains with
 * allowlisted tokens, a wrapped-native fee price, and receipt RPC coverage.
 * A name outside this map is unsupported and must fail loudly: the old
 * `?? 1` silently burned and fee'd on Ethereum for any unexpected name
 * (finding #18).
 */
const CHAIN_ID_BY_NAME: Record<string, number> = {
  ethereum: 1,
  optimism: 10,
  base: 8453,
  celo: 42220,
};

/**
 * Maps a chain string identifier to its numeric EVM chain ID.
 * Returns null for any chain this build does not support — callers MUST
 * abort the operation and surface UNSUPPORTED_CHAIN_MSG, never default.
 */
export function getChainId(chain: string): number | null {
  return CHAIN_ID_BY_NAME[chain] ?? null;
}

/**
 * Shown when a token or claim names a chain this app build cannot burn on.
 * Same fail-loudly rule as LIVE_PRICE_UNAVAILABLE_MSG — never proceed on a
 * guessed chain.
 */
export const UNSUPPORTED_CHAIN_MSG =
  "This token's chain isn't supported by this app build — ask an admin to update the app before burning.";

/**
 * Returns the block explorer URL for a tx hash on a given chain, or "" when
 * the chain is unknown — callers must hide the link then. Never fall back to
 * a FOREIGN explorer: a Celo tx shown on Etherscan reads "not found" and
 * sends debugging down the wrong path (the celoscan lesson). Single source —
 * BurnHistoryPage used to carry a duplicate map that disagreed on the
 * fallback (etherscan vs basescan).
 */
export function explorerUrl(chain: string, txHash: string): string {
  const bases: Record<string, string> = {
    ethereum: "https://etherscan.io/tx/",
    arbitrum: "https://arbiscan.io/tx/",
    polygon: "https://polygonscan.com/tx/",
    optimism: "https://optimistic.etherscan.io/tx/",
    base: "https://basescan.org/tx/",
    celo: "https://celoscan.io/tx/",
  };
  const base = bases[chain];
  return base ? `${base}${txHash}` : "";
}
