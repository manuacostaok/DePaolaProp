import { test, expect } from "@playwright/test";

const REAL_PROPERTY_SLUG = "casa-5-ambientes-barrio-parque-villa-martelli";

test("La ficha de una propiedad real muestra 'Consultar precio', nunca un número inventado", async ({ page }) => {
  await page.goto(`/propiedades/${REAL_PROPERTY_SLUG}`);

  await expect(page.getByRole("heading", { name: "Casa con 5 ambientes — Barrio Parque" })).toBeVisible();
  await expect(page.getByText("Consultar precio").first()).toBeVisible();
  await expect(page.getByText("Cotización a confirmar con el agente.")).toBeVisible();
});

test("El botón de WhatsApp abre con un mensaje prellenado", async ({ page }) => {
  await page.goto(`/propiedades/${REAL_PROPERTY_SLUG}`);

  const whatsappLink = page.getByRole("link", { name: "Consultar por WhatsApp" });
  const href = await whatsappLink.getAttribute("href");
  expect(href).toContain("wa.me");
  expect(decodeURIComponent(href ?? "")).toContain("Casa con 5 ambientes");
});

test("El botón de favorito persiste en localStorage", async ({ page }) => {
  await page.goto(`/propiedades/${REAL_PROPERTY_SLUG}`);

  const favButton = page.getByRole("button", { name: /favoritos/i });
  await favButton.click();
  await expect(favButton).toHaveAttribute("aria-pressed", "true");

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("depaola:favorites") ?? "[]"));
  expect(Array.isArray(stored) && stored.length).toBeTruthy();
});

test("Una propiedad inexistente devuelve 404", async ({ page }) => {
  const response = await page.goto("/propiedades/esta-propiedad-no-existe");
  expect(response?.status()).toBe(404);
});
