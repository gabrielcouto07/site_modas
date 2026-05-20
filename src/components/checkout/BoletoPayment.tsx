export function BoletoPayment({ boletoUrl, line }: { boletoUrl: string; line: string }) {
  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6">
      <p className="text-sm text-foreground/70">
        Gere o boleto e use a linha digitavel caso precise pagar pelo app do banco.
      </p>
      <div className="rounded-[1.5rem] bg-muted p-4 text-xs break-all">{line}</div>
      <a
        className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-white"
        href={boletoUrl}
        target="_blank"
        rel="noreferrer"
      >
        Abrir boleto
      </a>
    </div>
  );
}
