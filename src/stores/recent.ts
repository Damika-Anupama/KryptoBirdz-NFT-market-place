import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 8;

interface RecentState {
  ids: number[];
  record: (id: number) => void;
  reset: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      ids: [],
      record: (id) => {
        const rest = get().ids.filter((x) => x !== id);
        set({ ids: [id, ...rest].slice(0, MAX_RECENT) });
      },
      reset: () => set({ ids: [] }),
    }),
    { name: "kb.recent", version: 1 }
  )
);
