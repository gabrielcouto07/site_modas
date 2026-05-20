import { expect, test } from "@playwright/test";

test("fluxo de checkout ate pix sandbox", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /comprar agora/i }).click();
  await page
    .getByRole("link", { name: /vestido/i })
    .first()
    .click();
  await page.getByRole("button", { name: /adicionar ao carrinho/i }).click();
  await page.goto("/checkout/identificacao");
  await page.getByLabel("E-mail").fill("cliente@teste.com");
  await page.getByLabel("Nome completo").fill("Cliente Teste");
  await page.getByLabel("Telefone").fill("11999999999");
  await page.getByLabel("CPF").fill("12345678909");
  await page.getByRole("button", { name: /continuar para entrega/i }).click();
  await page.getByLabel("CEP").fill("01310-100");
  await page.getByRole("button", { name: /buscar cep/i }).click();
  await page.getByRole("button", { name: /calcular frete/i }).click();
  await page.getByRole("button", { name: /correios · economico/i }).click();
  await page.getByRole("button", { name: /continuar para pagamento/i }).click();
  await page.getByRole("button", { name: /gerar pix/i }).click();
  await expect(page.getByAltText("QR Code Pix")).toBeVisible();
});
