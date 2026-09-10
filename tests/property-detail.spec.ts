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

test("Galería en mobile: todas las fotos son alcanzables (regresión)", async ({ page }) => {
  // Bug real original: en mobile solo se mostraba la foto principal — las
  // demás tenían "hidden sm:block", invisibles e inalcanzables (sin swipe,
  // sin forma de verlas). Ahora la galería es una sola composición (foto
  // grande + tira de miniaturas) igual en todos los tamaños: cada
  // miniatura es alcanzable y además abre el lightbox con todas las
  // fotos. REAL_PROPERTY_SLUG tiene 3 fotos reales sembradas.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`/propiedades/${REAL_PROPERTY_SLUG}`);

  const thumbnails = page.getByRole("button", { name: /^Ver foto \d/ });
  await expect(thumbnails).toHaveCount(3);

  await thumbnails.nth(2).click();
  const mainPhoto = page.getByRole("button", { name: /Ver las 3 fotos/ });
  await expect(mainPhoto).toBeVisible();

  await mainPhoto.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("3 / 3")).toBeVisible();
});

test("Una propiedad inexistente devuelve 404", async ({ page }) => {
  const response = await page.goto("/propiedades/esta-propiedad-no-existe");
  expect(response?.status()).toBe(404);
});
