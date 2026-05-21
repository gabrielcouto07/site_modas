import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { OrderOperationError, updateAdminOrder } from "@/lib/orders";
import { adminOrderUpdateSchema } from "@/lib/schemas/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const payload = adminOrderUpdateSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json(
      { error: payload.error.issues[0]?.message ?? "Dados do pedido invalidos." },
      { status: 400 }
    );
  }

  try {
    const order = await updateAdminOrder(id, payload.data);
    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof OrderOperationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: "Nao foi possivel atualizar o pedido." }, { status: 500 });
  }
}
