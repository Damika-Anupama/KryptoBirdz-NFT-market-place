import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActivityType =
  | "purchase"
  | "sale"
  | "like"
  | "unlike"
  | "offer-made"
  | "offer-accepted"
  | "offer-declined"
  | "offer-cancelled"
  | "listing"
  | "delisting"
  | "connect"
  | "disconnect"
  | "faucet";

export interface ActivityEvent {
  id: number;
  type: ActivityType;
  /** Referenced bird, when the event concerns one. */
  birdId: number | null;
  price: number | null;
  /** Whether the acting party was the local user or a simulated bot. */
  who: "you" | "bot";
  at: string;
}

interface ActivityState {
  events: ActivityEvent[];
  nextId: number;
  log: (e: Omit<ActivityEvent, "id" | "at">) => void;
  clear: () => void;
}

const MAX_EVENTS = 300;

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      events: [],
      nextId: 1,
      log: (e) =>
        set({
          events: [
            { ...e, id: get().nextId, at: new Date().toISOString() },
            ...get().events,
          ].slice(0, MAX_EVENTS),
          nextId: get().nextId + 1,
        }),
      clear: () => set({ events: [] }),
    }),
    { name: "kb.activity", version: 1 }
  )
);

export const logActivity = (e: Omit<ActivityEvent, "id" | "at">) =>
  useActivityStore.getState().log(e);
