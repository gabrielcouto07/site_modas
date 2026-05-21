import type { Category, Product, ProductImage, ProductVariant } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { FavoriteToggle } from "./FavoriteToggle";
import { ProductCardActions } from "./ProductCardActions";

type ProductCardProps = {
  product: Product & {
    category: Category;
    images: ProductImage[];
    variants: ProductVariant[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]?.url ?? "/products/placeholder/01.webp";
  const hoverImage = product.images[1]?.url ?? image;
  const firstVariant = product.variants[0];

  return (
    <article className="group flex h-full flex-col gap-4 rounded-[2.25rem] border border-border/70 bg-white/85 p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-muted">
        <Link
          href={`/loja/${product.slug}`}
          className="absolute inset-0 z-[1]"
          aria-label={product.name}
        />
        <Image
          src={image}
          alt={product.images[0]?.alt ?? product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0"
        />
        <Image
          src={hoverImage}
          alt={product.images[1]?.alt ?? product.images[0]?.alt ?? product.name}
          fill
          className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4">
          <div className="space-y-1">
            {product.compareAtPrice ? <Badge>Promo</Badge> : null}
            {firstVariant ? (
              <p className="text-xs uppercase tracking-[0.22em] text-white/80">
                {firstVariant.color} · {firstVariant.size}
              </p>
            ) : null}
          </div>
          <div className="relative z-20">
            <FavoriteToggle
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image,
                price: Number(product.basePrice),
                compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                category: product.category.name,
                variant: firstVariant
                  ? {
                      id: firstVariant.id,
                      size: firstVariant.size,
                      color: firstVariant.color,
                      colorHex: firstVariant.colorHex,
                      stock: firstVariant.stock,
                    }
                  : undefined,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-2">
        <Link href={`/loja/${product.slug}`} className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-foreground">{product.name}</h3>
              <p className="text-sm text-foreground/60">{product.category.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {formatBRL(Number(product.basePrice))}
              </p>
              {product.compareAtPrice ? (
                <p className="text-sm text-foreground/45 line-through">
                  {formatBRL(Number(product.compareAtPrice))}
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-sm text-foreground/60">
            Até 6x sem juros. Entrega calculada no checkout.
          </p>
        </Link>

        {firstVariant ? (
          <ProductCardActions
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.basePrice),
              image,
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
              category: product.category.name,
              variant: {
                id: firstVariant.id,
                size: firstVariant.size,
                color: firstVariant.color,
                colorHex: firstVariant.colorHex,
                stock: firstVariant.stock,
              },
            }}
          />
        ) : null}
      </div>
    </article>
  );
}
