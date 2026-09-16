import { create } from "zustand";

type ToastType = "error" | "info" | "success" | "progress";

interface ToastState {
  message: string | null;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "info",
  isVisible: false,
  showToast: (message, type = "info") =>
    set({ message, type, isVisible: true }),
  hideToast: () => set({ isVisible: false }),
}));
