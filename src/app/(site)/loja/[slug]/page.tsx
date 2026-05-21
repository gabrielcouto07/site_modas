import { ArrowLeft, CheckCircle2, Truck, Undo2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCatalogProducts, getProductBySlug } from "@/lib/storefront";
import { formatBRL } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getCatalogProducts({
    category: product.category.slug,
    sort: "newest",
  });

  const recommendations = relatedProducts.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/loja">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
        </Button>
        <Badge>{product.category.name}</Badge>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <ProductGallery images={product.images} fallbackAlt={product.name} />
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-5xl tracking-tight text-foreground">{product.name}</h1>
            <p className="text-2xl font-semibold text-foreground">
              {formatBRL(Number(product.basePrice))}
            </p>
            {product.compareAtPrice ? (
              <p className="text-sm text-foreground/45 line-through">
                {formatBRL(Number(product.compareAtPrice))}
              </p>
            ) : null}
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
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Truck,
            title: "Frete calculado no checkout",
            description:
              "Simule o envio com Melhor Envio ou fallback regional enquanto a integração não entra.",
          },
          {
            icon: Undo2,
            title: "Trocas simples",
            description:
              "Processo pensado para devolução e troca em até 30 dias para a operação da loja.",
          },
          {
            icon: CheckCircle2,
            title: "Pagamento preparado",
            description: "Estrutura pronta para Pix, cartão e boleto via Mercado Pago.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm"
          >
            <item.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-medium text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/68">{item.description}</p>
          </div>
        ))}
      </section>

      <Separator />

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Descrição rápida</p>
          <p className="text-sm leading-6 text-foreground/68">
            Peça pensada para composição versátil, com acabamento limpo e leitura fácil de styling.
            Estrutura suficiente para uso diário e visual premium para campanha.
          </p>
          <div className="space-y-2 text-sm text-foreground/68">
            <p>• Tamanhos P ao G, dependendo da grade do produto.</p>
            <p>• Variações de cor com leitura clara no carrinho e no checkout.</p>
            <p>• Imagens otimizadas para catálogo e mobile-first.</p>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Avaliações</p>
          <div className="space-y-4">
            {[
              {
                name: "Mariana",
                quote: "Caimento bonito e tecido confortável. Entrega bem rápida.",
              },
              {
                name: "Juliana",
                quote: "Visual elegante e fácil de combinar com acessórios neutros.",
              },
              {
                name: "Paula",
                quote: "O acabamento veio exatamente como esperava para um look premium.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="rounded-[1.5rem] border border-border/70 bg-background px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">{review.name}</p>
                <p className="mt-1 text-sm leading-6 text-foreground/65">{review.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Relacionados</p>
            <h2 className="font-serif text-4xl tracking-tight text-foreground">
              Continue explorando o catálogo
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/loja">Ver tudo</Link>
          </Button>
        </div>
        <ProductGrid products={recommendations} />
      </section>

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
  );
}
