import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ui/article-card";
import { PROPERTY_TYPE_LABELS } from "@/lib/property-options";

export const metadata: Metadata = {
  title: "Mercado",
  description: "Oferta activa de De Paola en Zona Norte, agrupada por zona y tipo de propiedad, más análisis y contenido editorial.",
};
export const revalidate = 300;

async function getOfertaActiva() {
  const properties = await prisma.property.findMany({
    where: { status: "ACTIVA" },
    select: {
      operationType: true,
      propertyType: true,
      location: { select: { neighborhood: { select: { name: true, slug: true } } } },
    },
  });

  const byZone = new Map<string, { slug: string; name: string; venta: number; alquiler: number; tipos: Map<string, number> }>();

  for (const property of properties) {
    const { slug, name } = property.location.neighborhood;
    if (!byZone.has(slug)) byZone.set(slug, { slug, name, venta: 0, alquiler: 0, tipos: new Map() });
    const zone = byZone.get(slug)!;
    if (property.operationType === "VENTA") zone.venta++;
    else zone.alquiler++;
    const label = PROPERTY_TYPE_LABELS[property.propertyType];
    zone.tipos.set(label, (zone.tipos.get(label) ?? 0) + 1);
  }

  return Array.from(byZone.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default async function MercadoPage() {
  const [oferta, articles] = await Promise.all([
    getOfertaActiva(),
    prisma.article.findMany({
      where: { publishedAt: { not: null }, category: { slug: "mercado" } },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
  ]);

  const totalActiva = oferta.reduce((sum, zone) => sum + zone.venta + zone.alquiler, 0);

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)]">Mercado</h1>
      <p className="mb-8 max-w-2xl text-ink-soft">
        Un panorama de la oferta que De Paola tiene activa hoy en Zona Norte, más el análisis y las guías de nuestro
        equipo. Todavía no publicamos series históricas de precios — cuando tengamos datos suficientes para
        respaldarlas, se suman acá.
      </p>

      <h2 className="mb-4 text-xl">Oferta activa por zona</h2>
      {oferta.length === 0 ? (
        <p className="mb-10 text-ink-soft">No hay propiedades activas por el momento.</p>
      ) : (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {oferta.map((zone) => (
            <Link
              key={zone.slug}
              href={`/propiedades?zona=${zone.slug}`}
              className="rounded-card border border-line bg-white p-5 hover:border-brand"
            >
              <h3 className="mb-3 text-[17px] text-ink">{zone.name}</h3>
              <p className="mb-1 text-sm text-ink-soft">
                <strong className="text-ink">{zone.venta}</strong> en venta
              </p>
              <p className="mb-3 text-sm text-ink-soft">
                <strong className="text-ink">{zone.alquiler}</strong> en alquiler
              </p>
              <p className="text-[12.5px] uppercase tracking-wide text-ink-soft">
                {Array.from(zone.tipos.entries()).map(([tipo, count]) => `${count} ${tipo}`).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      )}
      <p className="mb-14 text-sm text-ink-soft">{totalActiva} propiedades activas en total, publicadas por De Paola.</p>

      <h2 className="mb-4 text-xl">Análisis y guías de mercado</h2>
      {articles.length === 0 ? (
        <p className="text-ink-soft">
          Todavía no hay artículos en esta categoría — mientras tanto, mirá el resto de{" "}
          <Link href="/insights" className="underline">
            Insights
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              href={`/insights/${article.slug}`}
              title={article.title}
              categoryName={article.category.name}
              imageUrl={article.coverImageUrl ?? "/placeholder-property.svg"}
              imageAlt={article.title}
              publishedAt={article.publishedAt?.toLocaleDateString("es-AR")}
            />
          ))}
        </div>
      )}
    </main>
  );
}
