import DOMPurify from "isomorphic-dompurify";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/schemas/product";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      variants: true,
    },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const payload = productSchema.parse(await request.json());

  const product = await prisma.product.create({
    data: {
      ...payload,
      description: DOMPurify.sanitize(payload.description),
      images: {
        create: payload.images,
      },
      variants: {
        create: payload.variants,
      },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
