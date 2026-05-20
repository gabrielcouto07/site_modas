"use client";

import { initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/lib/env-client";

export function CardPayment() {
  useEffect(() => {
    if (env.mpPublicKey) {
      initMercadoPago(env.mpPublicKey, { locale: "pt-BR" });
    }
  }, []);

  return (
    <Card>
      <CardContent className="space-y-3">
        <p className="font-medium">Checkout Transparente com Brick</p>
        <p className="text-sm text-foreground/70">
          O container do Brick fica pronto aqui. Em desenvolvimento sem credenciais reais, exibimos
          este placeholder seguro para manter o fluxo compilando e testavel.
        </p>
        <div
          id="cardPaymentBrick_container"
          className="rounded-[1.5rem] border border-dashed border-border p-6 text-sm text-foreground/60"
        >
          Brick de cartao do Mercado Pago
        </div>
      </CardContent>
    </Card>
  );
}
