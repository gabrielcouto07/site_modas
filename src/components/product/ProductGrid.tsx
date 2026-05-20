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
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
