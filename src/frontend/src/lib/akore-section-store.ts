export type AkoreSection = "acquire" | "burn" | "mine";

let lastSection: AkoreSection | null = null;

export function getLastAkoreSection(): AkoreSection | null {
  return lastSection;
}

export function setLastAkoreSection(section: AkoreSection | null) {
  lastSection = section;
}
