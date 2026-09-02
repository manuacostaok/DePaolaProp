import { PropertySearchPage } from "@/components/search/property-search-page";
import type { PropertySearchInput } from "@/lib/search";

export const metadata = {
  title: "Comprar propiedades",
  description: "Casas, departamentos y PH en venta en Martínez, Florida, Vicente López y Villa Martelli.",
  alternates: { canonical: "/propiedades/comprar" },
};

export default function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchInput>;
}) {
  return (
    <PropertySearchPage
      title="Propiedades en venta"
      basePath="/propiedades/comprar"
      fixedOperation="VENTA"
      searchParams={searchParams}
    />
  );
}
