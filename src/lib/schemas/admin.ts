import { z } from "zod";
import { addressSchema } from "./address";

export const adminOrderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export type AdminOrderStatus = z.infer<typeof adminOrderStatusSchema>;

const optionalOrderTextField = z.union([z.string(), z.null(), z.undefined()]).transform((value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length ? normalizedValue : null;
});

export const adminOrderStatusOptions = [
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Estornado" },
] as const satisfies ReadonlyArray<{ value: AdminOrderStatus; label: string }>;

export const adminOrderStatusTransitions: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "REFUNDED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export const adminOrderUpdateSchema = z
  .object({
    status: adminOrderStatusSchema,
    paymentStatus: z.string().trim().min(2, "Informe o status do pagamento."),
    shippingService: optionalOrderTextField,
    shippingTrackingCode: optionalOrderTextField,
  })
  .superRefine((data, ctx) => {
    if (data.status === "SHIPPED" && !data.shippingService) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["shippingService"],
        message: "Informe a forma de envio antes de marcar o pedido como enviado.",
      });
    }
  });

export function canTransitionAdminOrderStatus(
  currentStatus: AdminOrderStatus,
  nextStatus: AdminOrderStatus
) {
  return (
    currentStatus === nextStatus || adminOrderStatusTransitions[currentStatus].includes(nextStatus)
  );
}

export function shouldRestockOnAdminOrderStatusChange(
  currentStatus: AdminOrderStatus,
  nextStatus: AdminOrderStatus
) {
  return (
    (currentStatus === "PENDING" && nextStatus === "CANCELLED") ||
    (currentStatus === "PAID" && nextStatus === "REFUNDED")
  );
}

export const adminCustomerAddressSchema = addressSchema.extend({
  id: z.string().optional(),
});

export const adminCustomerUpdateSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).optional().nullable(),
  cpf: z.string().min(11).optional().nullable(),
  addresses: z.array(adminCustomerAddressSchema),
});

export type AdminOrderUpdateInput = z.infer<typeof adminOrderUpdateSchema>;
export type AdminCustomerUpdateInput = z.infer<typeof adminCustomerUpdateSchema>;
export type AdminCustomerUpdateFormInput = z.input<typeof adminCustomerUpdateSchema>;
