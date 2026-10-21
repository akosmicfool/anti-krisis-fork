// ─── Display formatters ──────────────────────────────────────────────────────
//
// ONE definition per unit so two surfaces can never render the same number
// differently. Magnitude conventions are frozen: the compact GRIT forms divide
// by 1e9 for "B" (raw GRIT units), AK69 scores are floats rendered with
// toFixed(2) at the call site. Magnitude suffixes always carry a LEADING SPACE
// ("26.00 B") — owner rule 2026-10-14.

/** Compact GRIT (raw units): T/B/M/K with 2 decimals, plain locale below 1e3. */
export function formatGrit(amount: bigint): string {
  const num = Number(amount);
  if (num >= 1_000_000_000_000)
    return `${(num / 1_000_000_000_000).toFixed(2)} T`;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)} K`;
  return num.toLocaleString();
}

/**
 * GRIT spent, in billions: raw units / 1e9 with up to 2 decimals. Call sites
 * append the literal " B" themselves.
 */
export function formatGritSpent(amount: bigint): string {
  const num = Number(amount) / 1_000_000_000;
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** GRIT as T/B/M with 2 decimals; below 1e6 the raw value with 2 decimals. */
export function formatGritCompact(raw: number): string {
  // raw is the raw Nat value from the backend — divide directly for display
  if (raw >= 1_000_000_000_000)
    return `${(raw / 1_000_000_000_000).toFixed(2)} T`;
  if (raw >= 1_000_000_000) return `${(raw / 1_000_000_000).toFixed(2)} B`;
  if (raw >= 1_000_000) return `${(raw / 1_000_000).toFixed(2)} M`;
  return raw.toFixed(2);
}

/** Full GRIT with thousands separators and no magnitude suffix. */
export function formatGritFull(amount: bigint): string {
  return Number(amount).toLocaleString("en-US");
}

/** GRIT issuance rate (GRIT per $1): T/B/M suffix with no decimals. */
export function formatGritRate(rate: bigint): string {
  const n = Number(rate);
  if (n >= 1_000_000_000_000) return `${n / 1_000_000_000_000} T`;
  if (n >= 1_000_000_000) return `${n / 1_000_000_000} B`;
  if (n >= 1_000_000) return `${n / 1_000_000} M`;
  return n.toLocaleString("en-US");
}

/**
 * GRIT issuance rate in WORDS ("1 Trillion") — the owner's format for the
 * Burn History tile value (word units are reserved for this value only).
 */
export function formatGritRateWords(rate: bigint): string {
  const n = Number(rate);
  const trim = (x: number) =>
    x.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1_000_000_000_000) return `${trim(n / 1_000_000_000_000)} Trillion`;
  if (n >= 1_000_000_000) return `${trim(n / 1_000_000_000)} Billion`;
  if (n >= 1_000_000) return `${trim(n / 1_000_000)} Million`;
  return n.toLocaleString("en-US");
}
