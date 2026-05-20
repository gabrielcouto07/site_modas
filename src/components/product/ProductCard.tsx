import type { Product, ProductImage, ProductVariant } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";

type ProductCardProps = {
  product: Product & {
    images: ProductImage[];
    variants: ProductVariant[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]?.url ?? "/products/placeholder/01.webp";

  return (
    <Link href={`/loja/${product.slug}`} className="group block">
      <div className="space-y-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
          <Image
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {product.compareAtPrice ? <Badge className="absolute left-4 top-4">Novo</Badge> : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-foreground/60">{product.variants[0]?.color}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatBRL(Number(product.basePrice))}</p>
              {product.compareAtPrice ? (
                <p className="text-sm text-foreground/45 line-through">
                  {formatBRL(Number(product.compareAtPrice))}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
