import { NextRequest, NextResponse } from "next/server";

// Fase 6.3: nivel mínimo de monitoreo sin sumar un servicio nuevo (Sentry
// queda como decisión explícita a futuro, no asumida acá). error.tsx y
// global-error.tsx corren en el cliente — un console.error() ahí se queda
// en la consola del navegador del usuario, nunca llega a los logs de
// Vercel. Esta ruta recibe ese error desde el cliente y lo loguea del
// lado del servidor, que sí queda capturado en los Runtime Logs de Vercel.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message : "Error sin mensaje";
    const digest = typeof body?.digest === "string" ? body.digest : undefined;
    const url = typeof body?.url === "string" ? body.url : undefined;
    const stack = typeof body?.stack === "string" ? body.stack : undefined;

    console.error("[client-error]", { message, digest, url, stack });
  } catch {
    // Best-effort: si el body no es JSON válido, no hay nada más que loguear.
  }

  return NextResponse.json({ ok: true });
}
