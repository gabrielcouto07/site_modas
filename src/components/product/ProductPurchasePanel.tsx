"use client";

import { useMemo, useState } from "react";
import { ColorSelector } from "@/components/product/ColorSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useUiStore } from "@/stores/ui-store";
import type { CartLine } from "@/types";

type Variant = {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
};

export function ProductPurchasePanel({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    variants: Variant[];
  };
}) {
  const firstVariant = product.variants[0];
  const [size, setSize] = useState(firstVariant?.size ?? "");
  const [color, setColor] = useState(firstVariant?.color ?? "");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart().addItem;
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const { toast } = useToast();

  const currentVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.size === size && variant.color === color) ??
      firstVariant,
    [color, firstVariant, product.variants, size]
  );

  const sizes = [...new Set(product.variants.map((variant) => variant.size))];
  const colors = [
    ...new Map(
      product.variants.map((variant) => [
        variant.color,
        { label: variant.color, hex: variant.colorHex },
      ])
    ).values(),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
            Selecione o tamanho
          </p>
          <SizeSelector options={sizes} value={size} onChange={setSize} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Selecione a cor</p>
          <ColorSelector options={colors} value={color} onChange={setColor} />
        </div>
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-foreground/60">Quantidade</p>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
        </div>
      </div>
      <Button
        className="w-full"
        disabled={!currentVariant}
        onClick={() => {
          if (!currentVariant) return;
          const item: CartLine = {
            productId: product.id,
            variantId: currentVariant.id,
            slug: product.slug,
            name: product.name,
            size: currentVariant.size,
            color: currentVariant.color,
            colorHex: currentVariant.colorHex,
            image: product.image,
            unitPrice: product.price,
            quantity,
            stock: currentVariant.stock,
          };
          addItem(item);
          toast.success("Produto adicionado ao carrinho");
          setCartOpen(true);
        }}
      >
        Adicionar ao carrinho
      </Button>
    </div>
  );
}
