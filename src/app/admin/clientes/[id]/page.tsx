import { notFound } from "next/navigation";
import { CustomerEditor } from "@/components/admin/CustomerEditor";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminCustomerById } from "@/lib/storefront";
import { formatBRL, formatDate } from "@/lib/utils";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getAdminCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Cliente</p>
        <h1 className="font-serif text-5xl">{customer.name ?? customer.email}</h1>
        <p className="mt-2 text-sm text-foreground/65">{customer.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Pedidos</p>
            <p className="mt-2 text-3xl font-semibold">{customer.orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Endereços</p>
            <p className="mt-2 text-3xl font-semibold">{customer.addresses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Cadastro</p>
            <p className="mt-2 text-sm text-foreground/65">{formatDate(customer.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <CustomerEditor
        customerId={customer.id}
        initialData={{
          name: customer.name ?? "",
          email: customer.email,
          phone: customer.phone ?? undefined,
          cpf: customer.cpf ?? undefined,
          addresses: customer.addresses.map((address) => ({
            id: address.id,
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
          })),
        }}
      />

      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Histórico</p>
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Pedidos deste cliente
          </h2>
        </div>
        <div className="grid gap-4">
          {customer.orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-3 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium text-foreground">{order.number}</p>
                  <p className="text-sm text-foreground/60">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-sm text-foreground/65">
                  <p>Situação: {order.status}</p>
                  <p>Itens: {order.items.length}</p>
                </div>
                <strong className="text-right text-foreground">
                  {formatBRL(Number(order.total))}
                </strong>
              </CardContent>
            </Card>
          ))}
          {!customer.orders.length ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-background p-6 text-sm text-foreground/60">
              Nenhum pedido registrado para este cliente.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
