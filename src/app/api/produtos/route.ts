import { type Prisma, Role } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/schemas/product";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const category = params.get("categorySlug") ?? undefined;
  const query = params.get("search") ?? undefined;
  const minPrice = params.get("minPrice") ? Number(params.get("minPrice")) : undefined;
  const maxPrice = params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined;
  const sortBy = params.get("sortBy") ?? "newest";
  const page = params.get("page") ? Math.max(1, Number(params.get("page"))) : 1;
  const limit = params.get("limit") ? Math.min(100, Number(params.get("limit"))) : 24;

  const sizes = params.getAll("sizes");
  const colors = params.getAll("colors");

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    category: category
      ? {
          slug: category,
        }
      : undefined,
    basePrice: {
      gte: minPrice ?? undefined,
      lte: maxPrice ?? undefined,
    },
    name: query
      ? {
          contains: query,
          mode: "insensitive",
        }
      : undefined,
  };

  if (sizes.length) {
    where.variants = {
      some: {
        size: { in: sizes },
      },
    };
  }

  if (colors.length) {
    where.variants = {
      ...(where.variants ?? {}),
      some: {
        ...(where.variants?.some ?? {}),
        color: { in: colors },
      },
    };
  }

  const orderBy =
    sortBy === "price_asc"
      ? { basePrice: "asc" as const }
      : sortBy === "price_desc"
        ? { basePrice: "desc" as const }
        : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: true,
    },
  });

  return NextResponse.json({ data: products, page, limit });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const payload = productSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json(
      { error: payload.error.issues[0]?.message ?? "Dados do produto invalidos." },
      { status: 400 }
    );
  }

  const { images, variants, ...productData } = payload.data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      description: DOMPurify.sanitize(productData.description),
      images: {
        create: images,
      },
      variants: {
        create: variants,
      },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
