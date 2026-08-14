const { test, expect } = require('@playwright/test');

test('renders the verified product narrative without browser errors', async ({ page }, testInfo) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/Resuma/);
  await expect(page.locator('h1')).toContainText('O grupo fala.');
  await expect(page.getByText('Recursos que já funcionam em um grupo real.')).toBeVisible();
  await expect(page.getByText('O que ainda está em desenvolvimento.')).toBeVisible();
  await expect(page.getByText('Não afiliado ao WhatsApp ou à Meta.')).toBeVisible();

  const sections = page.locator('main > section');
  for (let index = 0; index < await sections.count(); index += 1) {
    await sections.nth(index).scrollIntoViewIfNeeded();
  }
  await page.locator('body').press('Home');
  await page.waitForTimeout(250);

  await page.screenshot({
    path: `test-results/${testInfo.project.name}-full-page.png`,
    fullPage: true
  });

  expect(errors).toEqual([]);
});

test('keeps content visible when JavaScript is disabled', async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 }
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:14173/');

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText('Recursos que já funcionam em um grupo real.')).toBeVisible();
  await expect(page.getByText('Sem letras miúdas.')).toBeVisible();
  await context.close();
});

test('mobile navigation opens and closes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only interaction');
  await page.goto('/');

  const button = page.getByRole('button', { name: 'Abrir menu' });
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();

  await page.getByRole('link', { name: 'Recursos', exact: true }).click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});
