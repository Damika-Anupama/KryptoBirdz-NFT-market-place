import { BIRDZ } from "./birdz";

/** How many birds carry each trait, computed once from the catalogue. */
const traitCounts = new Map<string, number>();
for (const bird of BIRDZ) {
  for (const trait of bird.traits) {
    traitCounts.set(trait, (traitCounts.get(trait) ?? 0) + 1);
  }
}

export function traitCount(trait: string): number {
  return traitCounts.get(trait) ?? 0;
}

/** Percentage (1 decimal) of catalogue birds carrying the trait. */
export function traitRarityPct(trait: string): number {
  return Math.round((traitCount(trait) / BIRDZ.length) * 1000) / 10;
}
