import type { Product, ProductImage, ProductVariant } from "@prisma/client";
import { ProductGrid } from "@/components/product/ProductGrid";

export function FeaturedProducts({
  products,
}: {
  products: Array<
    Product & {
      images: ProductImage[];
      variants: ProductVariant[];
    }
  >;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Destaques</p>
          <h2 className="font-serif text-4xl tracking-tight text-foreground">
            Mais desejados da semana
          </h2>
        </div>
        <p className="hidden max-w-sm text-sm leading-6 text-foreground/60 md:block">
          Seleção inicial com foco em looks de alto apelo visual e leitura clara de preço.
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
