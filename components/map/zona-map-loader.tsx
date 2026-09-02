"use client";

// Next.js no permite dynamic(..., { ssr: false }) directo en un Server
// Component — este wrapper client-only replica el mismo patrón de carga
// que ya usa components/search/search-results.tsx, mismo texto y mismas
// clases, para que los 3 mapas del sitio se sientan consistentes.
import dynamic from "next/dynamic";
import type { PropertyResult } from "@/lib/search";

const ZonaMap = dynamic(() => import("@/components/map/zona-map").then((m) => m.ZonaMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-card border border-line bg-bg-alt text-ink-soft lg:h-full">
      Cargando mapa…
    </div>
  ),
});

export function ZonaMapLoader({ center, properties }: { center: [number, number]; properties: PropertyResult[] }) {
  return <ZonaMap center={center} properties={properties} />;
}
