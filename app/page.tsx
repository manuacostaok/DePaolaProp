import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDbStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error ? error.message : String(error) };
  }
}

export default async function Home() {
  const db = await getDbStatus();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">De Paola Propiedades 2.0</h1>
      <p className="text-neutral-600">Phase 0 — repo, Next.js, TypeScript, Tailwind y Prisma listos.</p>
      <p className="rounded-md border px-4 py-2 text-sm">
        Base de datos:{" "}
        {db.ok ? (
          <span className="font-medium text-green-700">conectada ✓</span>
        ) : (
          <span className="font-medium text-amber-700">sin conexión (configurar DATABASE_URL)</span>
        )}
      </p>
    </main>
  );
}
