import { type CouponKind, OrderStatus, type PaymentMethod } from "@prisma/client";
import { calculateOrderTotals } from "./payments/pricing";
import { prisma } from "./prisma";
import { type CheckoutInput, checkoutSchema } from "./schemas/checkout";
import { addMinutes } from "./time";

function nextOrderNumber(index: number) {
  return `CM-${new Date().getFullYear()}-${String(index).padStart(6, "0")}`;
}

export async function createPendingOrder(input: CheckoutInput) {
  const payload = checkoutSchema.parse(input);
  const variants = await prisma.productVariant.findMany({
    where: {
      id: {
        in: payload.items.map((item) => item.variantId),
      },
    },
    include: {
      product: true,
    },
  });

  for (const item of payload.items) {
    const variant = variants.find((entry) => entry.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para ${item.name}.`);
    }
  }

  const coupon = payload.couponCode
    ? await prisma.coupon.findFirst({
        where: {
          code: payload.couponCode,
          isActive: true,
        },
      })
    : null;

  const totals = calculateOrderTotals({
    items: payload.items.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    shippingPrice: payload.selectedShipping.price,
    coupon: coupon
      ? {
          kind: coupon.kind as CouponKind,
          value: Number(coupon.value),
          minSubtotal: coupon.minSubtotal ? Number(coupon.minSubtotal) : null,
          isActive: coupon.isActive,
        }
      : undefined,
  });

  const orderCount = await prisma.order.count();

  return prisma.$transaction(async (transaction) => {
    for (const item of payload.items) {
      await transaction.productVariant.update({
        where: {
          id: item.variantId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const order = await transaction.order.create({
      data: {
        number: nextOrderNumber(orderCount + 1),
        email: payload.email,
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        discount: totals.discount,
        total: totals.total,
        paymentMethod: payload.paymentMethod as PaymentMethod,
        paymentStatus: "pending",
        status: OrderStatus.PENDING,
        shippingService: payload.selectedShipping.service,
        addressSnapshot: payload.address,
        itemsSnapshot: payload.items,
        expiresAt: addMinutes(new Date(), 15),
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            size: item.size,
            color: item.color,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return {
      order,
      totals,
    };
  });
}

export async function updateOrderPaymentStatus(params: {
  orderId: string;
  paymentProviderId?: string;
  paymentStatus: string;
  approved: boolean;
}) {
  return prisma.order.update({
    where: {
      id: params.orderId,
    },
    data: {
      paymentProviderId: params.paymentProviderId,
      paymentStatus: params.paymentStatus,
      status: params.approved ? OrderStatus.PAID : OrderStatus.PENDING,
    },
  });
}

export async function releaseExpiredPendingOrders() {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      expiresAt: {
        lt: new Date(),
      },
    },
    include: {
      items: true,
    },
  });

  for (const order of expiredOrders) {
    await prisma.$transaction(async (transaction) => {
      for (const item of order.items) {
        await transaction.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await transaction.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: "expired",
        },
      });
    });
  }
}
