const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: '**/*.unit.test.js',
  outputDir: './test-results',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } }
  ],
  webServer: [
    {
      command: 'npm run serve',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: true,
      timeout: 10000
    },
    {
      command: 'npm run serve:docs',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: true,
      timeout: 10000
    }
  ]
});
