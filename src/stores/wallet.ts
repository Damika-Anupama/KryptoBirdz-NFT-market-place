import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Persona {
  id: string;
  name: string;
  address: string;
  /** Starting balance in ETH. */
  start: number;
}

export const PERSONAS: readonly Persona[] = [
  {
    id: "aria",
    name: "Aria Skye",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    start: 10,
  },
  {
    id: "kestrel",
    name: "Kestrel Vane",
    address: "0x9A4bE28cF1eD8CbF88bE8e6b4b7CE0e9e5a271d4",
    start: 12.5,
  },
  {
    id: "nimbus",
    name: "Nimbus Wren",
    address: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
    start: 8,
  },
] as const;

export type OfferStatus = "pending" | "accepted" | "declined" | "cancelled";

export interface Offer {
  id: number;
  birdId: number;
  amount: number;
  status: OfferStatus;
  createdAt: number;
  /** Epoch ms when the bot seller responds. */
  resolveAt: number;
}

export interface HistoryEntry {
  birdId: number;
  kind: "purchase" | "sale";
  price: number;
  gas: number;
  txHash: string;
  at: string;
}

interface WalletState {
  connectedId: string | null;
  /** Balance per persona, created lazily on first connect. */
  balances: Record<string, number>;
  /** Bird id -> your asking price. */
  listings: Record<number, number>;
  offers: Offer[];
  history: HistoryEntry[];
  /** Epoch ms of last faucet claim, per persona. */
  faucetClaims: Record<string, number>;
  connect: (personaId: string) => void;
  disconnect: () => void;
  credit: (amount: number) => void;
  debit: (amount: number) => void;
  list: (birdId: number, price: number) => void;
  delist: (birdId: number) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (id: number, status: OfferStatus) => void;
  addHistory: (entry: HistoryEntry) => void;
  claimFaucet: () => void;
  resetWallet: () => void;
}

export const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const FAUCET_AMOUNT = 1;

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      connectedId: null,
      balances: {},
      listings: {},
      offers: [],
      history: [],
      faucetClaims: {},
      connect: (personaId) => {
        const persona = PERSONAS.find((p) => p.id === personaId);
        if (!persona) return;
        const balances = { ...get().balances };
        if (balances[personaId] == null) balances[personaId] = persona.start;
        set({ connectedId: personaId, balances });
      },
      disconnect: () => set({ connectedId: null }),
      credit: (amount) => {
        const id = get().connectedId;
        if (!id) return;
        set({
          balances: {
            ...get().balances,
            [id]: Math.round((get().balances[id] + amount) * 10000) / 10000,
          },
        });
      },
      debit: (amount) => {
        const id = get().connectedId;
        if (!id) return;
        set({
          balances: {
            ...get().balances,
            [id]: Math.round((get().balances[id] - amount) * 10000) / 10000,
          },
        });
      },
      list: (birdId, price) =>
        set({ listings: { ...get().listings, [birdId]: price } }),
      delist: (birdId) => {
        const listings = { ...get().listings };
        delete listings[birdId];
        set({ listings });
      },
      addOffer: (offer) => set({ offers: [offer, ...get().offers] }),
      updateOffer: (id, status) =>
        set({
          offers: get().offers.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }),
      addHistory: (entry) =>
        set({ history: [entry, ...get().history].slice(0, 100) }),
      claimFaucet: () => {
        const id = get().connectedId;
        if (!id) return;
        get().credit(FAUCET_AMOUNT);
        set({ faucetClaims: { ...get().faucetClaims, [id]: Date.now() } });
      },
      resetWallet: () => {
        const id = get().connectedId;
        const persona = PERSONAS.find((p) => p.id === id);
        set({
          balances: id && persona ? { [id]: persona.start } : {},
          listings: {},
          offers: [],
          history: [],
          faucetClaims: {},
        });
      },
    }),
    { name: "kb.wallet", version: 1 }
  )
);

export const useConnectedPersona = () =>
  useWalletStore((s) =>
    s.connectedId ? PERSONAS.find((p) => p.id === s.connectedId) ?? null : null
  );

export const useBalance = () =>
  useWalletStore((s) =>
    s.connectedId ? s.balances[s.connectedId] ?? 0 : 0
  );

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
