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
    </div>
  );
}
