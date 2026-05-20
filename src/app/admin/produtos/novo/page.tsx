import { ProductEditor } from "@/components/admin/ProductEditor";
import { getCategories } from "@/lib/storefront";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Novo produto</p>
        <h1 className="font-serif text-5xl">Cadastrar produto</h1>
      </div>
      <ProductEditor
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      />
    </div>
  );
}
