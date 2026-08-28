import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { searchProperties, PropertySearchInput } from "@/lib/search";
import { FilterPanel } from "@/components/search/filter-panel";
import { SearchResults } from "@/components/search/search-results";
import { Callout } from "@/components/ui/callout";
import { neighborhoodImage } from "@/lib/neighborhood-images";

async function getNeighborhood(slug: string) {
  return prisma.neighborhood.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ zona: string }> }): Promise<Metadata> {
  const { zona } = await params;
  const neighborhood = await getNeighborhood(zona);
  if (!neighborhood) return { title: "Zona no encontrada" };
  return { title: `${neighborhood.name}, Zona Norte`, description: neighborhood.description.slice(0, 160) };
}

export default async function ZonaPage({
  params,
  searchParams,
}: {
  params: Promise<{ zona: string }>;
  searchParams: Promise<PropertySearchInput>;
}) {
  const { zona } = await params;
  const neighborhood = await getNeighborhood(zona);
  if (!neighborhood) notFound();

  const query = await searchParams;
  const { results, isFallback } = await searchProperties({ ...query, zona });

  return (
    <main>
      <section
        className="relative flex min-h-[380px] items-end bg-cover bg-center"
        style={{ backgroundImage: `url('${neighborhoodImage(neighborhood.slug)}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,30,26,0.72)] via-[rgba(23,30,26,0.28)] to-[rgba(23,30,26,0.12)]" />
        <div className="relative mx-auto w-full max-w-[1240px] px-6 py-10 sm:px-8">
          <span className="mb-3 block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#DCE7DE]">
            Zona Norte
          </span>
          <h1 className="text-[44px] text-white">{neighborhood.name}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
        <p className="mb-6 text-sm text-ink-soft">
          <Link href="/">Inicio</Link> / <Link href="/zonas">Zonas</Link> / {neighborhood.name}
        </p>

        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          <div>
            {neighborhood.needsReview && (
              <Callout>
                El contenido editorial de esta zona es un borrador a validar con el criterio real de Tatiana De
                Paola y su equipo (Fase 6).
              </Callout>
            )}
            <h2 className="mb-2">Cómo es vivir en {neighborhood.name}</h2>
            <p>{neighborhood.description}</p>

            {neighborhood.transportContent && (
              <>
                <h2 className="mt-6 mb-2">Transporte</h2>
                <p>{neighborhood.transportContent}</p>
              </>
            )}

            {neighborhood.schoolsContent && (
              <>
                <h2 className="mt-6 mb-2">Colegios</h2>
                <p>{neighborhood.schoolsContent}</p>
              </>
            )}

            {neighborhood.hasMarketData && neighborhood.avgPriceUsd && (
              <>
                <h2 className="mt-6 mb-2">Mercado en {neighborhood.name}</h2>
                <p>Precio promedio de referencia: USD {neighborhood.avgPriceUsd.toLocaleString("es-AR")}.</p>
              </>
            )}
          </div>
          <div className="flex h-72 items-center justify-center rounded-card bg-bg-alt text-sm text-ink-soft lg:h-full">
            Mapa de {neighborhood.name}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">
              Disponibles ahora
            </span>
            <h2>Propiedades en {neighborhood.name}</h2>
          </div>
        </div>

        <FilterPanel basePath={`/zonas/${neighborhood.slug}`} showZona={false} values={query} />
        <SearchResults results={results} isFallback={isFallback} />
      </div>
    </main>
  );
}
