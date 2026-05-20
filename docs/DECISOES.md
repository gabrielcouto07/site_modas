# Decisoes

## ADR 001 - Next App Router

Escolhido para unificar storefront, admin e APIs no mesmo projeto com SEO e layouts aninhados.

## ADR 002 - Prisma 5 + PostgreSQL

Prisma reduz friccao de schema, seed e tipagem; PostgreSQL cobre o modelo relacional do e-commerce com folga.

## ADR 003 - Mercado Pago em vez de Stripe

Mercado Pago encaixa melhor em Pix, boleto e meios locais do mercado brasileiro.

## ADR 004 - Melhor Envio em vez de Correios direto

Melhor Envio permite evoluir para multicarrier sem reescrever o dominio de frete.

## ADR 005 - Zustand no carrinho

Fluxo leve, local e persistido sem o custo de Redux.

## ADR 006 - Biome no lugar de ESLint + Prettier

Ferramenta unica, mais rapida e suficiente para o scaffold.

## ADR 007 - Fallbacks controlados de pagamento e frete

Mantem o fluxo navegavel em dev mesmo antes das credenciais reais, sem bloquear front, APIs ou testes unitarios.
