import { type CouponKind, OrderStatus, type PaymentMethod } from "@prisma/client";
import { calculateOrderTotals } from "./payments/pricing";
import { prisma } from "./prisma";
import {
  type AdminOrderUpdateInput,
  canTransitionAdminOrderStatus,
  shouldRestockOnAdminOrderStatusChange,
} from "./schemas/admin";
import { type CheckoutInput, checkoutSchema } from "./schemas/checkout";
import { addMinutes } from "./time";

export class OrderOperationError extends Error {
  constructor(
    message: string,
    readonly statusCode = 400
  ) {
    super(message);
    this.name = "OrderOperationError";
  }
}

function nextOrderNumber(index: number) {
  return `CM-${new Date().getFullYear()}-${String(index).padStart(6, "0")}`;
}

export async function createPendingOrder(
  input: CheckoutInput,
  context?: { userId?: string | null; email?: string | null }
) {
  const payload = checkoutSchema.parse(input);

  const coupon = payload.couponCode
    ? await prisma.coupon.findFirst({
        where: {
          code: payload.couponCode,
          isActive: true,
        },
      })
    : null;

  return prisma.$transaction(async (transaction) => {
    const variants = await transaction.productVariant.findMany({
      where: {
        id: {
          in: payload.items.map((item) => item.variantId),
        },
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
              take: 1,
            },
          },
        },
      },
    });

    const normalizedItems = payload.items.map((item) => {
      const variant = variants.find((entry) => entry.id === item.variantId);

      if (!variant || variant.productId !== item.productId) {
        throw new OrderOperationError(
          "O produto escolhido nao corresponde a variacao selecionada.",
          400
        );
      }

      return {
        requestedItem: item,
        variant,
        unitPrice: Number(variant.product.basePrice),
      };
    });

    const totals = calculateOrderTotals({
      items: normalizedItems.map((item) => ({
        quantity: item.requestedItem.quantity,
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

    for (const item of normalizedItems) {
      const stockUpdate = await transaction.productVariant.updateMany({
        where: {
          id: item.variant.id,
          stock: {
            gte: item.requestedItem.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.requestedItem.quantity,
          },
        },
      });

      if (stockUpdate.count === 0) {
        throw new OrderOperationError(
          `Estoque insuficiente para ${item.variant.product.name}.`,
          409
        );
      }
    }

    const orderCount = await transaction.order.count();
    const shouldAttachUser =
      Boolean(context?.userId) &&
      Boolean(context?.email) &&
      context?.email?.trim().toLowerCase() === payload.email.trim().toLowerCase();

    const order = await transaction.order.create({
      data: {
        number: nextOrderNumber(orderCount + 1),
        userId: shouldAttachUser ? (context?.userId ?? undefined) : undefined,
        email: payload.email.trim().toLowerCase(),
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        discount: totals.discount,
        total: totals.total,
        paymentMethod: payload.paymentMethod as PaymentMethod,
        paymentStatus: "pending",
        status: OrderStatus.PENDING,
        shippingService: payload.selectedShipping.service,
        addressSnapshot: payload.address,
        itemsSnapshot: normalizedItems.map((item) => ({
          productId: item.variant.productId,
          variantId: item.variant.id,
          quantity: item.requestedItem.quantity,
          unitPrice: item.unitPrice,
          name: item.variant.product.name,
          size: item.variant.size,
          color: item.variant.color,
          image: item.variant.product.images[0]?.url ?? item.requestedItem.image,
        })),
        expiresAt: addMinutes(new Date(), 15),
        items: {
          create: normalizedItems.map((item) => ({
            productId: item.variant.productId,
            variantId: item.variant.id,
            name: item.variant.product.name,
            size: item.variant.size,
            color: item.variant.color,
            unitPrice: item.unitPrice,
            quantity: item.requestedItem.quantity,
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
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!order) {
      throw new OrderOperationError("Pedido nao encontrado.", 404);
    }

    const nextStatus =
      order.status === OrderStatus.CANCELLED || order.status === OrderStatus.REFUNDED
        ? order.status
        : params.approved
          ? OrderStatus.PAID
          : order.status;

    return transaction.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        paymentProviderId: params.paymentProviderId,
        paymentStatus: params.paymentStatus,
        status: nextStatus,
        expiresAt: params.approved ? null : order.expiresAt,
      },
    });
  });
}

export async function updateAdminOrder(orderId: string, payload: AdminOrderUpdateInput) {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new OrderOperationError("Pedido nao encontrado.", 404);
    }

    if (!canTransitionAdminOrderStatus(order.status, payload.status)) {
      throw new OrderOperationError(
        "Essa mudanca de status nao e permitida para o pedido atual.",
        400
      );
    }

    if (shouldRestockOnAdminOrderStatusChange(order.status, payload.status)) {
      for (const item of order.items) {
        await transaction.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return transaction.order.update({
      where: { id: orderId },
      data: {
        status: payload.status,
        paymentStatus: payload.paymentStatus,
        shippingService: payload.shippingService,
        shippingTrackingCode: payload.shippingTrackingCode,
        expiresAt: payload.status === OrderStatus.PENDING ? order.expiresAt : null,
      },
    });
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
