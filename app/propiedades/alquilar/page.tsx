import { PropertySearchPage } from "@/components/search/property-search-page";
import type { PropertySearchInput } from "@/lib/search";

export const metadata = { title: "Alquilar propiedades | De Paola Propiedades" };

export default function AlquilarPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchInput>;
}) {
  return (
    <PropertySearchPage
      title="Propiedades en alquiler"
      basePath="/propiedades/alquilar"
      fixedOperation="ALQUILER"
      searchParams={searchParams}
    />
  );
}
