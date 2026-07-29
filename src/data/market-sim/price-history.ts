import type { Bird } from "../birdz";
import { hashString, mulberry32 } from "./rng";

export interface PricePoint {
  /** Days before the simulation anchor date (0 = most recent). */
  daysAgo: number;
  /** Simulated calendar date label, e.g. "Jun 12". */
  date: string;
  price: number;
}

/** Fixed anchor so simulated dates are stable across builds and tests. */
export const SIM_ANCHOR = new Date("2026-07-01T00:00:00Z");

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function simDateLabel(daysAgo: number): string {
  const d = new Date(SIM_ANCHOR.getTime() - daysAgo * 86_400_000);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/**
 * Seeded random walk over `days` points that always ends at the bird's
 * current list price — deterministic per token.
 */
export function getPriceHistory(bird: Bird, days = 30): PricePoint[] {
  const rand = mulberry32(hashString(`price:${bird.tokenId}`));
  // Walk backwards from the list price so the series ends exactly at it.
  const prices: number[] = [bird.price];
  let p = bird.price;
  for (let i = 1; i < days; i++) {
    const drift = (rand() - 0.48) * 0.08 * p;
    p = Math.max(0.05, p - drift);
    prices.push(p);
  }
  prices.reverse();
  return prices.map((price, idx) => {
    const daysAgo = days - 1 - idx;
    return {
      daysAgo,
      date: simDateLabel(daysAgo),
      price: Math.round(price * 1000) / 1000,
    };
  });
}
