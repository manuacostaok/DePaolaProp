import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AmenityIcon } from "@/components/ui/amenity-icon";
import { Gallery } from "@/components/property/gallery";
import { LeadModal } from "@/components/leads/lead-modal";
import { DevelopmentLeadForm } from "@/components/leads/development-lead-form";
import { LocationMap } from "@/components/development/location-map";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 300;

export async function generateStaticParams() {
  const developments = await prisma.development.findMany({ select: { slug: true } });
  return developments.map((d) => ({ slug: d.slug }));
}

async function getDevelopment(slug: string) {
  return prisma.development.findUnique({
    where: { slug },
    include: {
      neighborhood: true,
      office: true,
      images: { orderBy: { order: "asc" } },
      amenities: true,
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const development = await getDevelopment(slug);
  if (!development) return { title: "Emprendimiento no encontrado" };

  const title = `${development.name} — ${development.neighborhood.name}`;
  const description = development.description.slice(0, 160);
  const image = development.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/emprendimientos/${slug}` },
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function DevelopmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const development = await getDevelopment(slug);
  if (!development) notFound();

  const keyFacts = [
    development.totalUnits != null ? { label: "Unidades", value: String(development.totalUnits) } : null,
    development.unitTypes ? { label: "Tipologías", value: development.unitTypes } : null,
    development.amenitiesArea != null ? { label: "Amenities", value: `${development.amenitiesArea} m²` } : null,
    development.landArea != null ? { label: "Terreno", value: `${development.landArea} m²` } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          url: `${SITE_URL}/emprendimientos/${development.slug}`,
          name: development.name,
          description: development.description,
          image: development.images.map((img) => img.url),
          numberOfAccommodationUnits: development.totalUnits ?? undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: development.address ?? undefined,
            addressLocality: development.neighborhood.name,
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
        }}
      />
      <BreadcrumbJsonLd
        siteUrl={SITE_URL}
        items={[
          { name: "Inicio", href: "/" },
          { name: "Emprendimientos", href: "/emprendimientos" },
          { name: development.name, href: `/emprendimientos/${development.slug}` },
        ]}
      />
      <p className="mb-4 text-sm text-ink-soft">
        <Link href="/">Inicio</Link> / <Link href="/emprendimientos">Emprendimientos</Link> / {development.name}
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <Gallery
            images={development.images.map((img) => ({ url: img.url, alt: img.alt ?? development.name }))}
            title={development.name}
          />

          <Badge className="mb-2.5">Emprendimiento</Badge>
          {development.isSample && (
            <Badge variant="dark" className="mb-2.5 ml-2">
              Ejemplo
            </Badge>
          )}
          <h1 className="mb-1 text-[32px]">{development.name}</h1>
          {development.tagline && <p className="mb-1 font-display text-[20px] text-brand-dark">{development.tagline}</p>}
          <p className="mb-4 text-[15px] text-ink-soft">
            {development.address ?? development.neighborhood.name}
          </p>

          {keyFacts.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 border-y border-line py-4 text-sm text-ink-soft sm:grid-cols-3">
              {keyFacts.map((fact) => (
                <div key={fact.label}>
                  <strong className="block text-ink">{fact.value}</strong>
                  {fact.label}
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-6 mb-2">Sobre el proyecto</h2>
          <p>{development.description}</p>

          {development.amenities.length > 0 && (
            <>
              <h2 className="mt-6 mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {development.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-2.5 rounded-control border border-line bg-bg-alt px-3.5 py-3 text-sm text-ink">
                    <AmenityIcon amenityKey={amenity.key} className="size-5 shrink-0 text-brand" />
                    {amenity.label}
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-6 mb-2">Ubicación</h2>
          {development.nearbyLandmarks && <p className="mb-3 text-sm text-ink-soft">{development.nearbyLandmarks}</p>}
          {development.lat != null && development.lng != null ? (
            <LocationMap name={development.name} address={development.address} lat={development.lat} lng={development.lng} />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-card bg-bg-alt text-sm text-ink-soft">
              Ubicación no disponible todavía
            </div>
          )}

          {development.financing && (
            <>
              <h2 className="mt-6 mb-2">Financiación</h2>
              <p>{development.financing}</p>
            </>
          )}
        </div>

        <div className="sticky top-24 rounded-card border border-line bg-white p-6">
          <p className="mb-1 font-display text-[22px] text-brand-dark">Consultá por {development.name}</p>
          <p className="mb-4 text-[13.5px] text-ink-soft">
            Un asesor de De Paola te cuenta disponibilidad, precios y condiciones de financiación.
          </p>

          <a
            href={`https://wa.me/${(development.office?.whatsapp ?? SITE.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hola, me interesa "${development.name}". ¿Podemos coordinar una consulta?`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "whatsapp", className: "mb-2.5 w-full" })}
          >
            Consultar por WhatsApp
          </a>
          <LeadModal triggerLabel="Dejar mis datos" triggerVariant="outline" title={`Consulta — ${development.name}`}>
            <DevelopmentLeadForm developmentId={development.id} developmentName={development.name} />
          </LeadModal>

          {development.externalUrl && (
            <p className="mt-4 border-t border-line pt-4 text-[13px] text-ink-soft">
              Más info del proyecto:{" "}
              <a href={development.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                {development.externalUrl.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
