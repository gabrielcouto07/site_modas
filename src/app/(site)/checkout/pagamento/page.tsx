import { CheckoutPaymentClient } from "@/components/checkout/CheckoutPaymentClient";

export default function CheckoutPaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Etapa 3</p>
        <h1 className="font-serif text-5xl">Pagamento</h1>
      </div>
      <CheckoutPaymentClient />
    </div>
  );
}
