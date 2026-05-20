const copy = `
<!-- AJUSTAR ANTES DE PUBLICAR -->

Politica de Trocas

As trocas podem ser solicitadas em ate 30 dias corridos apos o recebimento. A peca deve estar sem uso, com etiqueta e em perfeitas condicoes. Em casos de defeito, o prazo legal sera respeitado.

Politica de Privacidade

Coletamos apenas os dados necessarios para processar pedidos, comunicacoes e melhorias da experiencia. Dados sensiveis nao sao compartilhados com terceiros fora das integracoes estritamente necessarias para pagamento, frete e autenticacao.

Termos de Uso

Ao navegar neste ambiente, voce concorda com o uso de informacoes operacionais, regras de compra e politicas aqui descritas. Este texto e placeholder e deve ser revisado juridicamente antes da publicacao.
`;

export default function PoliticasPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-4">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Politicas</p>
      <h1 className="font-serif text-5xl">Textos institucionais placeholder</h1>
      <div className="whitespace-pre-line rounded-[2rem] border border-border bg-white p-8 text-foreground/70">
        {copy}
      </div>
    </article>
  );
}
