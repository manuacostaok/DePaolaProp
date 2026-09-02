import "dotenv/config";
import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/password";

// Agente descartable propio de este test — evita bloquear la cuenta real de
// producción (misma base que dev, ver playwright.config.ts) durante los 15
// minutos de lockout que este test provoca a propósito.
const TEST_EMAIL = "rate-limit-test@depaolapropiedades.com";
const TEST_PASSWORD = "Contraseña-De-Prueba-123!";
const WRONG_PASSWORD = "contraseña-incorrecta";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

test.describe("Rate limiting en /admin/login", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    await prisma.agent.upsert({
      where: { slug: "rate-limit-test-agent" },
      update: { passwordHash: await hashPassword(TEST_PASSWORD), failedLoginCount: 0, lockedUntil: null, isActive: true },
      create: {
        slug: "rate-limit-test-agent",
        name: "Rate Limit Test",
        email: TEST_EMAIL,
        passwordHash: await hashPassword(TEST_PASSWORD),
        role: "AGENTE",
        isActive: true,
      },
    });
  });

  test.afterAll(async () => {
    await prisma.agent.deleteMany({ where: { slug: "rate-limit-test-agent" } });
    await prisma.$disconnect();
  });

  test("6 intentos fallidos consecutivos bloquean el login, incluso con la contraseña correcta", async ({ page }) => {
    await page.goto("/admin/login");

    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Email").fill(TEST_EMAIL);
      await page.getByLabel("Contraseña").fill(WRONG_PASSWORD);
      await page.getByRole("button", { name: "Ingresar" }).click();
      await expect(page.getByText("Email o contraseña incorrectos.")).toBeVisible();
      // El form se resetea solo tras cada submit (comportamiento normal de
      // React 19 con form actions) — confirmar contra la base, no solo la UI,
      // que ESTE intento (no uno anterior con el mismo texto de error) es el
      // que efectivamente incrementó el contador antes de seguir.
      await expect
        .poll(async () => (await prisma.agent.findUnique({ where: { slug: "rate-limit-test-agent" } }))?.failedLoginCount)
        .toBe(i + 1);
    }

    // 6to intento, ahora con la contraseña CORRECTA — debe seguir bloqueado.
    // Se verifica la propiedad de seguridad directo contra la base (sin
    // sesión creada, sin resetear el lock) en vez de depender únicamente
    // del texto de error en la UI — más robusto ante los resets de estado
    // que React 19 hace en el <form> entre envíos.
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Contraseña").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await page.waitForLoadState("networkidle");

    const cookies = await page.context().cookies();
    expect(cookies.some((c) => c.name === "depaola_session")).toBe(false);

    const agentAfter = await prisma.agent.findUniqueOrThrow({ where: { slug: "rate-limit-test-agent" } });
    expect(agentAfter.lockedUntil).not.toBeNull();
    expect(agentAfter.lockedUntil!.getTime()).toBeGreaterThan(Date.now());
  });

  test("login exitoso resetea el contador de intentos fallidos", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Contraseña").fill(WRONG_PASSWORD);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page.getByText("Email o contraseña incorrectos.")).toBeVisible();

    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Contraseña").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page).toHaveURL(/\/admin\/leads/);

    const agent = await prisma.agent.findUniqueOrThrow({ where: { slug: "rate-limit-test-agent" } });
    expect(agent.failedLoginCount).toBe(0);
    expect(agent.lockedUntil).toBeNull();
  });
});
