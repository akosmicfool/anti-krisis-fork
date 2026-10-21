// Chain logos for the four EVM chains this app supports. An id that resolves
// to no committed asset renders nothing — never a wrong or fallback logo.

const CHAIN_LOGOS: Record<string, string> = {
  ethereum: "/assets/chains/ethereum.svg",
  optimism: "/assets/chains/optimism.svg",
  celo: "/assets/chains/celo.svg",
  base: "/assets/chains/base.svg",
};

const CHAIN_ID_KEYS: Record<number, string> = {
  1: "ethereum",
  10: "optimism",
  42220: "celo",
  8453: "base",
};

interface ChainLogoProps {
  /** Numeric chainId (1/10/42220/8453) or the chain name as the app spells it. */
  id: number | string;
  className?: string;
}

export function ChainLogo({ id, className }: ChainLogoProps) {
  const key = typeof id === "number" ? CHAIN_ID_KEYS[id] : id.toLowerCase();
  const src = key ? CHAIN_LOGOS[key] : undefined;
  if (!src) return null;
  return <img src={src} alt="" className={className} />;
}
