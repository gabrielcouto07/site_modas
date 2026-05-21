import type { Category } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Categorias</p>
          <h2 className="font-serif text-4xl tracking-tight text-foreground">Explore por estilo</h2>
        </div>
        <p className="hidden max-w-sm text-sm leading-6 text-foreground/60 md:block">
          Organização visual para destacar peças, coleções e famílias de produto sem poluir a
          interface.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category, index) => (
          <Link key={category.id} href={`/loja?categoria=${category.slug}`}>
            <Card className="group h-full overflow-hidden border-border/70 bg-white/85 transition duration-300 hover:-translate-y-1 hover:shadow-soft">
              <CardContent className="relative min-h-56 p-6">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(194,133,107,0.16),transparent_62%)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="text-sm text-foreground/45">0{index + 1}</span>
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl tracking-tight text-foreground">
                        {category.name}
                      </h3>
                      <p className="max-w-52 text-sm text-foreground/60">
                        Descubra peças selecionadas para composições modernas e versáteis.
                      </p>
                    </div>
                    <span className="rounded-full border border-border bg-white p-3 transition group-hover:translate-x-1">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
