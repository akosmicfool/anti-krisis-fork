/**
 * Shared DexScreener price fetching utilities.
 * Used by both the Burn page price hook and the Admin allowlist panel.
 *
 * Two-endpoint pattern:
 *  1. /latest/dex/tokens/<address>  — fast primary lookup
 *  2. /latest/dex/search?q=<address> — fallback for low-liquidity tokens (e.g. IMPT)
 *
 * Pair selection mirrors the backend oracle (src/backend/lib/price-oracle.mo):
 * DexScreener's pair-level priceUsd is the BASE token's price, so only pairs
 * whose baseToken.address IS the queried token say anything about its USD
 * value. The 2026-08-28 dust-pair incident (a $1.91-liquidity pair quoting IN
 * kVCM priced it ~11× high) is the failure mode this filter removes.
 */

export interface DexPair {
  priceUsd?: string;
  liquidity?: { usd?: number };
  chainId?: string;
  baseToken?: { name?: string; symbol?: string; address?: string };
}

/**
 * Pick the best pair for `wantedAddress`.
 *
 * Eligibility (mirrors price-oracle.mo's per-pair segmentation + base-token
 * filter): only pairs where the queried token IS the base token. A pair that
 * merely QUOTES the wanted token prices the other side of the book — it says
 * nothing about the wanted token's USD value.
 *
 * Among eligible pairs, pairs on `wantedChainId` win when any exist (the API
 * carries the pair's chainId; the backend oracle is chain-agnostic because it
 * has no chain context — callers that DO know the chain pass it here). Then
 * the highest `liquidity.usd` wins.
 *
 * Falls back to the base-token-true set across chains when no pair sits on
 * `wantedChainId`, and to null when no eligible pair carries a usable price:
 * a quote-side or dust pair must never become the price. Callers treat null
 * as "no price" and abort — burn fee sizing is gated on it.
 *
 * @param wantedChainId DexScreener chain slug, e.g. "base", "ethereum".
 */
export function pickBestPair(
  pairs: DexPair[],
  wantedAddress: string,
  wantedChainId?: string,
): { priceUsd: string } | null {
  const wanted = wantedAddress.toLowerCase();

  const baseTrue = (pairs ?? []).filter((p) => {
    const base = p.baseToken?.address;
    return typeof base === "string" && base.toLowerCase() === wanted;
  });
  if (baseTrue.length === 0) return null;

  const onChain = wantedChainId
    ? baseTrue.filter(
        (p) => p.chainId?.toLowerCase() === wantedChainId.toLowerCase(),
      )
    : [];
  const candidates = onChain.length > 0 ? onChain : baseTrue;

  const priced = candidates.filter(
    (p) =>
      p.priceUsd !== undefined &&
      p.priceUsd !== "" &&
      Number.parseFloat(p.priceUsd) > 0,
  );
  if (priced.length === 0) return null;

  const best = priced.reduce((b, p) =>
    (p.liquidity?.usd ?? 0) > (b.liquidity?.usd ?? 0) ? p : b,
  );
  return { priceUsd: best.priceUsd ?? "0" };
}

/**
 * Fetch the USD price for a token from DexScreener.
 * Tries the primary tokens endpoint first; falls back to the search endpoint
 * for tokens that return empty pairs on the primary (e.g. IMPT on Ethereum).
 *
 * Returns null if neither endpoint yields a base-token-true pair with a
 * usable price — callers must treat that as "no price", never substitute one.
 *
 * @param chainId Optional DexScreener chain slug ("base", "ethereum", …):
 *   when given, pairs on that chain win over pairs on other chains.
 */
export async function fetchDexScreenerPrice(
  tokenAddress: string,
  chainId?: string,
): Promise<number | null> {
  const addr = tokenAddress.toLowerCase();

  // Primary endpoint: /latest/dex/tokens/<address>
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${addr}`,
    );
    if (res.ok) {
      const json = (await res.json()) as { pairs?: DexPair[] };
      const best = pickBestPair(json.pairs ?? [], addr, chainId);
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
      const best = pickBestPair(json.pairs ?? [], addr, chainId);
      if (best) return Number.parseFloat(best.priceUsd);
    }
  } catch {
    // fallback endpoint also failed
  }

  return null;
}
