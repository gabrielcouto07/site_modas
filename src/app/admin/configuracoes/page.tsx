import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Configuracoes</p>
        <h1 className="font-serif text-5xl">Integracoes e parametros</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ambiente</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground/70">
          Ajuste credenciais do Mercado Pago, Melhor Envio, Resend e limites de frete via arquivo
          <code className="mx-1 rounded bg-muted px-1 py-0.5">.env.local</code>.
        </CardContent>
      </Card>
    </div>
  );
}
