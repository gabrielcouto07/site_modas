import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/lib/storefront";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Categorias</p>
        <h1 className="font-serif text-5xl">Organizacao do catalogo</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <p className="font-medium">{category.name}</p>
              <p className="text-sm text-foreground/60">Slug: {category.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
