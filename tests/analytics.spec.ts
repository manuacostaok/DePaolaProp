import { test, expect, type Page } from "@playwright/test";

// Mockea window.gtag ANTES de que cargue cualquier script de la página —
// GA4 real nunca está presente en tests (no hay NEXT_PUBLIC_GA_MEASUREMENT_ID
// seteada), así que esto simula que sí lo está para poder verificar los
// disparos de trackEvent() sin depender de la cuenta real de GA4.
async function mockGtag(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls = [];
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag = (...args: unknown[]) => {
      (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls.push(args);
    };
  });
}

function getGtagCalls(page: Page) {
  return page.evaluate(() => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls ?? []);
}

test("property_view se dispara al abrir una ficha de propiedad", async ({ page }) => {
  await mockGtag(page);
  await page.goto("/propiedades/chalet-6-ambientes-martinez");
  await page.waitForFunction(
    () => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls?.some((c) => c[1] === "property_view"),
  );
  const calls = await getGtagCalls(page);
  expect(calls.some((c) => c[0] === "event" && c[1] === "property_view")).toBe(true);
});

test("property_search se dispara al ver resultados del buscador", async ({ page }) => {
  await mockGtag(page);
  await page.goto("/propiedades?zona=martinez");
  await page.waitForFunction(() => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls?.length > 0);
  const calls = await getGtagCalls(page);
  expect(calls.some((c) => c[0] === "event" && c[1] === "property_search")).toBe(true);
});

test("favorite_property se dispara al guardar una propiedad, no al sacarla", async ({ page }) => {
  await mockGtag(page);
  await page.goto("/propiedades");
  await page.getByRole("button", { name: "Guardar en favoritos" }).first().click();
  let calls = await getGtagCalls(page);
  expect(calls.filter((c) => c[1] === "favorite_property")).toHaveLength(1);

  await page.getByRole("button", { name: "Quitar de favoritos" }).first().click();
  calls = await getGtagCalls(page);
  expect(calls.filter((c) => c[1] === "favorite_property")).toHaveLength(1);
});

test("whatsapp_click y contact_click se disparan desde la ficha de propiedad", async ({ page, context }) => {
  await mockGtag(page);
  await page.goto("/propiedades/chalet-6-ambientes-martinez");

  const [popup] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Consultar por WhatsApp" }).click(),
  ]);
  await popup.close();

  await page.getByRole("link", { name: "Consultar por email" }).click();

  const calls = await getGtagCalls(page);
  expect(calls.some((c) => c[1] === "whatsapp_click")).toBe(true);
  expect(calls.some((c) => c[1] === "contact_click")).toBe(true);
});

test("valuation_start y valuation_submit se disparan en el wizard de tasación", async ({ page }) => {
  await mockGtag(page);
  await page.goto("/vender/tasacion");
  await page.waitForFunction(
    () => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls?.some((c) => c[1] === "valuation_start"),
  );

  let calls = await getGtagCalls(page);
  expect(calls.some((c) => c[1] === "valuation_start")).toBe(true);

  await page.getByLabel("Zona").selectOption({ index: 1 });
  await page.getByLabel("Tipo de propiedad").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByLabel("Superficie cubierta (m²)").fill("80");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByLabel("Estado general").selectOption({ index: 1 });
  await page.getByLabel("Cochera").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByLabel("Nombre").fill("Test Playwright");
  await page.getByLabel("Teléfono / WhatsApp").fill("+5491100000000");
  await page.getByRole("button", { name: "Ver estimación" }).click();
  await page.waitForFunction(
    () => (window as unknown as { __gtagCalls: unknown[][] }).__gtagCalls?.some((c) => c[1] === "valuation_submit"),
  );

  calls = await getGtagCalls(page);
  expect(calls.some((c) => c[1] === "valuation_submit")).toBe(true);
  expect(calls.some((c) => c[1] === "lead_created")).toBe(true);
});

test("lead_created se dispara al completar el flujo de Comprar", async ({ page }) => {
  await mockGtag(page);
  await page.goto("/propiedades/comprar");
  await page.getByRole("button", { name: "Quiero que me avisen" }).click();

  const modal = page.getByRole("heading", { name: "Estoy buscando comprar" }).locator("..").locator("..");
  await modal.locator("select").nth(1).selectOption("CASA");
  await modal.getByRole("button", { name: "Siguiente" }).click();
  await modal.locator("input[type=number]").first().fill("200000");
  await modal.getByRole("button", { name: "Siguiente" }).click();
  await modal.getByLabel("Nombre").fill("Test Playwright");
  await modal.getByLabel("WhatsApp o email").fill("1100000000");
  await modal.getByLabel(/vender una propiedad/).selectOption("no");
  await modal.getByRole("button", { name: "Enviar" }).click();
  await expect(modal.getByText(/Un agente de De Paola va a revisar tu búsqueda/)).toBeVisible();

  const calls = await getGtagCalls(page);
  expect(calls.some((c) => c[1] === "lead_created")).toBe(true);
});
