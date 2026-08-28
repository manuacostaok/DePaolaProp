"use client";

import dynamic from "next/dynamic";
import type { PropertyResult } from "@/lib/search";

const PropertyMap = dynamic(() => import("@/components/search/property-map").then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-card border border-line bg-bg-alt text-ink-soft">
      Cargando mapa…
    </div>
  ),
});

export function LocationMap({ properties }: { properties: PropertyResult[] }) {
  return <PropertyMap properties={properties} />;
}
