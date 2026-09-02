import { test, expect } from "@playwright/test";

// Fase 6.3: error.tsx/global-error.tsx corren en el cliente, así que su
// console.error() nunca llega a los logs de Vercel — mandan el error acá
// para que quede en Runtime Logs del lado del servidor. Este test cubre la
// ruta en sí (no el disparo real desde un error boundary, que requeriría
// forzar un error de render real).
test("POST /api/log-error acepta un error de cliente y responde ok", async ({ request }) => {
  const response = await request.post("/api/log-error", {
    data: { message: "Error de prueba", digest: "abc123", url: "/propiedades", stack: "Error: test\n  at test" },
  });

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ ok: true });
});

test("POST /api/log-error con body inválido no rompe, sigue respondiendo ok", async ({ request }) => {
  const response = await request.post("/api/log-error", {
    data: "esto no es JSON con la forma esperada",
  });

  expect(response.ok()).toBe(true);
});
