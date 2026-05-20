import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/utils";

export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Frete</span>
          <span>Calculado no checkout</span>
        </div>
        <Link href="/checkout">
          <Button className="w-full">Ir para checkout</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
