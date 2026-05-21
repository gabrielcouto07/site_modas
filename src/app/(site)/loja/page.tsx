import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCatalogProducts, getCategories } from "@/lib/storefront";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    color?: string;
    size?: string;
    busca?: string;
    sort?: string;
    priceBand?: string;
    promo?: string;
  }>;
}) {
  const params = await searchParams;
  const priceBand =
    params.priceBand === "ate-150"
      ? { minPrice: undefined, maxPrice: 150 }
      : params.priceBand === "150-250"
        ? { minPrice: 150, maxPrice: 250 }
        : params.priceBand === "250-plus"
          ? { minPrice: 250, maxPrice: undefined }
          : {};
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories(),
    getCatalogProducts({
      category: params.categoria,
      query: params.busca,
      color: params.color,
      size: params.size,
      sort: params.sort === "price-asc" || params.sort === "price-desc" ? params.sort : "newest",
      ...priceBand,
    }),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products = productsResult.status === "fulfilled" ? productsResult.value : [];

  const filteredProducts =
    params.promo === "1" ? products.filter((product) => Boolean(product.compareAtPrice)) : products;

  const activeFilters =
    [params.categoria, params.color, params.size, params.priceBand, params.sort].filter(Boolean)
      .length +
    (params.promo === "1" ? 1 : 0) +
    (params.busca ? 1 : 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[2.5rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_50%,#f8f7f5_100%)] px-6 py-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="space-y-4">
          <Badge>Catálogo</Badge>
          <h1 className="font-serif text-5xl tracking-tight text-foreground">
            Escolha a peça certa para o seu ritmo.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/68">
            Navegue por vestidos, blusas e calças com filtros rápidos, ordenação clara e uma vitrine
            pensada para compra mobile-first.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: products.length, label: "peças exibidas" },
            { value: categories.length, label: "categorias ativas" },
            { value: activeFilters, label: "filtros aplicados" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-border/70 bg-white/80 p-4"
            >
              <p className="text-2xl font-semibold text-foreground">{item.value}</p>
              <p className="mt-1 text-sm text-foreground/60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ProductFilters
        categories={categories}
        search={params.busca}
        currentCategory={params.categoria}
        currentColor={params.color}
        currentSize={params.size}
        currentSort={params.sort}
        currentPriceBand={params.priceBand}
        promoOnly={params.promo === "1"}
      />

      <Separator />

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
