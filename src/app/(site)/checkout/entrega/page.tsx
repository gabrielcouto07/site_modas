import Link from "next/link";
import { CheckoutDeliveryForm } from "@/components/checkout/CheckoutDeliveryForm";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/button";

export default function CheckoutDeliveryPage() {
  return (
    <div className="space-y-6">
      <CheckoutProgress activeStep={2} />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Etapa 2</p>
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Entrega e frete
          </h1>
          <CheckoutDeliveryForm />
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button asChild variant="outline">
              <Link href="/checkout/identificacao">Voltar</Link>
            </Button>
            <Button asChild>
              <Link href="/checkout/pagamento">Ir para pagamento</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Frete</p>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-foreground/68">
            <li>• CEP de origem preparado para cálculo real ou fallback.</li>
            <li>• Opções de prazo e custo para PAC, SEDEX e variações mockadas.</li>
            <li>• Base pronta para Melhor Envio sem travar o fluxo de teste.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
