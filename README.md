# Camila Modas

Scaffold inicial de e-commerce brasileiro para moda feminina com Next.js App Router, Prisma, Auth.js, Mercado Pago sandbox, frete com Melhor Envio e fallback nacional.

## Stack

- Next.js 15 + TypeScript strict
- Tailwind CSS v4 + componentes inspirados em shadcn/ui + Radix
- Prisma 5 + PostgreSQL 16
- Auth.js v5 beta com Credentials + Resend
- Mercado Pago sandbox para Pix, cartao e boleto
- Melhor Envio com fallback Correios por regiao
- Zustand para carrinho e estado leve do checkout
- Biome para lint/format
- Vitest + Playwright para testes

## Como rodar

1. `pnpm install`
2. `docker-compose up -d`
3. `pnpm db:push`
4. `pnpm db:seed`
5. `pnpm dev`
6. Abra `http://localhost:3000`

## Variaveis de ambiente

Copie `.env.example` para `.env.local` se precisar recriar o arquivo. As principais chaves:

- `DATABASE_URL`: conexao com Postgres
- `NEXTAUTH_SECRET`: segredo do Auth.js
- `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `NEXT_PUBLIC_MP_PUBLIC_KEY`: Mercado Pago
- `MELHOR_ENVIO_TOKEN`: token do Melhor Envio
- `SHIPPING_ORIGIN_ZIP`, `SHIPPING_FREE_THRESHOLD`: regras de frete
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`: email transacional
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: credenciais do seed

## Comandos uteis

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm db:generate`
- `pnpm db:push`
- `pnpm db:seed`

## O que esta real vs placeholder

- Real quando configurado: Prisma, Auth.js, Mercado Pago via SDK oficial, Melhor Envio via endpoint oficial, webhook do Mercado Pago.
- Placeholder controlado: logo, paleta final da marca, fotos de produto, textos juridicos, Brick visual de cartao, envio de email em dev.
- Fallback proposital para DX: frete por tabela regional quando nao houver token do Melhor Envio; Pix e boleto sandbox demonstrativos quando as credenciais do Mercado Pago nao estiverem prontas.

## Observacoes importantes

- O ambiente atual desta entrega nao tem Docker instalado, entao eu nao consegui subir o Postgres daqui. O scaffold e os comandos estao prontos para isso assim que o Docker estiver disponivel na maquina.
- O build ja fecha com sucesso. Algumas paginas de dados tentam consultar o banco durante a geracao e vao logar falhas de autenticacao se o Postgres ainda nao estiver ativo.
- As credenciais seed previstas: `admin@camilamodas.com.br / admin123`.
