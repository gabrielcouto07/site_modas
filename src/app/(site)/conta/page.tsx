import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getAddressesByUser, getOrdersByUser } from "@/lib/storefront";
import { formatBRL, formatDate } from "@/lib/utils";

export default async function ContaPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-5xl">Minha conta</h1>
        <p className="text-foreground/70">Entre com seu e-mail para acompanhar seus pedidos.</p>
        <Link href="/checkout/identificacao">
          <Button>Identificar-me</Button>
        </Link>
      </div>
    );
  }

  const [orders, addresses] = await Promise.all([
    getOrdersByUser(session.user.id),
    getAddressesByUser(session.user.id),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Conta</p>
        <h1 className="font-serif text-5xl">Oi, {session.user.name ?? "cliente"}.</h1>
      </div>
      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Pedidos</h2>
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{order.number}</p>
                  <p className="text-sm text-foreground/60">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{order.status}</p>
                  <strong>{formatBRL(Number(order.total))}</strong>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Enderecos</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader>
                <CardTitle>{address.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/70">
                {address.street}, {address.number}
                <br />
                {address.district} · {address.city}/{address.state}
                <br />
                CEP {address.zip}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
