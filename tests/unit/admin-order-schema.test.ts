import { describe, expect, it } from "vitest";
import {
  adminOrderUpdateSchema,
  canTransitionAdminOrderStatus,
  shouldRestockOnAdminOrderStatusChange,
} from "@/lib/schemas/admin";

describe("admin order workflow", () => {
  it("permite transicoes previstas do fluxo", () => {
    expect(canTransitionAdminOrderStatus("PENDING", "PAID")).toBe(true);
    expect(canTransitionAdminOrderStatus("PAID", "SHIPPED")).toBe(true);
    expect(canTransitionAdminOrderStatus("SHIPPED", "DELIVERED")).toBe(true);
  });

  it("bloqueia transicoes invalidas", () => {
    expect(canTransitionAdminOrderStatus("PENDING", "DELIVERED")).toBe(false);
    expect(canTransitionAdminOrderStatus("CANCELLED", "PAID")).toBe(false);
  });

  it("exige forma de envio ao marcar pedido como enviado", () => {
    const parsed = adminOrderUpdateSchema.safeParse({
      status: "SHIPPED",
      paymentStatus: "approved",
      shippingService: null,
      shippingTrackingCode: null,
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.message).toContain("forma de envio");
  });

  it("restoca somente nos cenarios previstos", () => {
    expect(shouldRestockOnAdminOrderStatusChange("PENDING", "CANCELLED")).toBe(true);
    expect(shouldRestockOnAdminOrderStatusChange("PAID", "REFUNDED")).toBe(true);
    expect(shouldRestockOnAdminOrderStatusChange("SHIPPED", "REFUNDED")).toBe(false);
  });
});
