import { PropertySearchPage } from "@/components/search/property-search-page";
import type { PropertySearchInput } from "@/lib/search";

export const metadata = {
  title: "Propiedades en venta y alquiler",
  description: "Buscá propiedades en venta y alquiler en Zona Norte, Buenos Aires.",
  // Los filtros viajan por querystring — el canonical siempre apunta a la
  // ruta base sin parámetros, para que Google no indexe cada combinación
  // de filtros como una página distinta.
  alternates: { canonical: "/propiedades" },
};

export default function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchInput>;
}) {
  return <PropertySearchPage title="Propiedades" basePath="/propiedades" searchParams={searchParams} />;
}
