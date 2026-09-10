import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ZoneCard } from "@/components/ui/zone-card";
import { neighborhoodImage } from "@/lib/neighborhood-images";
import { sortNeighborhoodsByPriority } from "@/lib/neighborhood-order";

export const metadata: Metadata = {
  title: "Zonas",
  description: "Martínez, Florida, Vicente López y Villa Martelli — conocé cada zona de Zona Norte.",
  alternates: { canonical: "/zonas" },
};
export const revalidate = 300;

export default async function ZonasPage() {
  const neighborhoods = sortNeighborhoodsByPriority(
    await prisma.neighborhood.findMany({ orderBy: { name: "asc" } }),
  );

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.12em] text-brand">Zona Norte</span>
      <h1 className="mb-3 max-w-2xl text-balance text-[clamp(32px,4.5vw,52px)]">Barrio por barrio, no solo un mapa de precios</h1>
      <p className="mb-10 max-w-xl text-ink-soft">
        20 años trabajando en estas cuatro zonas nos permiten contarte no solo qué hay en venta, sino cómo se vive
        en cada una.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {neighborhoods.map((neighborhood) => (
          <ZoneCard
            key={neighborhood.id}
            href={`/zonas/${neighborhood.slug}`}
            name={neighborhood.name}
            tagline="Ver guía completa"
            imageUrl={neighborhoodImage(neighborhood.slug)}
            imageAlt={neighborhood.name}
          />
        ))}
      </div>
    </main>
  );
}
