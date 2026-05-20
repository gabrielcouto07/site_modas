"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingOption } from "@/types";

type CheckoutDraft = {
  identification?: {
    email: string;
    name: string;
    phone: string;
    cpf: string;
  };
  address?: {
    label: string;
    recipient: string;
    zip: string;
    street: string;
    number: string;
    complement?: string | null;
    district: string;
    city: string;
    state: string;
  };
  shipping?: ShippingOption;
};

type UiState = {
  isCartOpen: boolean;
  theme: "light" | "dark";
  checkoutDraft: CheckoutDraft;
  setCartOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setCheckoutDraft: (draft: Partial<CheckoutDraft>) => void;
  resetCheckoutDraft: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      theme: "light",
      checkoutDraft: {},
      setCartOpen: (open) => set({ isCartOpen: open }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setCheckoutDraft: (draft) =>
        set((state) => ({
          checkoutDraft: {
            ...state.checkoutDraft,
            ...draft,
          },
        })),
      resetCheckoutDraft: () => set({ checkoutDraft: {} }),
    }),
    {
      name: "camila-modas-ui",
    }
  )
);
