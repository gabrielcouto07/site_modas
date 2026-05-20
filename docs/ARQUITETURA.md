# Arquitetura

## Camadas

- `src/app`: rotas App Router, layouts, paginas publicas, admin e APIs.
- `src/components`: biblioteca visual, blocos de home, PDP, checkout, carrinho e admin.
- `src/lib`: dominio compartilhado, schemas Zod, auth, pricing, frete, pagamentos, helpers e acesso ao Prisma.
- `src/stores`: estado client-side do carrinho e rascunho de checkout.
- `prisma`: schema, seed e future migrations.

## Fluxo de pedido

1. Cliente adiciona itens ao carrinho em Zustand.
2. Identificacao e endereco ficam no `ui-store`.
3. `/api/frete` calcula as opcoes com Melhor Envio ou fallback regional.
4. `/api/checkout/criar-preferencia` valida o payload, checa estoque, cria pedido pendente e inicia o meio de pagamento.
5. A confirmacao em `/checkout/confirmacao/[orderId]` mostra status e resumo do pedido.

## Fluxo de webhook

1. Mercado Pago envia evento para `/api/webhooks/mercado-pago`.
2. A rota valida assinatura HMAC e tenta deduplicar o evento.
3. O pagamento e consultado na API oficial.
4. O pedido correspondente e atualizado para `PAID` quando aprovado.

## Observacao operacional

O helper `releaseExpiredPendingOrders` deixa pronta a regra de expirar reservas de estoque apos 15 minutos. O scaffold ainda nao agenda esse job automaticamente.
