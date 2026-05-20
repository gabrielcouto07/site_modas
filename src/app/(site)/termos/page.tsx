export default function TermosPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-4">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Termos</p>
      <h1 className="font-serif text-5xl">Termos de uso</h1>
      <div className="whitespace-pre-line rounded-[2rem] border border-border bg-white p-8 text-foreground/70">
        {
          "<!-- AJUSTAR ANTES DE PUBLICAR -->\n\nAo utilizar este ambiente, o usuario concorda com as regras operacionais, condicoes de pagamento, politicas comerciais e uso de dados descritos pela marca. O conteudo abaixo e exemplificativo."
        }
      </div>
    </article>
  );
}
