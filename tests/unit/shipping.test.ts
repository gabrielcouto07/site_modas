import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFallbackShippingOptions } from "@/lib/shipping/correios-fallback";
import { buildShippingPackages } from "@/lib/shipping/package";

describe("shipping", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("retorna fallback para sudeste", () => {
    const options = getFallbackShippingOptions("SP");
    expect(options).toHaveLength(2);
    expect(options[0]?.carrier).toBe("Correios");
  });

  it("cria frete gratis acima do limite", async () => {
    process.env["DATABASE_URL"] =
      "postgresql://camila:camila@localhost:5432/camila_modas?schema=public";
    process.env["NEXTAUTH_URL"] = "http://localhost:3000";
    process.env["NEXTAUTH_SECRET"] = "camila-modas-dev-secret";
    process.env["AUTH_TRUST_HOST"] = "true";
    process.env["MP_ACCESS_TOKEN"] = "TEST-token";
    process.env["MP_PUBLIC_KEY"] = "TEST-key";
    process.env["MP_WEBHOOK_SECRET"] = "secret";
    process.env["MP_SANDBOX_MODE"] = "true";
    process.env["MELHOR_ENVIO_SANDBOX"] = "true";
    process.env["MELHOR_ENVIO_TOKEN"] = "";
    process.env["SHIPPING_ORIGIN_ZIP"] = "01310-100";
    process.env["SHIPPING_FREE_THRESHOLD"] = "299";
    process.env["RESEND_API_KEY"] = "re_placeholder";
    process.env["RESEND_FROM_EMAIL"] = "Camila Modas <pedidos@camilamodas.com.br>";
    process.env["ADMIN_EMAIL"] = "admin@camilamodas.com.br";
    process.env["ADMIN_PASSWORD"] = "admin123";
    process.env["NEXT_PUBLIC_APP_URL"] = "http://localhost:3000";

    const { calculateShippingFromServer } = await import("@/lib/shipping/melhor-envio");
    const result = await calculateShippingFromServer({
      zipDestination: "01310-100",
      subtotal: 350,
      state: "SP",
      items: [{ quantity: 1, weightGrams: 400, widthCm: 20, heightCm: 8, lengthCm: 30 }],
    });

    expect(result[0]?.price).toBe(0);
    expect(result[0]?.isFreeShipping).toBe(true);
  });

  it("quebra volumes quando excede o limite", () => {
    const packages = buildShippingPackages([
      { quantity: 8, weightGrams: 500, widthCm: 30, heightCm: 20, lengthCm: 30 },
    ]);
    expect(packages.length).toBeGreaterThan(1);
  });
});
