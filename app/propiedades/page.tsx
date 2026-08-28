import { PropertySearchPage } from "@/components/search/property-search-page";
import type { PropertySearchInput } from "@/lib/search";

export const metadata = { title: "Propiedades | De Paola Propiedades" };

export default function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchInput>;
}) {
  return <PropertySearchPage title="Propiedades" basePath="/propiedades" searchParams={searchParams} />;
}
