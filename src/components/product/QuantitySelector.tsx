"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border p-1">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{quantity}</span>
      <Button variant="ghost" size="sm" type="button" onClick={() => onChange(quantity + 1)}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
