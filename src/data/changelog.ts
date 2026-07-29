export interface WaveEntry {
  wave: number;
  date: string;
  title: string;
  highlights: string[];
}

/** Fed from the FEATURES.md wave log — newest first. */
export const CHANGELOG: WaveEntry[] = [
  {
    wave: 2,
    date: "2026-07-29",
    title: "The economy works",
    highlights: [
      "Simulated wallet: 3 personas, persistent balance, faucet, typed-RESET wipe",
      "Multi-step purchases with gas, block confirmations, receipts and tx hashes",
      "List owned birds for sale (bot collectors buy them) and haggle via offers",
      "Activity feed with type filters, live timestamps and full local persistence",
      "Toast stack, confetti, balance ticker and success-checkmark micro-motion",
    ],
  },
  {
    wave: 1,
    date: "2026-07-29",
    title: "It's a real app now",
    highlights: [
      "Routed pages: marketplace, full item details, about, changelog, 404",
      "Item pages: traits with rarity %, price history, provenance, lightbox, share cards",
      "Likes, ownership and recently-viewed persist locally across reloads",
      "URL-synced search & filters — every market view is a shareable link",
      "Keyboard navigation (←/→ between birds, ? for shortcuts) and error recovery",
    ],
  },
  {
    wave: 0,
    date: "2026-07-27",
    title: "Foundations",
    highlights: [
      "Migrated CRA 5/React 17 to Vite 6 + React 18 + strict TypeScript",
      "Added the vitest suite and push/deploy verify gates",
      "Authored the 980-item feature catalog across 15 epics",
    ],
  },
];
