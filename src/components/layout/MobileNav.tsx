"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-xs">
        <div className="mt-10 flex flex-col gap-4">
          <Link href="/">Inicio</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/institucional">Institucional</Link>
          <Link href="/politicas">Politicas</Link>
          <Link href="/conta">Minha conta</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
