"use client";

import { useState } from "react";

type CepResult = {
  street: string;
  district: string;
  city: string;
  state: string;
};

export function useCep() {
  const [loading, setLoading] = useState(false);

  async function lookupCep(zip: string): Promise<CepResult | null> {
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zip.replace(/\D/g, "")}/json/`);
      if (!response.ok) {
        return null;
      }
      const payload = (await response.json()) as {
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
        erro?: boolean;
      };
      if (payload.erro) {
        return null;
      }

      return {
        street: payload.logradouro ?? "",
        district: payload.bairro ?? "",
        city: payload.localidade ?? "",
        state: payload.uf ?? "",
      };
    } finally {
      setLoading(false);
    }
  }

  return {
    lookupCep,
    loading,
  };
}
