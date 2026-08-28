import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/ui/property-card";

export const metadata: Metadata = { title: "Propiedades destacadas", description: "Una selección curada de propiedades en Zona Norte." };
export const revalidate = 60;

export default async function DestacadasPage() {
  const properties = await prisma.property.findMany({
    where: { status: "ACTIVA", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    include: {
      location: { include: { neighborhood: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)]">Propiedades destacadas</h1>
      <p className="mb-8 text-ink-soft">Una selección curada por el equipo de De Paola.</p>

      {properties.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">Todavía no hay propiedades destacadas cargadas.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              href={`/propiedades/${property.slug}`}
              title={property.title}
              neighborhoodName={property.location.neighborhood.name}
              price={property.price ? Number(property.price) : null}
              currency={property.currency}
              operationType={property.operationType}
              imageUrl={property.images[0]?.url ?? "/placeholder-property.svg"}
              imageAlt={property.images[0]?.alt ?? property.title}
              rooms={property.rooms}
              bathrooms={property.bathrooms}
              coveredArea={property.coveredArea}
              isSample={property.isSample}
            />
          ))}
        </div>
      )}
    </main>
  );
}
