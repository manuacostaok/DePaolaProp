import type { Metadata } from "next";
import Link from "next/link";
import type { ConstructionStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DevelopmentCard } from "@/components/ui/development-card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CONSTRUCTION_STATUS_OPTIONS } from "@/lib/development-options";

export const metadata: Metadata = {
  title: "Emprendimientos",
  description: "Proyectos inmobiliarios de De Paola en Zona Norte, Buenos Aires.",
  alternates: { canonical: "/emprendimientos" },
};
export const revalidate = 300;

export default async function EmprendimientosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const where: Prisma.DevelopmentWhereInput = {};
  if (estado && estado in { EN_POZO: 1, EN_CONSTRUCCION: 1, TERMINADO: 1 }) {
    where.constructionStatus = estado as ConstructionStatus;
  }

  const developments = await prisma.development.findMany({
    where,
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

      {/* Filtro por estado de obra: hoy ningún emprendimiento real tiene
          este dato cargado (constructionStatus es opcional a propósito, ver
          prisma/schema.prisma), así que elegir un estado específico no
          devuelve resultados todavía — la infraestructura queda lista para
          cuando se cargue el dato real. */}
      <form method="get" className="mb-8 flex flex-wrap items-end gap-3">
        <Select
          name="estado"
          aria-label="Estado de obra"
          defaultValue={estado ?? ""}
          placeholder="Estado de obra"
          className="w-52"
          options={CONSTRUCTION_STATUS_OPTIONS}
        />
        <Button type="submit">Filtrar</Button>
        {estado && (
          <Link href="/emprendimientos" className="flex items-center text-sm text-ink-soft underline">
            Ver todos
          </Link>
        )}
      </form>

      {developments.length === 0 ? (
        <p className="text-ink-soft">
          {estado ? "No hay emprendimientos con ese estado de obra todavía." : "Todavía no hay emprendimientos publicados."}
        </p>
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
              constructionStatus={development.constructionStatus}
            />
          ))}
        </div>
      )}
    </main>
  );
}
