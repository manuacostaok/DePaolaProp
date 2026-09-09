"use client";

import { Marker, Popup } from "react-leaflet";
import { BaseMap, mapMarkerIcon } from "@/components/map/base-map";

export function OfficeMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  return (
    <BaseMap center={[lat, lng]} zoom={15} className="h-44 w-full rounded-card sm:h-52">
      <Marker position={[lat, lng]} icon={mapMarkerIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </BaseMap>
  );
}
