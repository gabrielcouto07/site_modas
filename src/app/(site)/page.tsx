import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { ValueProps } from "@/components/home/ValueProps";
import { getCategories, getFeaturedProducts } from "@/lib/storefront";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <div className="space-y-12">
      <Hero />
      <CategoriesGrid categories={categories} />
      <FeaturedProducts products={products} />
      <ValueProps />
      <NewsletterCta />
    </div>
  );
}
