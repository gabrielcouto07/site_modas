"use client";

import Link from "next/link";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export default function CarrinhoPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Carrinho</p>
          <h1 className="font-serif text-5xl">Revise suas escolhas</h1>
        </div>
        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border p-10 text-center">
            <p className="mb-4 text-foreground/70">Seu carrinho ainda esta vazio.</p>
            <Link href="/loja">
              <Button>Explorar catalogo</Button>
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.variantId}
              item={item}
              onRemove={() => removeItem(item.variantId)}
              onUpdateQuantity={(quantity) => updateQuantity(item.variantId, quantity)}
            />
          ))
        )}
      </div>
      <CartSummary subtotal={subtotal} />
    </div>
  );
}
