"use client";

import { cn } from "@/lib/utils";
import type { ShippingOption } from "@/types";

export function ShippingOptions({
  options,
  value,
  onChange,
}: {
  options: ShippingOption[];
  value?: string;
  onChange: (option: ShippingOption) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={`${option.carrier}-${option.service}`}
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-[1.5rem] border p-4 text-left",
            value === option.service ? "border-primary bg-primary/5" : "border-border bg-white"
          )}
          onClick={() => onChange(option)}
        >
          <div>
            <p className="font-medium">
              {option.carrier} · {option.service}
            </p>
            <p className="text-sm text-foreground/60">{option.deliveryDays} dias uteis</p>
          </div>
          <strong>{option.isFreeShipping ? "Gratis" : `R$ ${option.price.toFixed(2)}`}</strong>
        </button>
      ))}
    </div>
  );
}
