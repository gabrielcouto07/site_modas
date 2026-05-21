"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";

type FavoriteToggleProps = {
  product: {
    id: string;
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
};

export function FavoriteToggle({ product }: FavoriteToggleProps) {
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isFavorite = wishlistItems.some((item) => item.productId === product.id);

  return (
    <Button
      type="button"
      variant={isFavorite ? "default" : "ghost"}
      size="sm"
      className="rounded-full"
      onClick={() =>
        toggleItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          category: product.category,
          variant: product.variant,
        })
      }
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
}
