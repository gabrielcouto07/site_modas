import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/storefront";
import { formatBRL } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <ProductGallery images={product.images} fallbackAlt={product.name} />
      <div className="space-y-6">
        <Badge>{product.category.name}</Badge>
        <div className="space-y-2">
          <h1 className="font-serif text-5xl">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatBRL(Number(product.basePrice))}</p>
        </div>
        <p className="whitespace-pre-line text-foreground/70">{product.description}</p>
        <ProductPurchasePanel
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: Number(product.basePrice),
            image: product.images[0]?.url ?? "/products/placeholder/01.webp",
            variants: product.variants.map((variant) => ({
              id: variant.id,
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              stock: variant.stock,
            })),
          }}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: Number(product.basePrice),
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </div>
    </div>
  );
}
