import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="grid gap-8 rounded-[2.5rem] bg-[linear-gradient(135deg,#f7efe8_0%,#f2e1d6_55%,#efe9e3_100%)] p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
      <div className="space-y-6">
        <Badge>Nova colecao</Badge>
        <div className="space-y-4">
          <h1 className="max-w-2xl font-serif text-5xl leading-none sm:text-6xl">
            Silhuetas leves para vestir o dia com presenca.
          </h1>
          <p className="max-w-xl text-base text-foreground/70">
            Um scaffold elegante para sua marca crescer com catalogo, checkout brasileiro e base
            pronta para producao.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/loja">
            <Button size="lg">
              Comprar agora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/institucional">
            <Button size="lg" variant="outline">
              Conhecer a marca
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative min-h-80 overflow-hidden rounded-[2rem] bg-white/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#c2856b33,transparent_55%),linear-gradient(180deg,transparent_0%,#ffffff80_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 grid gap-4 p-6 sm:grid-cols-3">
          {["Caimento impecavel", "Troca simples", "Checkout BR"].map((item) => (
            <div key={item} className="rounded-[1.5rem] bg-white/70 p-4 backdrop-blur">
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
