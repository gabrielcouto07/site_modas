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
  sort?: "newest" | "price-asc" | "price-desc";
}) {
  const orderBy =
    filters?.sort === "price-asc"
      ? { basePrice: "asc" as const }
      : filters?.sort === "price-desc"
        ? { basePrice: "desc" as const }
        : { createdAt: "desc" as const };

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
    orderBy,
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: {
        include: {
          addresses: {
            orderBy: {
              isDefault: "desc",
            },
          },
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
          variant: {
            select: {
              id: true,
              size: true,
              color: true,
              colorHex: true,
            },
          },
        },
      },
    },
  });
}

export async function getAdminCustomers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          orders: true,
          addresses: true,
        },
      },
      orders: {
        select: {
          id: true,
          number: true,
          status: true,
          total: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}

export async function getAdminCustomerById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      addresses: {
        orderBy: [
          {
            isDefault: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getOrderById(
  orderId: string,
  viewer?: { userId?: string; role?: "ADMIN" | "USER" }
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return null;
  }

  if (viewer?.role === "ADMIN") {
    return order;
  }

  if (order.userId && viewer?.userId !== order.userId) {
    return null;
  }

  return order;
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
