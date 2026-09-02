import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DevelopmentCard } from "@/components/ui/development-card";

export const metadata: Metadata = {
  title: "Emprendimientos",
  description: "Proyectos inmobiliarios de De Paola en Zona Norte, Buenos Aires.",
  alternates: { canonical: "/emprendimientos" },
};
export const revalidate = 300;

export default async function EmprendimientosPage() {
  const developments = await prisma.development.findMany({
    include: {
      neighborhood: true,
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-3 text-[clamp(26px,3vw,36px)]">Emprendimientos</h1>
      <p className="mb-8 max-w-xl text-ink-soft">
        Proyectos propios que De Paola desarrolla y comercializa en Zona Norte — unidades a estrenar, amenities
        compartidas y financiación a medida.
      </p>
      {developments.length === 0 ? (
        <p className="text-ink-soft">Todavía no hay emprendimientos publicados.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {developments.map((development) => (
            <DevelopmentCard
              key={development.id}
              href={`/emprendimientos/${development.slug}`}
              name={development.name}
              tagline={development.tagline}
              neighborhoodName={development.neighborhood.name}
              totalUnits={development.totalUnits}
              unitTypes={development.unitTypes}
              imageUrl={development.images[0]?.url ?? "/placeholder-property.svg"}
              imageAlt={development.images[0]?.alt ?? development.name}
            />
          ))}
        </div>
      )}
    </main>
  );
}
