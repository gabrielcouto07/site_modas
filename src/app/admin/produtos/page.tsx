import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminProducts } from "@/lib/storefront";
import { formatBRL } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Catalogo</p>
          <h1 className="font-serif text-5xl">Produtos</h1>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>Novo produto</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-foreground/60">{product.category.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span>{formatBRL(Number(product.basePrice))}</span>
                <Link href={`/admin/produtos/${product.id}`}>
                  <Button variant="outline">Editar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
