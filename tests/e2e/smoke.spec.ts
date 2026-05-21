import { test, expect } from '@playwright/test';

test('homepage loads and shows catalog', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Camila|Camila Modas|Loja/i);

  // try fetching mock products endpoint
  const resp = await page.request.get('/api/mock/produtos');
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(Array.isArray(body.data)).toBe(true);
});
