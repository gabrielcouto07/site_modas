import Link from "next/link";
import { CheckoutIdentificationForm } from "@/components/checkout/CheckoutIdentificationForm";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { CheckoutVisualPanel } from "@/components/checkout/CheckoutVisualPanel";
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
        <CheckoutVisualPanel
          eyebrow="Por que pedimos isso?"
          title="Acesso simples, sem quebrar a jornada"
          description="O botão de entrar usa o e-mail para enviar o link de acesso via NextAuth, enquanto os dados de contato seguem prontos para persistir no checkout e no cadastro."
          note="Login por e-mail ativo"
          images={[
            "/products/placeholder/03.webp",
            "/products/placeholder/06.webp",
            "/products/placeholder/10.webp",
          ]}
        />
      </div>
    </div>
  );
}
