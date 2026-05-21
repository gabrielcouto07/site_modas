import { describe, expect, it } from "vitest";
import { productSchema } from "@/lib/schemas/product";

const validProduct = {
  name: "Vestido midi canelado",
  slug: "vestido-midi-canelado",
  description:
    "Vestido midi canelado com caimento leve, toque macio e acabamento pensado para uso diario.",
  categoryId: "categoria-1",
  basePrice: 189.9,
  compareAtPrice: 229.9,
  sku: "CM-100",
  isActive: true,
  weightGrams: 450,
  widthCm: 25,
  heightCm: 8,
  lengthCm: 35,
  images: [{ url: "/products/vestido-01.webp", alt: "Vestido midi canelado", sortOrder: 1 }],
  variants: [
    {
      size: "M",
      color: "Terracota",
      colorHex: "#c2856b",
      stock: 10,
      sku: "CM-100-M-TRC",
    },
  ],
};

describe("productSchema", () => {
  it("aceita produto valido com preco de antes maior que o preco atual", () => {
    const parsed = productSchema.safeParse(validProduct);

    expect(parsed.success).toBe(true);
  });

  it("bloqueia preco de antes menor ou igual ao preco atual", () => {
    const parsed = productSchema.safeParse({
      ...validProduct,
      compareAtPrice: 179.9,
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.message).toContain("preco de antes");
  });

  it("bloqueia variacoes duplicadas", () => {
    const parsed = productSchema.safeParse({
      ...validProduct,
      variants: [
        validProduct.variants[0],
        {
          ...validProduct.variants[0],
          sku: "CM-100-M-TRC-2",
        },
      ],
    });

    expect(parsed.success).toBe(false);
    expect(
      parsed.error?.issues.some((issue) => issue.message.includes("Ja existe uma variacao"))
    ).toBe(true);
  });
});
