import { Search, ShoppingBag, SunMoon, User2 } from "lucide-react";
import Link from "next/link";
import { CartSheet } from "@/components/cart/CartSheet";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { HeaderActions } from "./HeaderActions";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const session = await auth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <MobileNav />
            </div>
            <Link href="/" className="font-serif text-2xl tracking-tight">
              Camila Modas
            </Link>
          </div>
          <nav className="hidden items-center gap-6 text-sm lg:flex">
            <Link href="/loja">Loja</Link>
            <Link href="/institucional">Institucional</Link>
            <Link href="/politicas">Politicas</Link>
          </nav>
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
              <Search className="h-4 w-4 text-foreground/50" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/50"
                placeholder="Buscar vestidos, blusas e mais"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HeaderActions />
            <Link href={session?.user?.role === "ADMIN" ? "/admin" : "/conta"}>
              <Button variant="ghost" size="sm" aria-label="Minha conta">
                <User2 className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" aria-label="Alternar tema">
              <SunMoon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Abrir carrinho">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <CartSheet />
    </>
  );
}
