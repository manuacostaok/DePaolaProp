import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSimilarProperties } from "@/lib/search";
import { SITE } from "@/lib/nav";
import { Gallery } from "@/components/property/gallery";
import { ActionPanel } from "@/components/property/action-panel";
import { LocationMap } from "@/components/property/location-map";
import { PropertyCard } from "@/components/ui/property-card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 60;

export async function generateStaticParams() {
  const properties = await prisma.property.findMany({ where: { status: "ACTIVA" }, select: { slug: true } });
  return properties.map((p) => ({ slug: p.slug }));
}

async function getProperty(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      location: { include: { neighborhood: true } },
      images: { orderBy: { order: "asc" } },
      features: true,
      agent: true,
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Propiedad no encontrada" };

  const title = `${property.title} — ${property.location.neighborhood.name}`;
  const description = property.description.slice(0, 160);
  const image = property.images[0]?.url;

  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties({
    excludeId: property.id,
    neighborhoodId: property.location.neighborhoodId,
    operationType: property.operationType,
  });

  const price = property.price ? Number(property.price) : null;

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          url: `${SITE_URL}/propiedades/${property.slug}`,
          name: property.title,
          description: property.description,
          image: property.images.map((img) => img.url),
          datePosted: property.publishedAt?.toISOString(),
          address: {
            "@type": "PostalAddress",
            streetAddress: property.location.address ?? undefined,
            addressLocality: property.location.neighborhood.name,
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
          ...(price != null && property.currency
            ? { offers: { "@type": "Offer", price, priceCurrency: property.currency, availability: "https://schema.org/InStock" } }
            : {}),
        }}
      />
      <p className="mb-4 text-sm text-ink-soft">
        <Link href="/">Inicio</Link> / <Link href="/propiedades">Propiedades</Link> / {property.title}
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <Gallery images={property.images.map((img) => ({ url: img.url, alt: img.alt ?? property.title }))} title={property.title} />

          <Badge className="mb-2.5">{property.operationType === "VENTA" ? "Venta" : "Alquiler"}</Badge>
          {property.isSample && (
            <Badge variant="dark" className="mb-2.5 ml-2">
              Ejemplo
            </Badge>
          )}
          <h1 className="mb-1 text-[32px]">{property.title}</h1>
          <p className="mb-4 text-[15px] text-ink-soft">
            {property.location.address}
            {property.location.isApproximate ? " (ubicación aproximada)" : ""}
          </p>

          <div className="grid grid-cols-2 gap-2.5 border-y border-line py-4 text-sm text-ink-soft sm:grid-cols-4">
            {property.rooms != null && (
              <div>
                <strong className="block text-ink">{property.rooms}</strong>Ambientes
              </div>
            )}
            {property.bathrooms != null && (
              <div>
                <strong className="block text-ink">{property.bathrooms}</strong>Baños
              </div>
            )}
            {property.coveredArea != null && (
              <div>
                <strong className="block text-ink">{property.coveredArea} m²</strong>Cubiertos
              </div>
            )}
            <div>
              <strong className="block text-ink">{property.hasGarage ? "Sí" : "No"}</strong>Cochera
            </div>
          </div>

          {property.features.length > 0 && (
            <div className="flex flex-wrap gap-2 py-4">
              {property.features.map((feature) => (
                <span key={feature.id} className="rounded-full border border-line bg-bg-alt px-3 py-1 text-[13px] text-ink-soft">
                  {feature.label}
                </span>
              ))}
            </div>
          )}

          <h2 className="mt-6 mb-2">Descripción</h2>
          <p>{property.description}</p>

          <h2 className="mt-6 mb-2">Ubicación</h2>
          {property.location.lat != null && property.location.lng != null ? (
            <LocationMap
              properties={[
                {
                  id: property.id,
                  slug: property.slug,
                  title: property.title,
                  price,
                  currency: property.currency,
                  operationType: property.operationType,
                  neighborhoodName: property.location.neighborhood.name,
                  imageUrl: property.images[0]?.url ?? "/placeholder-property.svg",
                  imageAlt: property.title,
                  rooms: property.rooms,
                  bathrooms: property.bathrooms,
                  coveredArea: property.coveredArea,
                  isSample: property.isSample,
                  lat: property.location.lat,
                  lng: property.location.lng,
                },
              ]}
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-card bg-bg-alt text-sm text-ink-soft">
              Ubicación no disponible todavía
            </div>
          )}
        </div>

        <ActionPanel
          propertyId={property.id}
          title={property.title}
          address={property.location.address ?? property.location.neighborhood.name}
          price={price}
          currency={property.currency}
          whatsapp={property.agent.whatsapp ?? SITE.whatsapp}
          email={property.agent.email ?? "contacto@depaolapropiedades.com"}
          agentName={property.agent.name}
          agentTitle={property.agent.title ?? "Agente"}
          agentPhotoUrl={property.agent.isPlaceholderPhoto ? null : property.agent.photoUrl}
        />
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6">Propiedades similares</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard
                key={item.id}
                href={`/propiedades/${item.slug}`}
                title={item.title}
                neighborhoodName={item.neighborhoodName}
                price={item.price}
                currency={item.currency}
                operationType={item.operationType}
                imageUrl={item.imageUrl}
                imageAlt={item.imageAlt}
                rooms={item.rooms}
                bathrooms={item.bathrooms}
                coveredArea={item.coveredArea}
                isSample={item.isSample}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
