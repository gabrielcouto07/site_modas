"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="font-serif text-4xl">Algo saiu do esperado</h1>
        <p className="text-foreground/70">{error.message}</p>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </div>
  );
}
