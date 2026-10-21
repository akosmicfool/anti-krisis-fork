import { TX_INDEX_RPCS } from "../lib/kvcm-retirement";

/**
 * Shared Ethereum RPC endpoint list for contract reads (WalletsAndBalances,
 * BurnPage, AdminPage, AcquireSection, useNftOwnership).
 *
 * Single-sourced from TX_INDEX_RPCS (kvcm-retirement.ts) — the canonical set
 * aligned with the backend's fee verifier. The retired
 * llamarpc/publicnode/ankr/cloudflare-eth list this file used to carry served
 * stale browser reads (ankr is key-gated → result:null, cloudflare-eth
 * result:null, publicnode 403s canister-adjacent traffic).
 */
export const ETH_RPC_ENDPOINTS: readonly string[] = TX_INDEX_RPCS[1];
