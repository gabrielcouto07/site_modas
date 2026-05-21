"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  variant?: {
    id: string;
    size: string;
    color: string;
    colorHex: string;
    stock: number;
  };
};

type WishlistState = {
  items: WishlistItem[];
  hasItem: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hasItem: (productId) => get().items.some((item) => item.productId === productId),
      toggleItem: (item) => {
        if (get().hasItem(item.productId)) {
          set({ items: get().items.filter((entry) => entry.productId !== item.productId) });
          return;
        }

        set({ items: [item, ...get().items] });
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.productId !== productId) }),
      clearItems: () => set({ items: [] }),
    }),
    {
      name: "camila-modas-wishlist",
    }
  )
);
