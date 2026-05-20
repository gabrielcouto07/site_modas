"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useUiStore } from "@/stores/ui-store";

export function HeaderActions() {
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const count = useCart().count;

  return (
    <Button variant="ghost" size="sm" aria-label="Abrir carrinho" onClick={() => setCartOpen(true)}>
      <ShoppingBag className="h-5 w-5" />
      <span className="text-sm">{count}</span>
    </Button>
  );
}
