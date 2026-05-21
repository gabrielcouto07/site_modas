import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { ValueProps } from "@/components/home/ValueProps";
import { getCategories, getFeaturedProducts } from "@/lib/storefront";

export default async function HomePage() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories(),
    getFeaturedProducts(),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products = productsResult.status === "fulfilled" ? productsResult.value : [];
  const storefrontUnavailable =
    categoriesResult.status === "rejected" || productsResult.status === "rejected";

  return (
    <div className="space-y-12">
      {storefrontUnavailable ? (
        <section className="rounded-3xl border border-foreground/10 bg-foreground/5 px-6 py-4 text-sm text-foreground/70">
          O banco de dados local ainda não está disponível. A vitrine está em modo
          demonstrativo até a conexão voltar.
        </section>
      ) : null}
      <Hero />
      <CategoriesGrid categories={categories} />
      <FeaturedProducts products={products} />
      <ValueProps />
      <NewsletterCta />
    </div>
  );
}
