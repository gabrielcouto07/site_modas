import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const productInclude = {
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  variants: {
    orderBy: {
      size: "asc",
    },
  },
} satisfies Prisma.ProductInclude;

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: productInclude,
  });
}

export async function getCatalogProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  query?: string;
}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: filters?.category
        ? {
            slug: filters.category,
          }
        : undefined,
      basePrice: {
        gte: filters?.minPrice,
        lte: filters?.maxPrice,
      },
      name: filters?.query
        ? {
            contains: filters.query,
            mode: "insensitive",
          }
        : undefined,
      variants:
        filters?.color || filters?.size
          ? {
              some: {
                color: filters.color,
                size: filters.size,
              },
            }
          : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: productInclude,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: {
      slug,
    },
    include: productInclude,
  });
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAddressesByUser(userId: string) {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getAdminKpis() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ordersToday, monthOrders, totalOrders] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    }),
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: monthStart,
        },
        status: {
          in: ["PAID", "SHIPPED", "DELIVERED"],
        },
      },
    }),
    prisma.order.count(),
  ]);

  const faturamentoMes = monthOrders.reduce((acc, order) => acc + Number(order.total), 0);
  const ticketMedio = monthOrders.length ? faturamentoMes / monthOrders.length : 0;
  const conversao = totalOrders ? (monthOrders.length / totalOrders) * 100 : 0;

  return {
    ordersToday,
    faturamentoMes,
    ticketMedio,
    conversao,
  };
}
