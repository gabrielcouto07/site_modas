import Link from "next/link";
import { CheckoutPaymentClient } from "@/components/checkout/CheckoutPaymentClient";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { CheckoutVisualPanel } from "@/components/checkout/CheckoutVisualPanel";
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
        <CheckoutVisualPanel
          eyebrow="Meios de pagamento"
          title="Pix, cartão e boleto com visual de vitrine"
          description="Enquanto o Mercado Pago é conectado, este bloco mantém a sensação de produto final com imagens de apoio e um acabamento leve, como no restante da loja."
          note="Pagamento pronto para integrar"
          images={[
            "/products/placeholder/01.webp",
            "/products/placeholder/02.webp",
            "/products/placeholder/04.webp",
          ]}
        />
      </div>
    </div>
  );
}
