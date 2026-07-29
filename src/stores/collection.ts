import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PurchaseRecord {
  price: number;
  /** ISO date string recorded at purchase time. */
  at: string;
}

interface CollectionState {
  owned: Record<number, PurchaseRecord>;
  buy: (id: number, price: number) => void;
  reset: () => void;
}

/**
 * Minimal ownership ledger for Wave 1's simulated detail-page purchase.
 * Wave 2's full wallet (balance, gas, receipts) extends this store.
 */
export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      owned: {},
      buy: (id, price) =>
        set({
          owned: {
            ...get().owned,
            [id]: { price, at: new Date().toISOString() },
          },
        }),
      reset: () => set({ owned: {} }),
    }),
    { name: "kb.collection", version: 1 }
  )
);

export const useIsOwned = (id: number) =>
  useCollectionStore((s) => Boolean(s.owned[id]));
