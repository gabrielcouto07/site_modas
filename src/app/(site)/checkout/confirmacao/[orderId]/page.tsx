import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/lib/storefront";
import { formatBRL, formatDate } from "@/lib/utils";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Badge>Status: {order.status}</Badge>
      <div>
        <h1 className="font-serif text-5xl">Pedido {order.number}</h1>
        <p className="text-foreground/70">Criado em {formatDate(order.createdAt)}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Resumo do pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Metodo</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Status do pagamento</span>
            <span>{order.paymentStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total</span>
            <strong>{formatBRL(Number(order.total))}</strong>
          </div>
        </CardContent>
      </Card>
      <Link href="/conta">
        <Button>Ir para minha conta</Button>
      </Link>
    </div>
  );
}
