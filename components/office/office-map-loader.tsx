"use client";

import dynamic from "next/dynamic";

// Mapa real (Leaflet, ver components/map/base-map.tsx) en vez del
// placeholder de texto "Mapa de X" que tenía /sucursales antes — mismo
// patrón dynamic(ssr:false) que components/property/location-map.tsx.
export const OfficeMapLoader = dynamic(() => import("@/components/office/office-map").then((m) => m.OfficeMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-44 items-center justify-center rounded-card bg-bg-alt text-sm text-ink-soft sm:h-52">
      Cargando mapa…
    </div>
  ),
});
