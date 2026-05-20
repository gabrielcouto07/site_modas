"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";

type CartState = {
  items: CartLine[];
  addItem: (item: CartLine) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  mergeItems: (items: CartLine[]) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((entry) => entry.variantId === item.variantId);
        if (existing) {
          set({
            items: get().items.map((entry) =>
              entry.variantId === item.variantId
                ? {
                    ...entry,
                    quantity: Math.min(entry.quantity + item.quantity, entry.stock),
                  }
                : entry
            ),
          });
          return;
        }

        set({
          items: [...get().items, item],
        });
      },
      removeItem: (variantId) =>
        set({
          items: get().items.filter((entry) => entry.variantId !== variantId),
        }),
      updateQuantity: (variantId, quantity) =>
        set({
          items: get().items.map((entry) =>
            entry.variantId === variantId
              ? {
                  ...entry,
                  quantity: Math.max(1, Math.min(quantity, entry.stock)),
                }
              : entry
          ),
        }),
      clearCart: () => set({ items: [] }),
      mergeItems: (items) =>
        set((state) => ({
          items: [...state.items, ...items].reduce<CartLine[]>((acc, item) => {
            const existing = acc.find((entry) => entry.variantId === item.variantId);
            if (existing) {
              existing.quantity = Math.min(existing.quantity + item.quantity, existing.stock);
            } else {
              acc.push(item);
            }
            return acc;
          }, []),
        })),
    }),
    {
      name: "camila-modas-cart",
    }
  )
);
