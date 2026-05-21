"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminOrderStatusOptions, adminOrderStatusTransitions } from "@/lib/schemas/admin";

export function OrderEditor({
  orderId,
  initial,
}: {
  orderId: string;
  initial: {
    status: string;
    paymentStatus: string;
    shippingService?: string | null;
    shippingTrackingCode?: string | null;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initial.status);
  const [paymentStatus, setPaymentStatus] = useState(initial.paymentStatus);
  const [shippingService, setShippingService] = useState(initial.shippingService ?? "");
  const [shippingTrackingCode, setShippingTrackingCode] = useState(
    initial.shippingTrackingCode ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const availableStatusOptions = useMemo(() => {
    const nextOptions =
      initial.status in adminOrderStatusTransitions
        ? adminOrderStatusTransitions[initial.status as keyof typeof adminOrderStatusTransitions]
        : [];

    return adminOrderStatusOptions.filter(
      (option) => option.value === initial.status || nextOptions.includes(option.value)
    );
  }, [initial.status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/pedidos/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
          shippingService: shippingService || null,
          shippingTrackingCode: shippingTrackingCode || null,
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Nao foi possivel atualizar o pedido.");
      }

      toast.success("Pedido atualizado");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel atualizar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background p-5"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Atualizacao</p>
        <p className="text-sm text-foreground/65">
          O sistema so libera os proximos passos validos para este pedido.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="order-status">Situacao do pedido</Label>
          <select
            id="order-status"
            className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {availableStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment-status">Status do pagamento</Label>
          <Input
            id="payment-status"
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            placeholder="approved"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="shipping-service">Forma de envio</Label>
          <Input
            id="shipping-service"
            value={shippingService}
            onChange={(event) => setShippingService(event.target.value)}
            placeholder="PAC / SEDEX / Melhor Envio"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shipping-tracking">Codigo de rastreio</Label>
          <Input
            id="shipping-tracking"
            value={shippingTrackingCode}
            onChange={(event) => setShippingTrackingCode(event.target.value)}
            placeholder="BR123456789BR"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Atualizar pedido"}
        </Button>
      </div>
    </form>
  );
}
