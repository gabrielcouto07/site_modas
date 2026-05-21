"use client";

import { Heart, Home, LayoutGrid, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useUiStore } from "@/stores/ui-store";

export function MobileBottomNav() {
  const count = useCart().count;
  const setCartOpen = useUiStore((state) => state.setCartOpen);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 px-4 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 text-center text-[11px] leading-tight text-foreground/70 sm:gap-2 sm:text-xs">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 hover:bg-muted"
        >
          <Home className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          Início
        </Link>
        <Link
          href="/loja"
          className="flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 hover:bg-muted"
        >
          <LayoutGrid className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          Loja
        </Link>
        <Link
          href="/favoritos"
          className="flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 hover:bg-muted"
        >
          <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          Favoritos
        </Link>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center gap-1 rounded-2xl px-1.5 py-2 hover:bg-muted"
        >
          <span className="relative">
            <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            {count > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {count}
              </span>
            ) : null}
          </span>
          Carrinho
        </button>
      </div>
    </nav>
  );
}
