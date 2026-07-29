import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  liked: Record<number, true>;
  toggle: (id: number) => void;
  reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      liked: {},
      toggle: (id) => {
        const next = { ...get().liked };
        if (next[id]) {
          delete next[id];
        } else {
          next[id] = true;
        }
        set({ liked: next });
      },
      reset: () => set({ liked: {} }),
    }),
    { name: "kb.favorites", version: 1 }
  )
);

export const useIsLiked = (id: number) =>
  useFavoritesStore((s) => Boolean(s.liked[id]));
