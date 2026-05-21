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
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65">
            Edite títulos, fotos, preços e estoque de forma simples, com tudo centralizado em um só
            lugar.
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>Novo produto</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground/60">
                    {product.isActive ? "Ativo" : "Oculto"}
                  </span>
                </div>
                <p className="text-sm text-foreground/60">{product.category.name}</p>
                <p className="text-sm text-foreground/55">
                  {product.variants.length} variação(ões)
                </p>
              </div>
              <div className="grid gap-2 text-sm text-foreground/65 sm:grid-cols-2 lg:text-right">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Preço</p>
                  <span className="font-semibold text-foreground">
                    {formatBRL(Number(product.basePrice))}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                    Estoque baixo
                  </p>
                  <span className="font-semibold text-foreground">
                    {product.variants.filter((variant) => variant.stock < 5).length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
