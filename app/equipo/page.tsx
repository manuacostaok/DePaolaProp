import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AgentCard } from "@/components/ui/agent-card";

export const metadata: Metadata = { title: "Nuestro equipo", description: "Conocé al equipo de De Paola Propiedades en Zona Norte." };

export default async function EquipoPage({
  searchParams,
}: {
  searchParams: Promise<{ zona?: string }>;
}) {
  const { zona } = await searchParams;

  const [agents, neighborhoods] = await Promise.all([
    prisma.agent.findMany({
      where: {
        isActive: true,
        ...(zona ? { specializations: { some: { slug: zona } } } : {}),
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.neighborhood.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)]">Nuestros especialistas</h1>
      <p className="mb-8 max-w-xl text-ink-soft">
        Conocé al equipo de De Paola Propiedades y a qué zona de Zona Norte se dedica cada uno.
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/equipo" className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft hover:bg-brand-tint">
          Todas las zonas
        </Link>
        {neighborhoods.map((n) => (
          <Link key={n.id} href={`/equipo?zona=${n.slug}`} className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft hover:bg-brand-tint">
            {n.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            href={`/equipo/${agent.slug}`}
            name={agent.name}
            title={agent.title}
            photoUrl={agent.photoUrl}
            isPlaceholderPhoto={agent.isPlaceholderPhoto}
          />
        ))}
        {agents.length === 0 && <p className="col-span-full py-16 text-center text-ink-soft">No hay agentes para esta zona todavía.</p>}
      </div>
    </main>
  );
}
