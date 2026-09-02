"use client";

import { Marker } from "react-leaflet";
import { BaseMap, mapMarkerIcon } from "@/components/map/base-map";
import { ClusteredMarkers } from "@/components/map/clustered-markers";
import type { PropertyResult } from "@/lib/search";

export function ZonaMap({ center, properties }: { center: [number, number]; properties: PropertyResult[] }) {
  // El mapa nunca queda "vacío": si el filtro activo no deja ninguna
  // propiedad visible, el marcador central de la zona sigue mostrándose.
  return (
    <BaseMap center={center} zoom={14} className="h-72 w-full rounded-card lg:h-full">
      {properties.length === 0 && <Marker position={center} icon={mapMarkerIcon} />}
      <ClusteredMarkers properties={properties} />
    </BaseMap>
  );
}
