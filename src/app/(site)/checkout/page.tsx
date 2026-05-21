import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { CheckoutVisualPanel } from "@/components/checkout/CheckoutVisualPanel";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[2.5rem] border border-border/70 bg-[linear-gradient(135deg,#f8f4ef_0%,#f3ebe3_55%,#f8f7f5_100%)] px-6 py-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/55">Checkout</p>
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Entre, confirme a entrega e finalize o pagamento.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/68">
            O fluxo já está alinhado em login, entrega e pagamento. O visual abaixo usa imagens
            placeholder para simular o catálogo real enquanto o acervo completo entra.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/checkout/identificacao">Entrar no checkout</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/loja">Voltar para a loja</Link>
            </Button>
          </div>
        </div>
        <CheckoutVisualPanel
          eyebrow="Preview do fluxo"
          title="Referência visual com peças do catálogo"
          description="Esse bloco ajuda a validar o ritmo da página antes das imagens finais entrarem. A estrutura permanece limpa, leve e parecida com o padrão do restante da loja."
          note="Imagens placeholder ativadas"
          images={[
            "/products/placeholder/01.webp",
            "/products/placeholder/04.webp",
            "/products/placeholder/09.webp",
          ]}
        />
      </section>

      <CheckoutProgress activeStep={1} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border/70 bg-white/85 p-6 shadow-sm">
          <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
            Comece pelo acesso e identificação
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/65">
            O checkout já está estruturado para seguir adiante sem perder o contexto do carrinho.
          </p>
          <div className="mt-6">
            <Link href="/checkout/identificacao">
              <Button size="lg">
                Iniciar etapa 1
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <CheckoutVisualPanel
          eyebrow="Resumo do fluxo"
          title="Login, entrega e pagamento em sequência"
          description="A ordem visual e funcional agora fica mais clara para o cliente: primeiro entrar, depois informar a entrega e por fim fechar o pagamento."
          note="Sequência corrigida"
          images={[
            "/products/placeholder/02.webp",
            "/products/placeholder/07.webp",
            "/products/placeholder/11.webp",
          ]}
        />
      </div>
    </div>
  );
}
