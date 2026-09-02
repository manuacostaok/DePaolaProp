import { test, expect } from "@playwright/test";

// Fase 6.2: redirects 301(308) desde las 3 URLs del sitio Wix confirmadas
// en vivo contra www.depaolapropiedades.com el 2026-09-02 (ver
// next.config.ts para el detalle de cada mapeo y su fuente).
test("Redirects de Wix: /campusnorte y /videocampusnorte van a Campus Norte", async ({ page }) => {
  const r1 = await page.goto("/campusnorte");
  expect(new URL(page.url()).pathname).toBe("/emprendimientos/campus-norte");
  expect(r1?.status()).toBe(200);

  const r2 = await page.goto("/videocampusnorte");
  expect(new URL(page.url()).pathname).toBe("/emprendimientos/campus-norte");
  expect(r2?.status()).toBe(200);
});

test("Redirect de Wix: /proyectoresidencial va a Insights (era la Revista Digital, no un emprendimiento)", async ({ page }) => {
  const response = await page.goto("/proyectoresidencial");
  expect(new URL(page.url()).pathname).toBe("/insights");
  expect(response?.status()).toBe(200);
});
