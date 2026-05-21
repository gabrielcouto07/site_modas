import { Heart, MapPin, Search, User2 } from "lucide-react";
import Link from "next/link";
import { CartSheet } from "@/components/cart/CartSheet";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { HeaderActions } from "./HeaderActions";
import { MobileNav } from "./MobileNav";

const primaryNav = [
  { href: "/loja", label: "Novidades" },
  { href: "/loja?categoria=moda", label: "Moda" },
  { href: "/loja?categoria=basicos", label: "Básicos" },
  { href: "/loja?categoria=jeans", label: "Jeans" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/outlet", label: "Outlet" },
];

export async function Header() {
  const session = await auth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <MobileNav />
            </div>
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                CM
              </span>
              <div className="leading-none">
                <p className="font-serif text-[1.35rem] tracking-tight text-foreground">
                  Camila Modas
                </p>
                <p className="hidden text-[0.65rem] uppercase tracking-[0.3em] text-foreground/50 sm:block">
                  Fashion clean store
                </p>
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-center lg:flex">
              <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-border/70 bg-white px-5 py-3 shadow-sm">
                <Search className="h-4 w-4 text-foreground/45" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/45"
                  placeholder="Buscar vestidos, conjuntos, jeans e acessórios"
                />
                <span className="rounded-full bg-muted px-3 py-1 text-[0.68rem] uppercase tracking-[0.25em] text-foreground/55">
                  Buscar
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-2 text-sm text-foreground/70 xl:flex">
                <MapPin className="h-4 w-4 text-primary" />
                São Paulo, SP
              </div>
              <Link href="/favoritos" className="hidden xl:block">
                <Button variant="ghost" size="sm" aria-label="Favoritos">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <HeaderActions />
              {!session?.user ? (
                <Link href="/checkout/identificacao">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
              ) : null}
              <Link href={session?.user?.role === "ADMIN" ? "/admin" : "/conta"}>
                <Button variant="ghost" size="sm" aria-label="Minha conta">
                  <User2 className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-4 hidden items-center justify-between gap-4 border-t border-border/70 pt-3 lg:flex">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-foreground/72">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 transition hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-sm text-foreground/62">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                Frete grátis acima de R$ 299
              </span>
              <span className="rounded-full border border-border/70 px-3 py-1">
                Pix com desconto
              </span>
            </div>
          </div>
        </div>
      </header>
      <CartSheet />
    </>
  );
}
