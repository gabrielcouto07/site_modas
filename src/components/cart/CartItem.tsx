"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import type { CartLine } from "@/types";

export function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartLine;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <div className="flex gap-4 rounded-[1.75rem] border border-border p-4">
      <div className="relative h-28 w-24 overflow-hidden rounded-[1.5rem] bg-muted">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-foreground/60">
              {item.color} · {item.size}
            </p>
          </div>
          <button
            type="button"
            aria-label="Remover item"
            className="rounded-full p-2 text-foreground/60 hover:bg-muted"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-border p-1">
            <Button variant="ghost" size="sm" onClick={() => onUpdateQuantity(item.quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button variant="ghost" size="sm" onClick={() => onUpdateQuantity(item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <strong>{formatBRL(item.quantity * item.unitPrice)}</strong>
        </div>
      </div>
    </div>
  );
}
