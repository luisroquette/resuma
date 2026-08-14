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
