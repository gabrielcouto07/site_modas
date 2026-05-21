"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useUiStore } from "@/stores/ui-store";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function FavoritesPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearItems = useWishlistStore((state) => state.clearItems);
  const addItem = useCart().addItem;
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const { toast } = useToast();

  const handleAddToCart = (item: (typeof items)[number]) => {
    if (!item.variant) return;

    addItem({
      productId: item.productId,
      variantId: item.variant.id,
      slug: item.slug,
      name: item.name,
      size: item.variant.size,
      color: item.variant.color,
      colorHex: item.variant.colorHex,
      image: item.image,
      unitPrice: item.price,
      quantity: 1,
      stock: item.variant.stock,
    });
    toast.success("Produto adicionado ao carrinho");
    setCartOpen(true);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] px-6 py-8 shadow-soft lg:px-10">
        <div className="max-w-2xl space-y-4">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-5xl tracking-tight text-foreground">Seus favoritos</h1>
          <p className="text-base leading-7 text-foreground/68">
            Salve peças para comparar depois e retome sua curadoria de look em qualquer momento.
          </p>
        </div>
      </section>

      {items.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">
              {items.length} itens
            </p>
            <Button type="button" variant="outline" size="sm" onClick={clearItems}>
              <Trash2 className="h-4 w-4" />
              Limpar favoritos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.productId}
                className="rounded-[2rem] border border-border/70 bg-white/85 p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-20 overflow-hidden rounded-[1.25rem] bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-foreground/45">
                        {item.category}
                      </p>
                      <h2 className="font-medium text-foreground">{item.name}</h2>
                    </div>
                    <p className="text-sm text-foreground/60">R$ {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/loja/${item.slug}`}>
                      <ShoppingBag className="h-4 w-4" />
                      Ver produto
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.variant}
                  >
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remover
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-border/80 bg-white/70 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-foreground/45">Lista vazia</p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground">
            Comece salvando suas peças favoritas.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-foreground/60">
            Use o botão de favoritar nos cards do catálogo para montar sua seleção temporária.
          </p>
          <Button asChild className="mt-6">
            <Link href="/loja">Explorar catálogo</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
