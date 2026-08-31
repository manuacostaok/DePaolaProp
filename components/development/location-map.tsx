"use client";

import dynamic from "next/dynamic";

const DevelopmentMap = dynamic(() => import("@/components/development/development-map").then((m) => m.DevelopmentMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-card border border-line bg-bg-alt text-ink-soft lg:h-full">
      Cargando mapa…
    </div>
  ),
});

export function LocationMap({ name, address, lat, lng }: { name: string; address: string | null; lat: number; lng: number }) {
  return <DevelopmentMap name={name} address={address} lat={lat} lng={lng} />;
}
