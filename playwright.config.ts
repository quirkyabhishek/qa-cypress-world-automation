import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  globalSetup: path.join(__dirname, 'tests/setup/global-setup.ts'),
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],                // shows progress in console
    ['html', { open: 'never' }], // generates Playwright HTML report
    ['allure-playwright']    // generates Allure results for reporting
  ],
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
    testIdAttribute: 'data-test-id',
  },
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],
});