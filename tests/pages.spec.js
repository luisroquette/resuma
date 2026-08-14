const { test, expect } = require('@playwright/test');

test('GitHub Pages surface has complete metadata and working assets', async ({ page }) => {
  const failedResponses = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  await page.goto('http://127.0.0.1:14174/');
  await expect(page).toHaveTitle('Resuma — Free intelligence for WhatsApp communities');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://luisroquette.github.io/resuma/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://luisroquette.github.io/resuma/assets/og-resuma.png');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('compressed into signal');
  await expect(page.getByRole('link', { name: /Clone and run/ })).toHaveAttribute('href', 'https://github.com/luisroquette/resuma#local-development');
  await expect(page.getByText('The provider-neutral core is public now.')).toBeVisible();
  await expect(page.getByText('These capabilities are under development')).toBeVisible();
  expect(failedResponses).toEqual([]);
});

test('GitHub Pages robots and sitemap are valid public endpoints', async ({ request }) => {
  const robots = await request.get('http://127.0.0.1:14174/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('https://luisroquette.github.io/resuma/sitemap.xml');

  const sitemap = await request.get('http://127.0.0.1:14174/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('<loc>https://luisroquette.github.io/resuma/</loc>');
});

test('GitHub Pages demo is keyboard accessible and keeps the layout inside the viewport', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('http://127.0.0.1:14174/');
  const summaryTab = page.getByRole('tab', { name: 'SUMMARY' });
  const questionTab = page.getByRole('tab', { name: '!PERGUNTA' });
  const eventTab = page.getByRole('tab', { name: 'GROUP EVENT' });

  await summaryTab.focus();
  await summaryTab.press('ArrowRight');
  await expect(questionTab).toBeFocused();
  await expect(questionTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Registration closes tomorrow.');

  await questionTab.press('End');
  await expect(eventTab).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('A participant left the group');

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
  expect(errors).toEqual([]);
});
