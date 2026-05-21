import type { AddressInput } from "@/lib/schemas/address";

export type CheckoutIdentificationInput = {
  email: string;
  name: string;
  phone: string;
  cpf: string;
};

export type CheckoutProfilePayload = {
  identification: CheckoutIdentificationInput;
  address?: AddressInput;
};

export async function saveCheckoutProfile(payload: CheckoutProfilePayload) {
  const response = await fetch("/api/checkout/cliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(result?.message ?? "Nao foi possivel salvar os dados do cliente.");
  }

  return (await response.json()) as {
    userId: string;
    addressId?: string;
  };
}
