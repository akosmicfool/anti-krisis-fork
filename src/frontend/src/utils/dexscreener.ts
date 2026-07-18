/**
 * Shared DexScreener price fetching utilities.
 * Used by both the Burn page price hook and the Admin allowlist panel.
 *
 * Two-endpoint pattern:
 *  1. /latest/dex/tokens/<address>  — fast primary lookup
 *  2. /latest/dex/search?q=<address> — fallback for low-liquidity tokens (e.g. IMPT)
 */

export interface DexPair {
  priceUsd?: string;
  liquidity?: { usd?: number };
  chainId?: string;
  baseToken?: { name?: string; symbol?: string };
}

/**
 * Pick the best pair from a list: highest liquidity.usd among pairs with a
 * valid (>0) priceUsd.
 */
export function pickBestPair(
  pairs: Array<{ priceUsd?: string; liquidity?: { usd?: number } }>,
): { priceUsd: string } | null {
  // Primary filter: valid price AND some liquidity data
  const priced = (pairs ?? []).filter(
    (p) =>
      p.priceUsd !== undefined &&
      p.priceUsd !== "" &&
      Number.parseFloat(p.priceUsd) > 0,
  );
  if (priced.length > 0) {
    // Pick highest-liquidity pair
    const best = priced.reduce((b, p) =>
      (p.liquidity?.usd ?? 0) > (b.liquidity?.usd ?? 0) ? p : b,
    );
    return { priceUsd: best.priceUsd ?? "0" };
  }

  // Fallback: any pair with a non-empty positive priceUsd, ignoring liquidity
  const anyPriced = (pairs ?? []).find(
    (p) =>
      p.priceUsd !== undefined &&
      p.priceUsd !== "" &&
      Number.parseFloat(p.priceUsd) > 0,
  );
  if (anyPriced) return { priceUsd: anyPriced.priceUsd ?? "0" };

  return null;
}

/**
 * Fetch the USD price for a token from DexScreener.
 * Tries the primary tokens endpoint first; falls back to the search endpoint
 * for tokens that return empty pairs on the primary (e.g. IMPT on Ethereum).
 *
 * Returns null if neither endpoint finds a price.
 */
export async function fetchDexScreenerPrice(
  tokenAddress: string,
): Promise<number | null> {
  const addr = tokenAddress.toLowerCase();

  // Primary endpoint: /latest/dex/tokens/<address>
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${addr}`,
    );
    if (res.ok) {
      const json = (await res.json()) as { pairs?: DexPair[] };
      const best = pickBestPair(json.pairs ?? []);
      if (best) return Number.parseFloat(best.priceUsd);
    }
  } catch {
    // primary endpoint failed — try fallback
  }

  // Fallback endpoint: /latest/dex/search?q=<address>
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${addr}`,
    );
    if (res.ok) {
      const json = (await res.json()) as { pairs?: DexPair[] };
      const best = pickBestPair(json.pairs ?? []);
      if (best) return Number.parseFloat(best.priceUsd);
    }
  } catch {
    // fallback endpoint also failed
  }

  return null;
}
