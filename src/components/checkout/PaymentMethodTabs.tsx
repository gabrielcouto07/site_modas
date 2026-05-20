"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PaymentMethodTabs({
  value,
  onValueChange,
  pix,
  card,
  boleto,
}: {
  value: string;
  onValueChange: (value: string) => void;
  pix: React.ReactNode;
  card: React.ReactNode;
  boleto: React.ReactNode;
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="PIX">Pix</TabsTrigger>
        <TabsTrigger value="CARD">Cartao</TabsTrigger>
        <TabsTrigger value="BOLETO">Boleto</TabsTrigger>
      </TabsList>
      <TabsContent value="PIX" className="mt-6">
        {pix}
      </TabsContent>
      <TabsContent value="CARD" className="mt-6">
        {card}
      </TabsContent>
      <TabsContent value="BOLETO" className="mt-6">
        {boleto}
      </TabsContent>
    </Tabs>
  );
}
