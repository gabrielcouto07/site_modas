import DOMPurify from "isomorphic-dompurify";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/schemas/product";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const payload = productSchema.parse(await request.json());
  const product = await prisma.$transaction(async (transaction) => {
    // images: remove and recreate (ordering maintained)
    await transaction.productImage.deleteMany({ where: { productId: id } });
    await transaction.productImage.createMany({
      data: payload.images.map((img) => ({ ...img, productId: id })),
    });

    // Load existing variants for the product
    const existing = await transaction.productVariant.findMany({ where: { productId: id } });

    const incomingKeys = payload.variants.map((v) => `${v.size}||${v.color}`);

    // Upsert each incoming variant by composite unique (productId, size, color)
    for (const v of payload.variants) {
      const whereKey = { productId_size_color: { productId: id, size: v.size, color: v.color } } as any;
      await transaction.productVariant.upsert({
        where: whereKey,
        create: { ...v, productId: id },
        update: {
          sku: v.sku,
          stock: v.stock,
          colorHex: v.colorHex,
        },
      });
    }

    // Delete variants that are not present in the incoming payload
    const toDelete = existing.filter((e) => !incomingKeys.includes(`${e.size}||${e.color}`));
    if (toDelete.length) {
      await transaction.productVariant.deleteMany({
        where: { id: { in: toDelete.map((d) => d.id) } },
      });
    }

    // Update product core fields
    return transaction.product.update({
      where: { id },
      data: {
        ...payload,
        description: DOMPurify.sanitize(payload.description),
      },
    });
  });

  return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json(product);
}
