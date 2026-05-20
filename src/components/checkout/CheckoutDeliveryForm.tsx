"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { CepLookup } from "@/components/checkout/CepLookup";
import { ShippingOptions } from "@/components/checkout/ShippingOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { addressSchema } from "@/lib/schemas/address";
import { formatCEP } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import type { ShippingOption } from "@/types";

type DeliveryFormValues = z.input<typeof addressSchema>;

export function CheckoutDeliveryForm() {
  const router = useRouter();
  const { items } = useCart();
  const draft = useUiStore((state) => state.checkoutDraft);
  const setCheckoutDraft = useUiStore((state) => state.setCheckoutDraft);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | undefined>(
    draft.shipping
  );
  const [loadingShipping, setLoadingShipping] = useState(false);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: draft.address?.label ?? "Principal",
      recipient: draft.address?.recipient ?? draft.identification?.name ?? "",
      zip: draft.address?.zip ?? "",
      street: draft.address?.street ?? "",
      number: draft.address?.number ?? "",
      complement: draft.address?.complement ?? "",
      district: draft.address?.district ?? "",
      city: draft.address?.city ?? "",
      state: draft.address?.state ?? "",
    },
  });

  async function calculateShipping() {
    setLoadingShipping(true);
    try {
      const response = await fetch("/api/frete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zipDestination: form.getValues("zip"),
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json()) as { options: ShippingOption[] };
      setShippingOptions(payload.options);
    } finally {
      setLoadingShipping(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        if (!selectedShipping) return;
        setCheckoutDraft({
          address: values,
          shipping: selectedShipping,
        });
        router.push("/checkout/pagamento");
      })}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <Label htmlFor="zip">CEP</Label>
          <Input
            id="zip"
            {...form.register("zip")}
            onChange={(event) => form.setValue("zip", formatCEP(event.target.value))}
          />
        </div>
        <div className="self-end">
          <CepLookup
            zip={form.watch("zip")}
            onResolved={(result) => {
              form.setValue("street", result.street);
              form.setValue("district", result.district);
              form.setValue("city", result.city);
              form.setValue("state", result.state);
            }}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="recipient">Destinataria</Label>
          <Input id="recipient" {...form.register("recipient")} />
        </div>
        <div>
          <Label htmlFor="label">Apelido do endereco</Label>
          <Input id="label" {...form.register("label")} />
        </div>
      </div>
      <div>
        <Label htmlFor="street">Rua</Label>
        <Input id="street" {...form.register("street")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="number">Numero</Label>
          <Input id="number" {...form.register("number")} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" {...form.register("complement")} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" {...form.register("district")} />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...form.register("city")} />
        </div>
        <div>
          <Label htmlFor="state">UF</Label>
          <Input id="state" {...form.register("state")} />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={calculateShipping}
        disabled={loadingShipping}
      >
        {loadingShipping ? "Calculando frete..." : "Calcular frete"}
      </Button>
      {shippingOptions.length > 0 ? (
        <ShippingOptions
          options={shippingOptions}
          value={selectedShipping?.service}
          onChange={(option) => setSelectedShipping(option)}
        />
      ) : null}
      <Button className="w-full" type="submit" disabled={!selectedShipping}>
        Continuar para pagamento
      </Button>
    </form>
  );
}
