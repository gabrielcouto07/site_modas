import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminCustomers } from "@/lib/storefront";
import { formatBRL, formatDate } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Clientes</p>
        <h1 className="font-serif text-5xl">Cadastro de clientes</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65">
          Consulte histórico, dados de contato e endereços em uma tela simples para operação diária.
        </p>
      </div>

      <div className="grid gap-4">
        {customers.map((customer) => {
          const latestOrder = customer.orders[0];

          return (
            <Card key={customer.id}>
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{customer.name ?? customer.email}</p>
                  <p className="text-sm text-foreground/60">{customer.email}</p>
                  <p className="text-sm text-foreground/60">
                    {customer._count.orders} pedido(s) • {customer._count.addresses} endereço(s)
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-foreground/65 sm:grid-cols-3 sm:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                      Último pedido
                    </p>
                    <p>{latestOrder ? latestOrder.number : "Nenhum pedido"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                      Atualização
                    </p>
                    <p>
                      {latestOrder
                        ? formatDate(latestOrder.createdAt)
                        : formatDate(customer.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Valor</p>
                    <p>{latestOrder ? formatBRL(Number(latestOrder.total)) : "R$ 0,00"}</p>
                  </div>
                </div>
                <Link href={`/admin/clientes/${customer.id}`} className="self-start lg:self-auto">
                  <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-border px-5 text-sm font-medium hover:bg-muted">
                    Abrir cliente
                  </span>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
