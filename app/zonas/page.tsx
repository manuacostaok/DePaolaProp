import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ZoneCard } from "@/components/ui/zone-card";
import { neighborhoodImage } from "@/lib/neighborhood-images";

export const metadata: Metadata = { title: "Zonas", description: "Martínez, Florida, Vicente López y Villa Martelli — conocé cada zona de Zona Norte." };
export const revalidate = 300;

export default async function ZonasPage() {
  const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-3 text-[clamp(26px,3vw,36px)]">Zona Norte, barrio por barrio</h1>
      <p className="mb-8 max-w-xl text-ink-soft">
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
