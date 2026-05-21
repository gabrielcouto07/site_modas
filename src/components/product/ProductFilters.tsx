import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_COLORS, PRODUCT_SIZES } from "@/lib/constants";

type FilterValue = string | undefined;

function buildHref(base: string, params: Record<string, FilterValue>) {
  const url = new URL(base, "http://localhost:3000");

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return `${url.pathname}${url.search}`;
}

export function ProductFilters({
  categories,
  search,
  currentCategory,
  currentColor,
  currentSize,
  currentSort,
  currentPriceBand,
  promoOnly,
}: {
  categories: Array<{ slug: string; name: string }>;
  search?: string;
  currentCategory?: string;
  currentColor?: string;
  currentSize?: string;
  currentSort?: string;
  currentPriceBand?: string;
  promoOnly?: boolean;
}) {
  const filtersHref = {
    categoria: currentCategory,
    color: currentColor,
    size: currentSize,
    sort: currentSort,
    priceBand: currentPriceBand,
    promo: promoOnly ? "1" : undefined,
    busca: search,
  };

  return (
    <div className="space-y-5 rounded-[2rem] border border-border/70 bg-white/80 p-5 shadow-sm">
      <form action="/loja" method="get" className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_auto]">
        {currentCategory ? <input type="hidden" name="categoria" value={currentCategory} /> : null}
        {currentColor ? <input type="hidden" name="color" value={currentColor} /> : null}
        {currentSize ? <input type="hidden" name="size" value={currentSize} /> : null}
        {currentPriceBand ? (
          <input type="hidden" name="priceBand" value={currentPriceBand} />
        ) : null}
        {promoOnly ? <input type="hidden" name="promo" value="1" /> : null}

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Buscar</p>
          <Input defaultValue={search} name="busca" placeholder="Vestidos, blusas, jeans e mais" />
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Ordenação</p>
          <select
            name="sort"
            defaultValue={currentSort ?? "newest"}
            className="flex h-11 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm text-foreground outline-none"
          >
            <option value="newest">Mais recentes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full">
            Aplicar
          </Button>
        </div>
      </form>

      <Separator />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Categorias</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("/loja", { ...filtersHref, categoria: undefined })}>
              <Button variant={currentCategory ? "outline" : "default"}>Todas</Button>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={buildHref("/loja", { ...filtersHref, categoria: category.slug })}
              >
                <Button variant={currentCategory === category.slug ? "default" : "outline"}>
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Promoções</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("/loja", { ...filtersHref, promo: undefined })}>
              <Button variant={promoOnly ? "outline" : "default"}>Todas</Button>
            </Link>
            <Link href={buildHref("/loja", { ...filtersHref, promo: "1" })}>
              <Button variant={promoOnly ? "default" : "outline"}>Somente promoções</Button>
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Cor</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("/loja", { ...filtersHref, color: undefined })}>
              <Button variant={currentColor ? "outline" : "default"}>Todas</Button>
            </Link>
            {PRODUCT_COLORS.map((color) => (
              <Link
                key={color.name}
                href={buildHref("/loja", { ...filtersHref, color: color.name })}
              >
                <Button variant={currentColor === color.name ? "default" : "outline"}>
                  {color.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("/loja", { ...filtersHref, size: undefined })}>
              <Button variant={currentSize ? "outline" : "default"}>Todos</Button>
            </Link>
            {PRODUCT_SIZES.map((size) => (
              <Link key={size} href={buildHref("/loja", { ...filtersHref, size })}>
                <Button variant={currentSize === size ? "default" : "outline"}>{size}</Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Faixa de preço</p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildHref("/loja", { ...filtersHref, priceBand: undefined })}>
              <Button variant={currentPriceBand ? "outline" : "default"}>Todas</Button>
            </Link>
            <Link href={buildHref("/loja", { ...filtersHref, priceBand: "ate-150" })}>
              <Button variant={currentPriceBand === "ate-150" ? "default" : "outline"}>
                Até R$ 150
              </Button>
            </Link>
            <Link href={buildHref("/loja", { ...filtersHref, priceBand: "150-250" })}>
              <Button variant={currentPriceBand === "150-250" ? "default" : "outline"}>
                R$ 150 - R$ 250
              </Button>
            </Link>
            <Link href={buildHref("/loja", { ...filtersHref, priceBand: "250-plus" })}>
              <Button variant={currentPriceBand === "250-plus" ? "default" : "outline"}>
                Acima de R$ 250
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
