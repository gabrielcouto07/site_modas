import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/cart-store";

const item = {
  productId: "prod_1",
  variantId: "var_1",
  slug: "vestido-midi",
  name: "Vestido Midi",
  size: "M",
  color: "Terracota",
  colorHex: "#c2856b",
  image: "/products/placeholder/01.webp",
  unitPrice: 100,
  quantity: 1,
  stock: 5,
};

describe("cart-store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adiciona item", () => {
    useCartStore.getState().addItem(item);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("mescla variantes iguais", () => {
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);
    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
  });

  it("remove item", () => {
    useCartStore.getState().addItem(item);
    useCartStore.getState().removeItem(item.variantId);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("altera quantidade", () => {
    useCartStore.getState().addItem(item);
    useCartStore.getState().updateQuantity(item.variantId, 3);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
  });

  it("limpa carrinho", () => {
    useCartStore.getState().addItem(item);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
