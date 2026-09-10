import { OperationType, PropertyType } from "@prisma/client";
import type { ReactNode } from "react";
import { FilterPanel } from "@/components/search/filter-panel";
import { SearchResults } from "@/components/search/search-results";
import { SearchLeadBanner } from "@/components/leads/search-lead-banner";
import { searchProperties, PropertySearchInput } from "@/lib/search";

export interface PropertySearchPageProps {
  title: string;
  basePath: string;
  fixedOperation?: OperationType;
  // Fija el tipo de propiedad (ej. GALPON para /propiedades/galpones) —
  // oculta el select de Tipo y los campos que no aplican a esa categoría
  // (Ambientes/Cochera no tienen sentido de negocio para industriales).
  fixedTipo?: PropertyType;
  // Frase de contexto en el encabezado editorial, antes de los filtros —
  // el conteo real de resultados se agrega después, en la misma oración.
  description?: string;
  // Contenido editorial breve antes del panel de filtros (ver
  // app/propiedades/galpones/page.tsx) — mismo patrón que ya usa
  // app/zonas/[zona]/page.tsx para su intro de zona.
  intro?: ReactNode;
  searchParams: Promise<PropertySearchInput>;
}

export async function PropertySearchPage({
  title,
  basePath,
  fixedOperation,
  fixedTipo,
  description,
  intro,
  searchParams,
}: PropertySearchPageProps) {
  const params = await searchParams;
  const { results, isFallback } = await searchProperties(params, fixedOperation, fixedTipo);
  const showResidentialFields = fixedTipo !== "GALPON";
  const countSentence = `${results.length} ${results.length === 1 ? "propiedad disponible" : "propiedades disponibles"} ahora mismo.`;

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <header className="mb-10 max-w-[640px]">
        <h1 className="text-[clamp(34px,4.4vw,52px)] leading-[1.05]">{title}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
          {description ? `${description} ` : ""}
          {countSentence}
        </p>
      </header>
      {intro}
      <FilterPanel
        basePath={basePath}
        showOperacion={!fixedOperation}
        showTipo={!fixedTipo}
        showResidentialFields={showResidentialFields}
        values={params}
      />
      {fixedOperation && <SearchLeadBanner operation={fixedOperation} />}
      <SearchResults results={results} isFallback={isFallback} />
    </main>
  );
}
