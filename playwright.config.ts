import { defineConfig, devices } from '@playwright/test';

/* Measurement, not CI. One worker and no parallelism — two browsers sharing a
   CPU cannot produce a frame-timing number anyone should act on. */
export default defineConfig({
  testDir: './scripts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    viewport: { width: 1280, height: 800 },
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'],  viewport: { width: 1280, height: 800 } } },
  ],
});
