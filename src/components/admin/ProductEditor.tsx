"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormInput } from "@/lib/schemas/product";
import { productSchema } from "@/lib/schemas/product";

export function ProductEditor({
  categories,
  initialData,
  productId,
}: {
  categories: Array<{ id: string; name: string }>;
  initialData?: ProductFormInput;
  productId?: string;
}) {
  const router = useRouter();
  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? {
      name: "",
      slug: "",
      description: "",
      categoryId: categories[0]?.id ?? "",
      basePrice: 0,
      compareAtPrice: null,
      sku: "",
      isActive: true,
      weightGrams: 450,
      widthCm: 25,
      heightCm: 8,
      lengthCm: 35,
      images: [{ url: "/products/placeholder/01.webp", alt: "Placeholder", sortOrder: 1 }],
      variants: [
        {
          size: "M",
          color: "Terracota",
          colorHex: "#c2856b",
          stock: 10,
          sku: "CM-EDIT-M",
        },
      ],
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const method = productId ? "PUT" : "POST";
        const endpoint = productId ? `/api/produtos/${productId}` : "/api/produtos";

        await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        router.push("/admin/produtos");
        router.refresh();
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...form.register("name")} />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descricao</Label>
        <Textarea id="description" {...form.register("description")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...form.register("sku")} />
        </div>
        <div>
          <Label htmlFor="categoryId">Categoria</Label>
          <select
            id="categoryId"
            className="h-11 w-full rounded-2xl border border-border bg-white px-4"
            {...form.register("categoryId")}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="basePrice">Preco</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            {...form.register("basePrice", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="weightGrams">Peso (g)</Label>
          <Input
            id="weightGrams"
            type="number"
            {...form.register("weightGrams", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="widthCm">Largura</Label>
          <Input
            id="widthCm"
            type="number"
            {...form.register("widthCm", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="heightCm">Altura</Label>
          <Input
            id="heightCm"
            type="number"
            {...form.register("heightCm", { valueAsNumber: true })}
          />
        </div>
      </div>
      <Button type="submit">Salvar produto</Button>
    </form>
  );
}
