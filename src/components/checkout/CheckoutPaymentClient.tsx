"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoletoPayment } from "@/components/checkout/BoletoPayment";
import { CardPayment } from "@/components/checkout/CardPayment";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethodTabs } from "@/components/checkout/PaymentMethodTabs";
import { PixPayment } from "@/components/checkout/PixPayment";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useUiStore } from "@/stores/ui-store";

type PaymentResponse = {
  orderId: string;
  pix?: {
    qrCodeBase64: string;
    qrCode: string;
  };
  boleto?: {
    boletoUrl: string;
    line: string;
  };
};

export function CheckoutPaymentClient() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const draft = useUiStore((state) => state.checkoutDraft);
  const resetCheckoutDraft = useUiStore((state) => state.resetCheckoutDraft);
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PaymentResponse | null>(null);

  async function handleCreateOrder() {
    if (!draft.identification || !draft.address || !draft.shipping) {
      router.push("/checkout/identificacao");
      return;
    }

    setLoading(true);
    try {
      const request = await fetch("/api/checkout/criar-preferencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: draft.identification.email,
          name: draft.identification.name,
          phone: draft.identification.phone,
          cpf: draft.identification.cpf,
          address: draft.address,
          selectedShipping: draft.shipping,
          items,
          paymentMethod,
        }),
      });

      if (!request.ok) {
        throw new Error("Nao foi possivel iniciar o pagamento.");
      }

      const payload = (await request.json()) as PaymentResponse;
      setResponse(payload);
      toast.success("Pedido criado com sucesso.");
      if (paymentMethod !== "PIX") {
        clearCart();
        resetCheckoutDraft();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <PaymentMethodTabs
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          pix={
            response?.pix ? (
              <div className="space-y-4">
                <PixPayment qrCodeBase64={response.pix.qrCodeBase64} qrCode={response.pix.qrCode} />
                <Link href={`/checkout/confirmacao/${response.orderId}`}>
                  <Button variant="outline">Ir para confirmacao</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6">
                <p className="text-sm text-foreground/70">
                  Gere o QR Code do Pix para continuar o fluxo sandbox ponta a ponta.
                </p>
                <Button onClick={handleCreateOrder} disabled={loading}>
                  {loading ? "Gerando Pix..." : "Gerar Pix"}
                </Button>
              </div>
            )
          }
          card={<CardPayment />}
          boleto={
            response?.boleto ? (
              <BoletoPayment boletoUrl={response.boleto.boletoUrl} line={response.boleto.line} />
            ) : (
              <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6">
                <p className="text-sm text-foreground/70">
                  Gere o boleto sandbox para revisar a experiencia.
                </p>
                <Button onClick={handleCreateOrder} disabled={loading}>
                  {loading ? "Gerando boleto..." : "Gerar boleto"}
                </Button>
              </div>
            )
          }
        />
      </div>
      <OrderSummary items={items} shipping={draft.shipping} />
    </div>
  );
}
