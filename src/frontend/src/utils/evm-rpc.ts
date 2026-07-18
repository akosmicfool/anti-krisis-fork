/**
 * Shared Ethereum RPC endpoint list.
 * Used by WalletsAndBalances, BurnPage, and AdminPage for Ethereum contract reads.
 * Ordered by reliability: llamarpc (high throughput) → publicnode (reliable fallback)
 * → ankr (public, good uptime) → cloudflare-eth (last resort).
 */
export const ETH_RPC_ENDPOINTS: readonly string[] = [
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://rpc.ankr.com/eth",
  "https://cloudflare-eth.com",
];
