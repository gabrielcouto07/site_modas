import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="grid gap-8 overflow-hidden rounded-[2.75rem] border border-border/70 bg-[linear-gradient(135deg,#f8f3ed_0%,#f3e8de_45%,#f7f6f4_100%)] p-6 shadow-soft lg:grid-cols-[1.08fr_0.92fr] lg:p-10">
      <div className="space-y-6 lg:py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Nova coleção</Badge>
          <span className="rounded-full border border-border/70 bg-white px-3 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-foreground/55">
            Fashion clean
          </span>
        </div>
        <div className="space-y-5">
          <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
            Moda feminina com presença, leveza e acabamento premium.
          </h1>
          <p className="max-w-xl text-base leading-7 text-foreground/68 sm:text-lg">
            Uma vitrine moderna para a Camila Modas, pensada para converter com catálogo elegante,
            checkout brasileiro e base escalável para venda real.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/loja">
            <Button size="lg">
              Explorar catálogo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/institucional">
            <Button size="lg" variant="outline">
              Conhecer a marca
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: "+120", label: "peças no lançamento" },
            { value: "Pix", label: "desconto imediato" },
            { value: "30 dias", label: "para trocas" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-border/70 bg-white/80 p-4 shadow-sm"
            >
              <p className="text-2xl font-semibold text-foreground">{item.value}</p>
              <p className="mt-1 text-sm text-foreground/60">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-5 shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(194,133,107,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(109,118,85,0.18),transparent_30%)]" />
        <div className="relative flex h-full flex-col justify-between gap-4">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/80 p-4 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-foreground/45">
                Coleção em destaque
              </p>
              <p className="mt-1 font-medium text-foreground">Essenciais sofisticados</p>
            </div>
            <Badge className="bg-success/10 text-success">-20%</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,#efe3d7_0%,#d7c4b0_100%)] p-6 text-foreground shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-foreground/55">
                Look principal
              </p>
              <div className="mt-24 space-y-2">
                <p className="text-3xl font-semibold leading-none">Vestido fluido</p>
                <p className="text-sm text-foreground/70">
                  Caimento elegante para ocasiões especiais.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-border/70 bg-white/85 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">Entrega</p>
                <p className="mt-2 text-lg font-medium">Rápida e rastreável</p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-white/85 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">Pagamento</p>
                <p className="mt-2 text-lg font-medium">Pix, cartão e boleto</p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-white/85 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">Estilo</p>
                <p className="mt-2 text-lg font-medium">Minimalista e feminino</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
