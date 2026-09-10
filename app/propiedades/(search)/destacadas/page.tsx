import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/ui/property-card";

export const metadata: Metadata = {
  title: "Propiedades destacadas",
  description: "Una selección curada de propiedades en Zona Norte.",
  alternates: { canonical: "/propiedades/destacadas" },
};
export const revalidate = 60;

export default async function DestacadasPage() {
  const properties = await prisma.property.findMany({
    where: { status: "ACTIVA", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    include: {
      location: { include: { neighborhood: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      agent: { select: { name: true, slug: true, photoUrl: true, isPlaceholderPhoto: true } },
    },
  });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <header className="mb-10 max-w-[640px]">
        <h1 className="text-[clamp(34px,4.4vw,52px)] leading-[1.05]">Propiedades destacadas</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
          Una selección curada por el equipo de De Paola.{" "}
          {properties.length} {properties.length === 1 ? "propiedad destacada" : "propiedades destacadas"} ahora mismo.
        </p>
      </header>

      {properties.length === 0 ? (
        <div className="max-w-[440px] py-16">
          <p className="font-display text-[22px] leading-snug text-ink">Todavía no hay propiedades destacadas.</p>
          <p className="mt-2 text-[14.5px] text-ink-soft">
            El equipo de De Paola está seleccionando la próxima curaduría — mientras tanto, conocé{" "}
            <Link href="/propiedades" className="text-brand-dark underline decoration-1 underline-offset-4">
              todas las propiedades disponibles
            </Link>
            .
          </p>
        </div>
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
              agent={property.agent}
            />
          ))}
        </div>
      )}
    </main>
  );
}
