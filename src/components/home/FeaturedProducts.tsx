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
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Destaques</p>
        <h2 className="font-serif text-4xl">Mais desejados da semana</h2>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
