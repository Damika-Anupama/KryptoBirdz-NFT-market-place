import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  /** Total lifetime in ms; the progress bar animates over this. */
  duration: number;
  /** Paused toasts (hover) stop their dismiss timer. */
  paused: boolean;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, duration?: number) => void;
  dismiss: (id: number) => void;
  setPaused: (id: number, paused: boolean) => void;
  clearAll: () => void;
}

export const MAX_VISIBLE_TOASTS = 3;

let nextId = 1;
const timers = new Map<number, number>();

function startTimer(id: number, remaining: number) {
  timers.set(
    id,
    window.setTimeout(() => {
      useToastStore.getState().dismiss(id);
    }, remaining)
  );
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, duration = 3200) => {
    const toast: Toast = { id: nextId++, message, duration, paused: false };
    set({ toasts: [...get().toasts, toast] });
    startTimer(toast.id, duration);
  },
  dismiss: (id) => {
    const t = timers.get(id);
    if (t) window.clearTimeout(t);
    timers.delete(id);
    set({ toasts: get().toasts.filter((x) => x.id !== id) });
  },
  setPaused: (id, paused) => {
    const existing = timers.get(id);
    if (paused && existing) {
      window.clearTimeout(existing);
      timers.delete(id);
    }
    if (!paused && !timers.get(id)) {
      const toast = get().toasts.find((x) => x.id === id);
      if (toast) startTimer(id, toast.duration);
    }
    set({
      toasts: get().toasts.map((x) => (x.id === id ? { ...x, paused } : x)),
    });
  },
  clearAll: () => {
    for (const t of timers.values()) window.clearTimeout(t);
    timers.clear();
    set({ toasts: [] });
  },
}));

export const showToast = (message: string) =>
  useToastStore.getState().show(message);
