import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminOrders } from "@/lib/storefront";
import { formatBRL, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Pedidos</p>
        <h1 className="font-serif text-5xl">Acompanhar pedidos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65">
          Revise o andamento de cada compra, veja o cliente responsável e entre no detalhe com um
          clique.
        </p>
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{order.number}</p>
                <p className="text-sm text-foreground/60">{order.user?.name ?? order.email}</p>
                <p className="text-sm text-foreground/60">{formatDate(order.createdAt)}</p>
              </div>
              <div className="grid gap-2 text-sm text-foreground/65 sm:grid-cols-3 sm:items-center">
                <p>{order.status}</p>
                <p>{order.paymentStatus}</p>
                <p>{formatBRL(Number(order.total))}</p>
              </div>
              <Link href={`/admin/pedidos/${order.id}`} className="self-start lg:self-auto">
                <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-border px-5 text-sm font-medium hover:bg-muted">
                  Ver detalhes
                </span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
