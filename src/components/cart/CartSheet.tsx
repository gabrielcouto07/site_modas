"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { formatBRL } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

export function CartSheet() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const isOpen = useUiStore((state) => state.isCartOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent>
        <div className="mt-8 flex h-full flex-col gap-6">
          <div>
            <p className="font-serif text-2xl">Seu carrinho</p>
            <p className="text-sm text-foreground/60">
              {items.length === 0
                ? "Nenhum item por aqui ainda."
                : `${items.length} item(ns) selecionados`}
            </p>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {items.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-border p-8 text-center">
                <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-foreground/40" />
                <p className="text-sm text-foreground/60">Adicione uma peca para continuar.</p>
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
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <strong>{formatBRL(subtotal)}</strong>
            </div>
            <Link href="/checkout">
              <Button className="w-full" onClick={() => setCartOpen(false)}>
                Finalizar compra
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
