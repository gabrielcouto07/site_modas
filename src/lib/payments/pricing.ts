import { SHIPPING_FREE_THRESHOLD } from "../constants";

export type CouponInput =
  | {
      kind: "PERCENT" | "FIXED" | "FREE_SHIPPING";
      value: number;
      minSubtotal?: number | null;
      isActive?: boolean;
    }
  | null
  | undefined;

export type PricingInput = {
  items: Array<{
    quantity: number;
    unitPrice: number;
  }>;
  shippingPrice: number;
  coupon?: CouponInput;
  freeShippingThreshold?: number;
};

export function calculateSubtotal(items: PricingInput["items"]) {
  return Number(
    items.reduce((total, item) => total + item.quantity * item.unitPrice, 0).toFixed(2)
  );
}

export function applyCoupon(coupon: CouponInput, subtotal: number) {
  if (!coupon || coupon.isActive === false) {
    return 0;
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return 0;
  }

  if (coupon.kind === "PERCENT") {
    return Number((subtotal * (coupon.value / 100)).toFixed(2));
  }

  if (coupon.kind === "FIXED") {
    return Number(coupon.value.toFixed(2));
  }

  return 0;
}

export function calculateOrderTotals(input: PricingInput) {
  const subtotal = calculateSubtotal(input.items);
  const discount = applyCoupon(input.coupon, subtotal);
  const freeThreshold = input.freeShippingThreshold ?? SHIPPING_FREE_THRESHOLD;
  const freeShippingFromSubtotal = subtotal - discount >= freeThreshold;
  const shippingCost =
    freeShippingFromSubtotal || input.coupon?.kind === "FREE_SHIPPING" ? 0 : input.shippingPrice;
  const total = Number((subtotal - discount + shippingCost).toFixed(2));

  if (total < 0) {
    throw new Error("O total do pedido nao pode ser negativo.");
  }

  return {
    subtotal,
    discount,
    shippingCost,
    total,
  };
}
