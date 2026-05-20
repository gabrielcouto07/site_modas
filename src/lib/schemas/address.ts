import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(2),
  recipient: z.string().min(3),
  zip: z.string().min(8),
  street: z.string().min(3),
  number: z.string().min(1),
  complement: z.string().optional().nullable(),
  district: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
