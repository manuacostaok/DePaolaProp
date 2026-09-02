"use client";

import { BaseMap } from "@/components/map/base-map";
import { ClusteredMarkers } from "@/components/map/clustered-markers";
import type { PropertyResult } from "@/lib/search";

const ZONA_NORTE_CENTER: [number, number] = [-34.518, -58.495];

export function PropertyMap({ properties }: { properties: PropertyResult[] }) {
  return (
    <BaseMap center={ZONA_NORTE_CENTER} zoom={13}>
      <ClusteredMarkers properties={properties} />
    </BaseMap>
  );
}
