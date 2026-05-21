import { notFound } from "next/navigation";
import { OrderEditor } from "@/components/admin/OrderEditor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminOrderById } from "@/lib/storefront";
import { formatBRL, formatDate } from "@/lib/utils";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    REFUNDED: "Estornado",
  };

  return labels[status] ?? status;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const addressSnapshot = order.addressSnapshot as {
    recipient?: string;
    zip?: string;
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Pedido</p>
          <h1 className="font-serif text-5xl">{order.number}</h1>
          <p className="mt-2 text-sm text-foreground/65">
            Criado em {formatDate(order.createdAt)} por {order.email}
          </p>
        </div>
        <Badge>{statusLabel(order.status)}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Total</p>
            <p className="mt-2 text-3xl font-semibold">{formatBRL(Number(order.total))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Frete</p>
            <p className="mt-2 text-3xl font-semibold">{formatBRL(Number(order.shippingCost))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Pagamento</p>
            <p className="mt-2 text-sm text-foreground/65">{order.paymentStatus}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Forma</p>
            <p className="mt-2 text-sm text-foreground/65">{order.paymentMethod}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Itens</p>
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              Conteúdo do pedido
            </h2>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-foreground/60">
                    Tamanho {item.size} • Cor {item.color} • {item.quantity} unidade(s)
                  </p>
                </div>
                <p className="font-semibold text-foreground">{formatBRL(Number(item.unitPrice))}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Cliente</p>
            <h2 className="font-serif text-2xl tracking-tight text-foreground">Dados de envio</h2>
          </div>
          <div className="space-y-3 text-sm leading-6 text-foreground/68">
            <p>
              <strong>Nome:</strong> {order.user?.name ?? order.email}
            </p>
            <p>
              <strong>E-mail:</strong> {order.email}
            </p>
            <p>
              <strong>Endereço:</strong> {addressSnapshot.street}, {addressSnapshot.number}
            </p>
            <p>
              <strong>Complemento:</strong> {addressSnapshot.complement ?? "-"}
            </p>
            <p>
              <strong>Bairro:</strong> {addressSnapshot.district}
            </p>
            <p>
              <strong>Cidade:</strong> {addressSnapshot.city}/{addressSnapshot.state}
            </p>
            <p>
              <strong>CEP:</strong> {addressSnapshot.zip}
            </p>
            <p>
              <strong>Envio:</strong> {order.shippingService ?? "-"}
            </p>
            <p>
              <strong>Rastreio:</strong> {order.shippingTrackingCode ?? "-"}
            </p>
          </div>
        </section>
      </div>

      <OrderEditor
        orderId={order.id}
        initial={{
          status: order.status,
          paymentStatus: order.paymentStatus,
          shippingService: order.shippingService,
          shippingTrackingCode: order.shippingTrackingCode,
        }}
      />
    </div>
  );
}
