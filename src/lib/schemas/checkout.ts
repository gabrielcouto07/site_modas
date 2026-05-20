import { z } from "zod";
import { addressSchema } from "./address";

export const checkoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  name: z.string(),
  size: z.string(),
  color: z.string(),
  image: z.string(),
});

export const shippingOptionSchema = z.object({
  service: z.string(),
  carrier: z.string(),
  price: z.number().nonnegative(),
  deliveryDays: z.number().int().nonnegative(),
  logo: z.string().optional(),
  isFreeShipping: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  phone: z.string().min(10),
  cpf: z.string().min(11),
  items: z.array(checkoutItemSchema).min(1),
  address: addressSchema.extend({
    zipDestination: z.string().optional(),
  }),
  selectedShipping: shippingOptionSchema,
  paymentMethod: z.enum(["PIX", "CARD", "BOLETO"]),
  couponCode: z.string().optional().nullable(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
