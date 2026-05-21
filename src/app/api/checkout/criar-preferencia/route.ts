import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPendingOrder, OrderOperationError } from "@/lib/orders";
import {
  createBoletoPayment,
  createCheckoutPreference,
  createPixPayment,
} from "@/lib/payments/mercado-pago";
import { rateLimitByIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rateLimit = rateLimitByIp(`checkout:${ip}`);
  if (!rateLimit.success) {
    return NextResponse.json({ message: "Muitas tentativas de checkout." }, { status: 429 });
  }

  const body = await request.json();
  const session = await auth();

  try {
    const { order, totals } = await createPendingOrder(body, {
      userId: session?.user?.id,
      email: session?.user?.email,
    });

    if (body.paymentMethod === "PIX") {
      const pix = await createPixPayment({
        amount: totals.total,
        email: order.email,
        description: `Pedido ${order.number}`,
        externalReference: order.id,
      });

      return NextResponse.json({
        orderId: order.id,
        pix: {
          qrCodeBase64: pix.qrCodeBase64,
          qrCode: pix.qrCode,
        },
      });
    }

    if (body.paymentMethod === "BOLETO") {
      const boleto = await createBoletoPayment({
        amount: totals.total,
        email: order.email,
        description: `Pedido ${order.number}`,
        externalReference: order.id,
      });

      return NextResponse.json({
        orderId: order.id,
        boleto,
      });
    }

    const preference = await createCheckoutPreference({
      externalReference: order.id,
      title: `Pedido ${order.number}`,
      unitPrice: totals.total,
      quantity: 1,
      payerEmail: order.email,
    });

    return NextResponse.json({
      orderId: order.id,
      preference,
    });
  } catch (error) {
    if (error instanceof OrderOperationError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Nao foi possivel criar o pedido." }, { status: 500 });
  }
}
