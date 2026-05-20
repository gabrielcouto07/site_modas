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
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="grid gap-2 p-6 md:grid-cols-4 md:items-center">
              <div>
                <p className="font-medium">{order.number}</p>
                <p className="text-sm text-foreground/60">{formatDate(order.createdAt)}</p>
              </div>
              <p>{order.status}</p>
              <p>{order.paymentStatus}</p>
              <p className="text-right font-semibold">{formatBRL(Number(order.total))}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
