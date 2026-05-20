import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Checkout</p>
      <h1 className="font-serif text-5xl">Seu fluxo de compra esta pronto para avancar.</h1>
      <p className="text-foreground/70">
        Siga pelas etapas de identificacao, entrega e pagamento para testar o fluxo completo.
      </p>
      <Link href="/checkout/identificacao">
        <Button size="lg">Comecar checkout</Button>
      </Link>
    </div>
  );
}
