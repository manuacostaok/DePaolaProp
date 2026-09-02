import { PropertySearchPage } from "@/components/search/property-search-page";
import type { PropertySearchInput } from "@/lib/search";

export const metadata = {
  title: "Alquilar propiedades",
  description: "Departamentos y casas en alquiler en Martínez, Florida, Vicente López y Villa Martelli.",
  alternates: { canonical: "/propiedades/alquilar" },
};

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
