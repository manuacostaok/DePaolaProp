import { PropertySearchPage } from "@/components/search/property-search-page";
import type { PropertySearchInput } from "@/lib/search";

export const metadata = { title: "Propiedades en venta y alquiler", description: "Buscá propiedades en venta y alquiler en Zona Norte, Buenos Aires." };

export default function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchInput>;
}) {
  return <PropertySearchPage title="Propiedades" basePath="/propiedades" searchParams={searchParams} />;
}
