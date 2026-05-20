import { CheckoutDeliveryForm } from "@/components/checkout/CheckoutDeliveryForm";

export default function CheckoutDeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Etapa 2</p>
        <h1 className="font-serif text-5xl">Entrega e frete</h1>
      </div>
      <CheckoutDeliveryForm />
    </div>
  );
}
