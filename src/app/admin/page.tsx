import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminKpis } from "@/lib/storefront";
import { formatBRL } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const kpis = await getAdminKpis();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Painel</p>
        <h1 className="font-serif text-5xl">Visao geral da operacao</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/65">
          Um ponto único para acompanhar vendas, pedidos e a organização do catálogo antes da loja
          entrar em produção completa.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos hoje</CardTitle>
          </CardHeader>
          <CardContent>{kpis.ordersToday}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Faturamento do mes</CardTitle>
          </CardHeader>
          <CardContent>{formatBRL(kpis.faturamentoMes)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket medio</CardTitle>
          </CardHeader>
          <CardContent>{formatBRL(kpis.ticketMedio)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversao</CardTitle>
          </CardHeader>
          <CardContent>{kpis.conversao.toFixed(1)}%</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/admin/produtos",
            title: "Produtos",
            text: "Cadastrar, editar e revisar estoque.",
          },
          { href: "/admin/pedidos", title: "Pedidos", text: "Ver status, pagamento e rastreio." },
          { href: "/admin/clientes", title: "Clientes", text: "Atualizar perfil e endereços." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Acesso rápido</p>
            <h2 className="mt-2 font-serif text-2xl tracking-tight text-foreground">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/65">{item.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
