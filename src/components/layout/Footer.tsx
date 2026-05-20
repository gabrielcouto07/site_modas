import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-4 lg:px-6">
        <div className="space-y-3">
          <h3 className="font-serif text-2xl">Camila Modas</h3>
          <p className="text-sm text-foreground/70">{BRAND.description}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]">Loja</p>
          <div className="space-y-2 text-sm text-foreground/70">
            <Link href="/loja">Catalogo</Link>
            <br />
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]">Institucional</p>
          <div className="space-y-2 text-sm text-foreground/70">
            <Link href="/institucional">Sobre a marca</Link>
            <br />
            <Link href="/politicas">Politicas</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]">Atendimento</p>
          <p className="text-sm text-foreground/70">{BRAND.supportEmail}</p>
          <p className="text-sm text-foreground/70">{BRAND.whatsapp}</p>
        </div>
      </div>
    </footer>
  );
}
