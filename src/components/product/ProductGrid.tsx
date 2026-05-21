import type { Product, ProductImage, ProductVariant } from "@prisma/client";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
}: {
  products: Array<
    Product & {
      images: ProductImage[];
      variants: ProductVariant[];
    }
  >;
}) {
  if (!products.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border/80 bg-white/70 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-foreground/45">Sem resultados</p>
        <h3 className="mt-3 font-serif text-3xl tracking-tight text-foreground">
          Ajuste os filtros para descobrir novas peças.
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-foreground/60">
          Não encontramos produtos para esse recorte. Remova filtros, troque a categoria ou volte
          para a seleção principal.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
