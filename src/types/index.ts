export type ShippingOption = {
  service: string;
  carrier: string;
  price: number;
  deliveryDays: number;
  logo?: string;
  isFreeShipping?: boolean;
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  colorHex: string;
  image: string;
  unitPrice: number;
  quantity: number;
  stock: number;
};
