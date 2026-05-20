"use client";

import { Button } from "@/components/ui/button";
import { useCep } from "@/hooks/use-cep";

export function CepLookup({
  zip,
  onResolved,
}: {
  zip: string;
  onResolved: (result: { street: string; district: string; city: string; state: string }) => void;
}) {
  const { lookupCep, loading } = useCep();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={async () => {
        const result = await lookupCep(zip);
        if (result) {
          onResolved(result);
        }
      }}
    >
      {loading ? "Buscando..." : "Buscar CEP"}
    </Button>
  );
}
