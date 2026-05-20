import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/storefront";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Editar produto</p>
        <h1 className="font-serif text-5xl">{product.name}</h1>
      </div>
      <ProductEditor
        productId={product.id}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        initialData={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId,
          basePrice: Number(product.basePrice),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          sku: product.sku,
          isActive: product.isActive,
          weightGrams: product.weightGrams,
          widthCm: product.widthCm,
          heightCm: product.heightCm,
          lengthCm: product.lengthCm,
          images: product.images.map((image) => ({
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder,
          })),
          variants: product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex,
            stock: variant.stock,
            sku: variant.sku,
          })),
        }}
      />
    </div>
  );
}
