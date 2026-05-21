import Link from "next/link";
import { BRAND } from "@/lib/constants";

const columns = [
  {
    title: "Loja",
    links: [
      { href: "/loja", label: "Catálogo" },
      { href: "/checkout", label: "Checkout" },
      { href: "/favoritos", label: "Favoritos" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/institucional", label: "Sobre a marca" },
      { href: "/politicas", label: "Políticas" },
      { href: "/trocas", label: "Trocas e devoluções" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { href: "mailto:oi@camilamodas.com.br", label: BRAND.supportEmail },
      { href: "https://wa.me/5511999999999", label: BRAND.whatsapp },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-6">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
            CM
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-2xl tracking-tight text-foreground">Camila Modas</h3>
            <p className="max-w-sm text-sm leading-6 text-foreground/68">{BRAND.description}</p>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/45">
              {column.title}
            </p>
            <div className="space-y-3 text-sm text-foreground/70">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70 px-4 py-4 text-center text-xs uppercase tracking-[0.24em] text-foreground/45 lg:px-6">
        Moda feminina minimalista com base pronta para escala e operação real.
      </div>
    </footer>
  );
}
