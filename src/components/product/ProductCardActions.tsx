"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useUiStore } from "@/stores/ui-store";
import { useWishlistStore } from "@/stores/wishlist-store";

type ProductCardActionsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    compareAtPrice?: number | null;
    category: string;
    variant: {
      id: string;
      size: string;
      color: string;
      colorHex: string;
      stock: number;
    };
  };
};

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const addItem = useCart().addItem;
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isFavorite = wishlistItems.some((item) => item.productId === product.id);
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={isFavorite ? "default" : "outline"}
        size="sm"
        className="flex-1"
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
      >
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        Favoritar
      </Button>
      <Button
        type="button"
        size="sm"
        className="flex-1"
        onClick={() => {
          addItem({
            productId: product.id,
            variantId: product.variant.id,
            slug: product.slug,
            name: product.name,
            size: product.variant.size,
            color: product.variant.color,
            colorHex: product.variant.colorHex,
            image: product.image,
            unitPrice: product.price,
            quantity: 1,
            stock: product.variant.stock,
          });
          toast.success("Produto adicionado ao carrinho");
          setCartOpen(true);
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        Adicionar
      </Button>
    </div>
  );
}
