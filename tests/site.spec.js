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
  await page.goto('http://127.0.0.1:4173/');

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

test('does not send optional analytics before consent', async ({ page }) => {
  let analyticsCalls = 0;
  await page.route('**/api/analytics', async (route) => {
    analyticsCalls += 1;
    await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto('/');
  await expect(page.getByLabel('Preferências de privacidade')).toBeVisible();
  expect(analyticsCalls).toBe(0);
  await page.getByRole('button', { name: 'Continuar sem métricas' }).click();
  expect(analyticsCalls).toBe(0);
});

test('sends first-party analytics only after explicit consent', async ({ page }) => {
  const events = [];
  await page.route('**/api/analytics', async (route) => {
    events.push(route.request().postDataJSON());
    await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Permitir métricas' }).click();
  await expect.poll(() => events.length).toBe(1);
  expect(events[0].eventName).toBe('page_view');
  expect(events[0].consentVersion).toBe('2026-08-14');
});

test('submits the pilot application without an automatic external message', async ({ page }) => {
  let submitted;
  await page.route('**/api/waitlist', async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar sem métricas' }).click();
  const form = page.locator('[data-pilot-form]');
  await form.locator('[name="name"]').fill('Ana Silva');
  await form.locator('[name="email"]').fill('ana@example.com');
  await form.locator('[name="communityName"]').fill('Comunidade Horizonte');
  await form.locator('[name="memberRange"]').selectOption('51_to_200');
  await form.locator('[name="applicantRole"]').selectOption('administrator');
  await form.locator('[name="goals"]').fill('Quero organizar decisões e links importantes do grupo.');
  await form.locator('[name="privacyNoticeAcknowledged"]').check();
  await form.locator('[name="contactRequested"]').check();
  await form.getByRole('button', { name: 'Enviar candidatura' }).click();

  await expect(form.getByRole('status')).toContainText('Candidatura recebida');
  expect(submitted.email).toBe('ana@example.com');
  expect(submitted.contactRequested).toBe(true);
});

test('privacy page explains LGPD handling and returns a rights protocol', async ({ page }) => {
  const protocol = 'c8e6d1fc-3e8e-47c4-a69a-a37fb25d1ef5';
  await page.route('**/api/privacy-request', (route) => route.fulfill({
    status: 202,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, protocol })
  }));

  await page.goto('/privacidade/');
  await expect(page).toHaveTitle('Aviso de Privacidade — Resuma');
  await expect(page.getByText('Desligadas até você decidir.')).toBeVisible();
  const form = page.locator('[data-privacy-form]');
  await form.locator('[name="email"]').fill('ana@example.com');
  await form.locator('[name="requestType"]').selectOption('access');
  await form.locator('[name="details"]').fill('Quero acessar os dados enviados.');
  await form.getByRole('button', { name: 'Enviar pedido' }).click();
  await expect(form.getByRole('status')).toContainText(protocol);
});
