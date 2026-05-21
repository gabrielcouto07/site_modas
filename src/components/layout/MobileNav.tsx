"use client";

import { Heart, Menu, Search, ShoppingBag, User2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useUiStore } from "@/stores/ui-store";

const primaryNav = [
  { href: "/loja", label: "Novidades" },
  { href: "/loja?categoria=moda", label: "Moda" },
  { href: "/loja?categoria=basicos", label: "Básicos" },
  { href: "/loja?categoria=jeans", label: "Jeans" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/outlet", label: "Outlet" },
];

export function MobileNav() {
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const count = useCart().count;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-sm bg-background">
        <div className="mt-10 space-y-6">
          <div className="rounded-[1.5rem] border border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-3 text-foreground/60">
              <Search className="h-4 w-4" />
              <span className="text-sm">Buscar produtos</span>
            </div>
          </div>

          <nav className="grid gap-2 text-sm font-medium">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-3 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/institucional" className="rounded-2xl px-3 py-3 hover:bg-muted">
              Institucional
            </Link>
            <Link href="/politicas" className="rounded-2xl px-3 py-3 hover:bg-muted">
              Políticas
            </Link>
          </nav>

          <div className="grid gap-2">
            <Link
              href="/favoritos"
              className="flex items-center gap-3 rounded-2xl border border-border px-3 py-3"
            >
              <Heart className="h-4 w-4" />
              Favoritos
            </Link>
            <Link
              href="/conta"
              className="flex items-center gap-3 rounded-2xl border border-border px-3 py-3"
            >
              <User2 className="h-4 w-4" />
              Minha conta
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex items-center justify-between rounded-2xl border border-border px-3 py-3 text-left"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4" />
                Carrinho
              </span>
              <span className="text-sm text-foreground/60">{count}</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
