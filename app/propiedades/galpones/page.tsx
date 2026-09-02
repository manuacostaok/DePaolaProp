import type { Metadata } from "next";
import { PropertySearchPage } from "@/components/search/property-search-page";
import { Callout } from "@/components/ui/callout";
import type { PropertySearchInput } from "@/lib/search";

// Slug a confirmar con el cliente (Parte B del documento de instrucciones:
// "/galpones" o "/industriales") — cambiarlo después es solo renombrar
// esta carpeta y agregar un redirect en next.config.ts si ya se indexó.
export const metadata: Metadata = {
  title: "Galpones y depósitos en Zona Norte",
  description: "Alquiler y venta de galpones y depósitos industriales en Zona Norte, Buenos Aires.",
  alternates: { canonical: "/propiedades/galpones" },
};

export default function GalponesPage({ searchParams }: { searchParams: Promise<PropertySearchInput> }) {
  return (
    <PropertySearchPage
      title="Galpones y depósitos en Zona Norte"
      basePath="/propiedades/galpones"
      fixedTipo="GALPON"
      searchParams={searchParams}
      intro={
        <div className="mb-8 max-w-2xl">
          <Callout>
            Este texto es un borrador a validar con el criterio real de Tatiana De Paola y su equipo antes de
            publicarlo — mismo criterio que ya se usa para el contenido editorial de zonas.
          </Callout>
          <p>
            De Paola Propiedades acompaña también operaciones de alquiler y venta de galpones, depósitos y naves
            industriales en Martínez, Florida, Vicente López y Villa Martelli.
          </p>
        </div>
      }
    />
  );
}
