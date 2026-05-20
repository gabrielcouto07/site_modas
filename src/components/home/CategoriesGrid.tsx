import type { Category } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Categorias</p>
          <h2 className="font-serif text-4xl">Escolha seu mood</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category, index) => (
          <Link key={category.id} href={`/loja?categoria=${category.slug}`}>
            <Card className="h-full overflow-hidden">
              <CardContent className="relative min-h-56 p-6">
                <div className="absolute inset-0 bg-[linear-gradient(140deg,#c2856b20,transparent_60%)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="text-sm text-foreground/60">0{index + 1}</span>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-3xl">{category.name}</h3>
                    <ChevronRight className="h-5 w-5" />
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
