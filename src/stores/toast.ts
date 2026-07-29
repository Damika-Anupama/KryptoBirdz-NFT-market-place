import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  clear: () => void;
}

let timer: number | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => {
    set({ message });
    window.clearTimeout(timer);
    timer = window.setTimeout(() => set({ message: null }), 2600);
  },
  clear: () => {
    window.clearTimeout(timer);
    set({ message: null });
  },
}));

export const useToastMessage = () => useToastStore((s) => s.message);
export const showToast = (message: string) =>
  useToastStore.getState().show(message);
