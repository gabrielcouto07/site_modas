import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().regex(/^#([a-fA-F0-9]{6})$/),
  stock: z.number().int().nonnegative(),
  sku: z.string().min(3),
});

export const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(30),
  categoryId: z.string().min(1),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  sku: z.string().min(3),
  isActive: z.boolean().default(true),
  weightGrams: z.number().int().positive(),
  widthCm: z.number().int().positive(),
  heightCm: z.number().int().positive(),
  lengthCm: z.number().int().positive(),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().min(3),
        sortOrder: z.number().int().nonnegative(),
      })
    )
    .min(1),
  variants: z.array(productVariantSchema).min(1),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
