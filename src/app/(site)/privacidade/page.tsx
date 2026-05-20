export default function PrivacidadePage() {
  return (
    <article className="mx-auto max-w-4xl space-y-4">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Privacidade</p>
      <h1 className="font-serif text-5xl">Politica de privacidade</h1>
      <div className="whitespace-pre-line rounded-[2rem] border border-border bg-white p-8 text-foreground/70">
        {
          "<!-- AJUSTAR ANTES DE PUBLICAR -->\n\nColetamos somente os dados necessarios para identificacao, pagamento, envio e comunicacoes operacionais do pedido. Este texto e placeholder e precisa de revisao juridica antes da publicacao oficial."
        }
      </div>
    </article>
  );
}
