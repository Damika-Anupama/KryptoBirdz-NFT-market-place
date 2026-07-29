import type { Bird } from "../birdz";
import { hashString, mulberry32 } from "./rng";
import { simDateLabel } from "./price-history";

export type ProvenanceType = "mint" | "transfer" | "sale";

export interface ProvenanceEvent {
  type: ProvenanceType;
  from: string | null;
  to: string;
  price: number | null;
  /** Simulated date label; live purchases use a real date string instead. */
  date: string;
  daysAgo: number;
}

const HANDLES = [
  "0xfeather.eth", "0xnestkeeper", "0x9wing…c4a", "birdwatcher.eth",
  "0x1f2e…88d", "aviary-one.eth", "0x77aa…3b1", "skycollector.eth",
];

/**
 * Deterministic ownership history per token: a mint, then 1-4 alternating
 * transfers/sales walking toward the current owner. Pure fn of tokenId.
 */
export function getProvenance(bird: Bird): ProvenanceEvent[] {
  const rand = mulberry32(hashString(`prov:${bird.tokenId}`));
  const hops = 1 + Math.floor(rand() * 4);
  const events: ProvenanceEvent[] = [];

  const mintDaysAgo = 300 + Math.floor(rand() * 120);
  const minter = HANDLES[Math.floor(rand() * HANDLES.length)];
  events.push({
    type: "mint",
    from: null,
    to: minter,
    price: Math.round(bird.price * 0.2 * 1000) / 1000,
    date: simDateLabel(mintDaysAgo),
    daysAgo: mintDaysAgo,
  });

  let prevOwner = minter;
  let daysAgo = mintDaysAgo;
  for (let i = 0; i < hops; i++) {
    daysAgo = Math.max(5, daysAgo - Math.floor(rand() * (mintDaysAgo / hops)));
    const isLast = i === hops - 1;
    const nextOwner = isLast
      ? bird.owner
      : HANDLES[Math.floor(rand() * HANDLES.length)];
    const isSale = rand() > 0.35;
    events.push({
      type: isSale ? "sale" : "transfer",
      from: prevOwner,
      to: nextOwner,
      price: isSale
        ? Math.round(bird.price * (0.4 + rand() * 0.8) * 1000) / 1000
        : null,
      date: simDateLabel(daysAgo),
      daysAgo,
    });
    prevOwner = nextOwner;
  }

  return events;
}
