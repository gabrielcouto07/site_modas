import Link from "next/link";
import { CheckoutPaymentClient } from "@/components/checkout/CheckoutPaymentClient";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/button";

export default function CheckoutPaymentPage() {
  return (
    <div className="space-y-6">
      <CheckoutProgress activeStep={3} />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Etapa 3</p>
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Pagamento
          </h1>
          <CheckoutPaymentClient />
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button asChild variant="outline">
              <Link href="/checkout/entrega">Voltar</Link>
            </Button>
            <Button asChild>
              <Link href="/checkout">Revisar pedido</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">
            Meios de pagamento
          </p>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-foreground/68">
            <li>• Pix com confirmação rápida.</li>
            <li>• Cartão com parcelamento preparado para o Mercado Pago.</li>
            <li>• Boleto com webhooks e atualização de status prontos para integração.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
