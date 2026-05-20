import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitByIp } from "@/lib/rate-limit";
import { calculateShippingFromServer } from "@/lib/shipping/melhor-envio";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rateLimit = rateLimitByIp(`frete:${ip}`);
  if (!rateLimit.success) {
    return NextResponse.json({ message: "Muitas requisicoes." }, { status: 429 });
  }

  const body = (await request.json()) as {
    zipDestination: string;
    items: Array<{ variantId: string; quantity: number }>;
  };

  const variants = await prisma.productVariant.findMany({
    where: {
      id: {
        in: body.items.map((item) => item.variantId),
      },
    },
    include: {
      product: true,
    },
  });

  const subtotal = body.items.reduce((acc, item) => {
    const variant = variants.find((entry) => entry.id === item.variantId);
    return acc + item.quantity * Number(variant?.product.basePrice ?? 0);
  }, 0);

  const options = await calculateShippingFromServer({
    zipDestination: body.zipDestination,
    state: "SP",
    subtotal,
    items: body.items.map((item) => {
      const variant = variants.find((entry) => entry.id === item.variantId);
      return {
        quantity: item.quantity,
        weightGrams: variant?.product.weightGrams ?? 400,
        widthCm: variant?.product.widthCm ?? 20,
        heightCm: variant?.product.heightCm ?? 5,
        lengthCm: variant?.product.lengthCm ?? 30,
      };
    }),
  });

  return NextResponse.json({ options });
}
