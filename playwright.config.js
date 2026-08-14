const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: '**/core.test.ts',
  outputDir: './test-results',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:14173',
    browserName: 'chromium',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } }
  ],
  webServer: [
    {
      command: 'python3 -m http.server 14173 --bind 127.0.0.1 --directory site',
      url: 'http://127.0.0.1:14173',
      reuseExistingServer: false,
      timeout: 10000
    },
    {
      command: 'python3 -m http.server 14174 --bind 127.0.0.1 --directory docs',
      url: 'http://127.0.0.1:14174',
      reuseExistingServer: false,
      timeout: 10000
    }
  ]
});
