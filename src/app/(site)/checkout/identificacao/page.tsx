import { CheckoutIdentificationForm } from "@/components/checkout/CheckoutIdentificationForm";

export default function CheckoutIdentificationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Etapa 1</p>
        <h1 className="font-serif text-5xl">Quem vai receber esse pedido?</h1>
      </div>
      <CheckoutIdentificationForm />
    </div>
  );
}
