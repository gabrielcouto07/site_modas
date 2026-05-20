import { LRUCache } from "lru-cache";
import { env } from "../env";
import { logger } from "../logger";
import { getFallbackShippingOptions } from "./correios-fallback";
import { buildShippingPackages, type PackageItem } from "./package";

const shippingCache = new LRUCache<string, ReturnType<typeof getFallbackShippingOptions>>({
  max: 200,
  ttl: 1000 * 60 * 60,
});

export async function calculateShippingFromServer(params: {
  zipDestination: string;
  state?: string;
  items: PackageItem[];
  subtotal: number;
}) {
  if (params.subtotal >= env.shippingFreeThreshold) {
    return [
      {
        service: "Frete gratis",
        carrier: "Camila Modas",
        price: 0,
        deliveryDays: 5,
        logo: "/logo-placeholder.svg",
        isFreeShipping: true,
      },
    ];
  }

  const cacheKey = `${params.zipDestination}:${params.items
    .map((item) => `${item.weightGrams}-${item.quantity}`)
    .join("|")}`;
  const cached = shippingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (!env.MELHOR_ENVIO_TOKEN) {
    const fallback = getFallbackShippingOptions(params.state ?? "SP");
    shippingCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const packages = buildShippingPackages(params.items);
    const response = await fetch(
      "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${env.MELHOR_ENVIO_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "Camila Modas",
        },
        body: JSON.stringify({
          from: {
            postal_code: env.SHIPPING_ORIGIN_ZIP,
          },
          to: {
            postal_code: params.zipDestination,
          },
          products: packages.map((entry, index) => ({
            id: String(index + 1),
            width: entry.width,
            height: entry.height,
            length: entry.length,
            weight: entry.weight,
            insurance_value: 200,
          })),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao consultar Melhor Envio");
    }

    const payload = (await response.json()) as Array<Record<string, unknown>>;
    const normalized = payload
      .filter((item) => typeof item["price"] === "string" || typeof item["price"] === "number")
      .map((item) => ({
        service: String(item["name"] ?? "Servico"),
        carrier: String(item["company"]?.toString?.() ?? "Transportadora"),
        price: Number(item["price"] ?? 0),
        deliveryDays: Number(item["delivery_time"] ?? 0),
        logo: typeof item["company"]?.toString === "function" ? "" : "/logo-placeholder.svg",
        isFreeShipping: false,
      }));

    if (normalized.length === 0) {
      throw new Error("Nenhuma opcao de frete retornada");
    }

    shippingCache.set(cacheKey, normalized);
    return normalized;
  } catch (error) {
    logger.warn({ error, zipDestination: params.zipDestination }, "Usando fallback de frete");
    const fallback = getFallbackShippingOptions(params.state ?? "SP");
    shippingCache.set(cacheKey, fallback);
    return fallback;
  }
}
