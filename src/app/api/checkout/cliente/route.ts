import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/schemas/address";

const identificationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  phone: z.string().min(10),
  cpf: z.string().min(11),
});

const checkoutProfileSchema = z.object({
  identification: identificationSchema,
  address: addressSchema.optional(),
});

export async function POST(request: Request) {
  const parsed = checkoutProfileSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados invalidos." },
      { status: 400 }
    );
  }

  const { identification, address } = parsed.data;
  const normalizedEmail = identification.email.trim().toLowerCase();

  const customer = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        name: identification.name.trim(),
        phone: identification.phone.trim(),
        cpf: identification.cpf.trim(),
      },
      update: {
        name: identification.name.trim(),
        phone: identification.phone.trim(),
        cpf: identification.cpf.trim(),
      },
    });

    let addressId: string | undefined;

    if (address) {
      const existingAddress = await transaction.address.findFirst({
        where: {
          userId: user.id,
          isDefault: true,
        },
      });

      const addressData = {
        label: address.label.trim(),
        recipient: address.recipient.trim(),
        zip: address.zip.trim(),
        street: address.street.trim(),
        number: address.number.trim(),
        complement: address.complement?.trim() || null,
        district: address.district.trim(),
        city: address.city.trim(),
        state: address.state.trim().toUpperCase(),
        isDefault: true,
      };

      if (existingAddress) {
        const updated = await transaction.address.update({
          where: { id: existingAddress.id },
          data: addressData,
        });
        addressId = updated.id;
      } else {
        const created = await transaction.address.create({
          data: {
            userId: user.id,
            ...addressData,
          },
        });
        addressId = created.id;
      }
    }

    return {
      userId: user.id,
      addressId,
    };
  });

  return NextResponse.json(customer);
}
