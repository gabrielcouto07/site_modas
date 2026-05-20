import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCatalogProducts, getCategories } from "@/lib/storefront";

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getCatalogProducts({
      category: params.categoria,
      query: params.busca,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Catalogo</p>
        <h1 className="font-serif text-5xl">Escolha a peca certa para o seu ritmo.</h1>
      </div>
      <ProductFilters categories={categories} currentCategory={params.categoria} />
      <ProductGrid products={products} />
    </div>
  );
}
