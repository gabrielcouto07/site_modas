"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PixPayment({ qrCodeBase64, qrCode }: { qrCodeBase64: string; qrCode: string }) {
  const imageSrc = qrCodeBase64.startsWith("data:")
    ? qrCodeBase64
    : `data:image/png;base64,${qrCodeBase64}`;

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6">
      <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-[1.5rem] border border-border bg-white">
        <Image src={imageSrc} alt="QR Code Pix" fill className="object-contain p-4" />
      </div>
      <p className="text-sm text-foreground/70">Escaneie o QR Code ou copie o codigo abaixo.</p>
      <div className="rounded-[1.5rem] bg-muted p-4 text-xs break-all">{qrCode}</div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => navigator.clipboard.writeText(qrCode)}
      >
        Copiar codigo Pix
      </Button>
    </div>
  );
}
