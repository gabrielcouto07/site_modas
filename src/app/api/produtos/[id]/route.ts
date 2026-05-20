import DOMPurify from "isomorphic-dompurify";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/schemas/product";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = productSchema.parse(await request.json());

  const product = await prisma.$transaction(async (transaction) => {
    await transaction.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    await transaction.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });

    return transaction.product.update({
      where: {
        id,
      },
      data: {
        ...payload,
        description: DOMPurify.sanitize(payload.description),
        images: {
          create: payload.images,
        },
        variants: {
          create: payload.variants.map(({ id: _variantId, ...variant }) => variant),
        },
      },
    });
  });

  return NextResponse.json(product);
}
