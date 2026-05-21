import { ArrowRight, CheckCircle2, CreditCard, Truck, UserRound } from "lucide-react";
import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[2.5rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] px-6 py-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Checkout</p>
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Seu fluxo de compra em três etapas.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/68">
            Uma jornada simples para capturar identificação, entrega e pagamento sem perder contexto
            do pedido.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: UserRound, title: "Identificação", text: "Dados do cliente e contato." },
            { icon: Truck, title: "Entrega", text: "CEP, frete e prazo." },
            { icon: CreditCard, title: "Pagamento", text: "Pix, cartão e boleto." },
            { icon: CheckCircle2, title: "Confirmação", text: "Revisão final do pedido." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-border/70 bg-white/80 p-4"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-medium text-foreground">{item.title}</h2>
              <p className="mt-1 text-sm text-foreground/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CheckoutProgress activeStep={1} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
            Comece pela identificação
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/65">
            O checkout já está estruturado para seguir adiante sem perder o contexto do carrinho.
          </p>
          <div className="mt-6">
            <Link href="/checkout/identificacao">
              <Button size="lg">
                Iniciar etapa 1
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Resumo do fluxo</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/68">
            <li>• Dados de contato e identificação fiscal.</li>
            <li>• Cálculo de frete com fallback local enquanto a integração não entra.</li>
            <li>• Pagamento com Mercado Pago preparado para Pix, cartão e boleto.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
