import Link from "next/link";
import { CheckoutDeliveryForm } from "@/components/checkout/CheckoutDeliveryForm";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { CheckoutVisualPanel } from "@/components/checkout/CheckoutVisualPanel";
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
        <CheckoutVisualPanel
          eyebrow="Frete e endereço"
          title="Visual limpo para conferir entrega e prazo"
          description="O painel lateral ajuda a simular a etapa de conferência antes do cálculo real de frete entrar. Assim você consegue validar a hierarquia visual agora e integrar depois."
          note="CEP e imagens placeholder"
          images={[
            "/products/placeholder/05.webp",
            "/products/placeholder/08.webp",
            "/products/placeholder/12.webp",
          ]}
        />
      </div>
    </div>
  );
}
