import { defineConfig } from '@playwright/test';

/**
 * Конфигурация Playwright для тестирования API QIWI Кошелька
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],

  use: {
    baseURL: 'https://edge.qiwi.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'API Tests',
      testMatch: '**/*.spec.js',
    },
  ],
});
