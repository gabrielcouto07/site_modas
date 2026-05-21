import { Role } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/schemas/product";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  try {
    const product = await prisma.$transaction(async (transaction) => {
      await transaction.productImage.deleteMany({ where: { productId: id } });
      await transaction.productImage.createMany({
        data: images.map((image) => ({ ...image, productId: id })),
      });

      const existingVariants = await transaction.productVariant.findMany({
        where: { productId: id },
      });
      const incomingKeys = variants.map((variant) => `${variant.size}||${variant.color}`);

      for (const variant of variants) {
        await transaction.productVariant.upsert({
          where: {
            productId_size_color: {
              productId: id,
              size: variant.size,
              color: variant.color,
            },
          },
          create: {
            ...variant,
            productId: id,
          },
          update: {
            sku: variant.sku,
            stock: variant.stock,
            colorHex: variant.colorHex,
          },
        });
      }

      const variantsToDelete = existingVariants.filter(
        (variant) => !incomingKeys.includes(`${variant.size}||${variant.color}`)
      );
      if (variantsToDelete.length) {
        const soldVariant = await transaction.orderItem.findFirst({
          where: {
            variantId: {
              in: variantsToDelete.map((variant) => variant.id),
            },
          },
        });

        if (soldVariant) {
          throw new Error(
            "Nao e possivel remover uma variacao que ja foi usada em pedido. Zere o estoque dessa variacao e deixe-a fora de uso."
          );
        }

        await transaction.productVariant.deleteMany({
          where: {
            id: {
              in: variantsToDelete.map((variant) => variant.id),
            },
          },
        });
      }

      return transaction.product.update({
        where: { id },
        data: {
          ...productData,
          description: DOMPurify.sanitize(productData.description),
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Nao foi possivel atualizar o produto.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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
