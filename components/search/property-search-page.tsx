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
  // Contenido editorial breve antes del panel de filtros (ver
  // app/propiedades/galpones/page.tsx) — mismo patrón que ya usa
  // app/zonas/[zona]/page.tsx para su intro de zona.
  intro?: ReactNode;
  searchParams: Promise<PropertySearchInput>;
}

export async function PropertySearchPage({ title, basePath, fixedOperation, fixedTipo, intro, searchParams }: PropertySearchPageProps) {
  const params = await searchParams;
  const { results, isFallback } = await searchProperties(params, fixedOperation, fixedTipo);
  const showResidentialFields = fixedTipo !== "GALPON";

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-6 text-[clamp(26px,3vw,36px)]">{title}</h1>
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
