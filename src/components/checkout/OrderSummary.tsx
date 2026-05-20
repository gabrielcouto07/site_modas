import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/utils";
import type { CartLine, ShippingOption } from "@/types";

export function OrderSummary({
  items,
  shipping,
}: {
  items: CartLine[];
  shipping?: ShippingOption;
}) {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const total = subtotal + (shipping?.price ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center justify-between text-sm">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>{formatBRL(item.quantity * item.unitPrice)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm">
          <span>Frete</span>
          <span>{shipping ? formatBRL(shipping.price) : "A calcular"}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 font-semibold">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
