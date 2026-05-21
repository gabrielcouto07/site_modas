import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const url = new URL(request.url);
  const page = url.searchParams.get("page") ? Math.max(1, Number(url.searchParams.get("page"))) : 1;
  const limit = url.searchParams.get("limit") ? Math.min(100, Number(url.searchParams.get("limit"))) : 50;

  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: {
      category: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const data = products.map((p) => ({
    ...p,
    lowStockCount: p.variants.filter((v) => v.stock < 5).length,
  }));

  return NextResponse.json({ data, page, limit });
}
