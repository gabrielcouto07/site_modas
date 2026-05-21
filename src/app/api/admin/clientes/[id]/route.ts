import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminCustomerUpdateSchema } from "@/lib/schemas/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const payload = adminCustomerUpdateSchema.parse(await request.json());

  const customer = await prisma.$transaction(async (transaction) => {
    const existingAddresses = await transaction.address.findMany({
      where: {
        userId: id,
      },
    });

    await transaction.user.update({
      where: { id },
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? undefined,
        cpf: payload.cpf ?? undefined,
      },
    });

    for (const address of payload.addresses) {
      if (address.id) {
        const belongsToCustomer = existingAddresses.some((entry) => entry.id === address.id);
        if (!belongsToCustomer) {
          continue;
        }

        await transaction.address.update({
          where: { id: address.id },
          data: {
            label: address.label,
            recipient: address.recipient,
            zip: address.zip,
            street: address.street,
            number: address.number,
            complement: address.complement ?? undefined,
            district: address.district,
            city: address.city,
            state: address.state,
            isDefault: address.isDefault,
          },
        });
        continue;
      }

      await transaction.address.create({
        data: {
          userId: id,
          label: address.label,
          recipient: address.recipient,
          zip: address.zip,
          street: address.street,
          number: address.number,
          complement: address.complement ?? undefined,
          district: address.district,
          city: address.city,
          state: address.state,
          isDefault: address.isDefault,
        },
      });
    }

    const incomingIds = payload.addresses.map((address) => address.id).filter(Boolean) as string[];
    const removedAddresses = existingAddresses.filter(
      (address) => !incomingIds.includes(address.id)
    );

    if (removedAddresses.length) {
      await transaction.address.deleteMany({
        where: {
          id: {
            in: removedAddresses.map((address) => address.id),
          },
          userId: id,
        },
      });
    }

    return transaction.user.findUnique({
      where: { id },
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
      },
    });
  });

  return NextResponse.json(customer);
}
