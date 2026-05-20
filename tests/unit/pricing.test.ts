import { describe, expect, it } from "vitest";
import { applyCoupon, calculateOrderTotals, calculateSubtotal } from "@/lib/payments/pricing";

describe("pricing", () => {
  it("calcula subtotal corretamente", () => {
    expect(
      calculateSubtotal([
        { quantity: 2, unitPrice: 100 },
        { quantity: 1, unitPrice: 59.9 },
      ])
    ).toBe(259.9);
  });

  it("aplica cupom percentual", () => {
    expect(applyCoupon({ kind: "PERCENT", value: 10 }, 200)).toBe(20);
  });

  it("aplica cupom fixo", () => {
    expect(applyCoupon({ kind: "FIXED", value: 50 }, 200)).toBe(50);
  });

  it("respeita subtotal minimo do cupom", () => {
    expect(applyCoupon({ kind: "FIXED", value: 50, minSubtotal: 300 }, 200)).toBe(0);
  });

  it("zera frete acima do limite", () => {
    const result = calculateOrderTotals({
      items: [{ quantity: 2, unitPrice: 200 }],
      shippingPrice: 25,
    });
    expect(result.shippingCost).toBe(0);
    expect(result.total).toBe(400);
  });

  it("cobra frete abaixo do limite", () => {
    const result = calculateOrderTotals({
      items: [{ quantity: 1, unitPrice: 120 }],
      shippingPrice: 25,
    });
    expect(result.shippingCost).toBe(25);
    expect(result.total).toBe(145);
  });

  it("aplica cupom de frete gratis", () => {
    const result = calculateOrderTotals({
      items: [{ quantity: 1, unitPrice: 120 }],
      shippingPrice: 25,
      coupon: { kind: "FREE_SHIPPING", value: 0 },
    });
    expect(result.shippingCost).toBe(0);
    expect(result.total).toBe(120);
  });

  it("bloqueia total negativo", () => {
    expect(() =>
      calculateOrderTotals({
        items: [{ quantity: 1, unitPrice: 10 }],
        shippingPrice: 0,
        coupon: { kind: "FIXED", value: 20 },
      })
    ).toThrow("O total do pedido nao pode ser negativo.");
  });
});
