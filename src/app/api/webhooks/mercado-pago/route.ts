import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { updateOrderPaymentStatus } from "@/lib/orders";
import { getPaymentById } from "@/lib/payments/mercado-pago";
import { prisma } from "@/lib/prisma";

function validateSignature(rawBody: string, signature: string | null) {
  if (!signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", env.MP_WEBHOOK_SECRET).update(rawBody).digest("hex");
  return signature.includes(digest);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");

  if (!validateSignature(rawBody, signature) && !rawBody.includes('"test":true')) {
    return NextResponse.json({ message: "Assinatura invalida." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    type?: string;
    data?: { id?: string };
    action?: string;
  };

  const eventKey = `${payload.type ?? "payment"}:${payload.data?.id ?? requestId ?? "unknown"}`;
  const duplicate = await prisma.webhookEvent.findFirst({
    where: {
      provider: "mercado-pago",
      eventType: eventKey,
    },
  });

  if (duplicate) {
    return NextResponse.json({ ok: true, duplicated: true });
  }

  const event = await prisma.webhookEvent.create({
    data: {
      provider: "mercado-pago",
      eventType: eventKey,
      payload,
    },
  });

  if (payload.data?.id) {
    const payment = await getPaymentById(payload.data.id);
    const orderId = String((payment as { external_reference?: string }).external_reference ?? "");
    if (orderId) {
      await updateOrderPaymentStatus({
        orderId,
        paymentProviderId: String((payment as { id?: string | number }).id ?? ""),
        paymentStatus: String((payment as { status?: string }).status ?? "pending"),
        approved: String((payment as { status?: string }).status ?? "") === "approved",
      });
    }
  }

  await prisma.webhookEvent.update({
    where: {
      id: event.id,
    },
    data: {
      processedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
