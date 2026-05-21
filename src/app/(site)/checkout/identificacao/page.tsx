import Link from "next/link";
import { CheckoutIdentificationForm } from "@/components/checkout/CheckoutIdentificationForm";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/button";

export default function CheckoutIdentificationPage() {
  return (
    <div className="space-y-6">
      <CheckoutProgress activeStep={1} />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Etapa 1</p>
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Quem vai receber esse pedido?
          </h1>
          <CheckoutIdentificationForm />
          <div className="mt-6 flex justify-end">
            <Button asChild>
              <Link href="/checkout/entrega">Ir para entrega</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">
            Por que pedimos isso?
          </p>
          <p className="mt-3 text-sm leading-7 text-foreground/68">
            Mantém a jornada clara para o cliente e prepara a base para persistir dados de contato,
            entrega e emissão do pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
