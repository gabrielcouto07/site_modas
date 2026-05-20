# Integracoes

## Mercado Pago

1. Crie uma aplicacao no painel do Mercado Pago.
2. Preencha `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY` e `NEXT_PUBLIC_MP_PUBLIC_KEY`.
3. Configure `MP_WEBHOOK_SECRET`.
4. Em desenvolvimento, mantenha `MP_SANDBOX_MODE=true`.
5. Para producao, troque os tokens e a URL base publica do webhook.

## Melhor Envio

1. Gere um token no painel do Melhor Envio.
2. Preencha `MELHOR_ENVIO_TOKEN`.
3. Ajuste `SHIPPING_ORIGIN_ZIP` para o CEP de origem real.
4. Enquanto o token nao existir, o fallback regional continua funcionando.

## Resend

1. Gere a chave da conta.
2. Preencha `RESEND_API_KEY`.
3. Ajuste `RESEND_FROM_EMAIL` para um dominio validado.

## Banco

1. Suba o Postgres local com `docker-compose up -d`.
2. Rode `pnpm db:push`.
3. Rode `pnpm db:seed`.
