import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { uniquePhone } from "./helpers/test-contacts";

async function deleteLeadByContact(contact: string) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  await prisma.lead.deleteMany({ where: { OR: [{ contactPhone: contact }, { contactEmail: contact }] } });
  await prisma.$disconnect();
}

test("Flujo Comprar: cross-sell a Vender cuando el usuario necesita vender para comprar", async ({ page }) => {
  const phone = uniquePhone();
  await page.goto("/propiedades/comprar");
  await page.getByRole("button", { name: "Quiero que me avisen" }).click();

  const modal = page.getByRole("heading", { name: "Estoy buscando comprar" }).locator("..").locator("..");

  await modal.locator("select").nth(1).selectOption("CASA"); // tipo (zona queda en "Todas")
  await modal.getByRole("button", { name: "Siguiente" }).click();

  await modal.locator("input[type=number]").first().fill("200000");
  await modal.getByRole("button", { name: "Siguiente" }).click();

  await modal.getByLabel("Nombre").fill("Test Playwright");
  await modal.getByLabel("WhatsApp o email").fill(phone);
  await modal.getByLabel(/vender una propiedad/).selectOption("si");
  await modal.getByRole("button", { name: "Enviar" }).click();

  await expect(modal.getByText(/Un agente de De Paola va a revisar tu búsqueda/)).toBeVisible();
  await expect(modal.getByRole("link", { name: "Quiero vender" })).toHaveAttribute("href", "/vender");

  await deleteLeadByContact(phone);
});

test("Flujo Vender: deriva a Tasación con la zona y el tipo ya cargados", async ({ page }) => {
  await page.goto("/vender");

  await page.getByLabel("Zona de la propiedad").selectOption({ index: 1 });
  await page.getByLabel("Tipo de propiedad").selectOption("DEPARTAMENTO");
  await page.getByRole("button", { name: "Siguiente" }).click();

  await page.getByLabel("¿Ya sabés cuánto vale tu propiedad?").selectOption("no");
  const link = page.getByRole("link", { name: "Ir a la tasación" });
  const href = await link.getAttribute("href");
  expect(href).toContain("/vender/tasacion?neighborhoodId=");
  expect(href).toContain("propertyType=DEPARTAMENTO");

  await link.click();
  await expect(page).toHaveURL(/\/vender\/tasacion\?/);
  await expect(page.getByText("Ya cargamos la zona y el tipo de propiedad")).toBeVisible();
});

test("Flujo Invertir genera confirmación con salida a WhatsApp", async ({ page }) => {
  const email = `playwright-invertir-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  await page.goto("/invertir");

  await page.getByLabel("Tipo de inversión").selectOption("renta");
  await page.getByRole("button", { name: "Siguiente" }).click();

  await page.getByLabel("Zona de interés").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Siguiente" }).click();

  await page.getByLabel("Nombre").fill("Test Playwright");
  await page.getByLabel("Email o WhatsApp").fill(email);
  await page.getByRole("button", { name: "Enviar" }).click();

  await expect(page.getByText(/agente especializado en inversión/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Hablar ahora por WhatsApp" })).toHaveAttribute("href", /wa\.me/);

  await deleteLeadByContact(email);
});
