import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { uniquePhone } from "./helpers/test-contacts";

// onDelete: Cascade en ValuationRequest/Appointment se encarga de los
// registros relacionados al borrar el Lead.
async function deleteLeadByContact(contact: string) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  await prisma.lead.deleteMany({ where: { contactPhone: contact } });
  await prisma.$disconnect();
}

test("Tasación sin comparables suficientes: nunca muestra un número, ofrece agendar", async ({ page }) => {
  const phone = uniquePhone();
  await page.goto("/vender/tasacion");

  // Paso 1 — Ubicación
  await page.locator("select").first().selectOption({ index: 1 });
  await page.getByLabel("Tipo de propiedad").selectOption("CASA");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Paso 2 — Dimensiones
  await page.getByLabel("Superficie cubierta (m²)").fill("500"); // valor atípico, no matchea comparables
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Paso 3 — Estado
  await page.getByLabel("Estado general").selectOption("MUY_BUENO");
  await page.getByLabel("Cochera").selectOption("si");
  await page.getByRole("button", { name: "Siguiente" }).click();

  // Paso 4 — Contacto
  await page.getByLabel("Nombre").fill("Test Playwright");
  await page.getByLabel("Teléfono / WhatsApp").fill(phone);
  await page.getByRole("button", { name: "Ver estimación" }).click();

  await expect(page.getByText(/Ya intentamos darte una estimación automática/)).toBeVisible();
  await expect(page.getByText(/dentro de las 24-48hs/)).toBeVisible();
  await expect(page.getByText(/USD [\d.]+ – USD/)).toHaveCount(0);

  // Ofrece agendar
  await page.getByLabel("Fecha preferida").fill("2026-12-01");
  await page.getByLabel("Franja horaria").selectOption("manana");
  await page.getByRole("button", { name: "Agendar visita" }).click();

  await expect(page.getByText(/Coordinamos tu tasación/)).toBeVisible();

  await deleteLeadByContact(phone);
});

test("La tasación nunca menciona la palabra IA en la interfaz", async ({ page }) => {
  await page.goto("/vender/tasacion");
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/\bIA\b/);
});
