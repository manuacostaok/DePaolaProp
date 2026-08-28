import { defineConfig, devices } from "@playwright/test";

// TODO: estos tests corren contra la misma base de Neon del desarrollo
// (no hay un branch/DB de test separado todavía) — los flujos de leads y
// tasación crean filas reales con contactName "Test Playwright". Antes de
// un uso más intensivo en CI, conviene un Neon branch dedicado a test.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
