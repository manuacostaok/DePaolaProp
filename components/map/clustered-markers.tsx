"use client";

// Clustering (Fase 5.4, Decisión D3): se integra leaflet.markercluster
// directo, sin sumar react-leaflet-cluster como segunda dependencia solo
// para wrappear el mismo plugin — se maneja imperativamente con useMap(),
// que ya es el patrón que react-leaflet expone para esto.
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { PropertyResult } from "@/lib/search";
import { formatPrice } from "@/lib/format";
import { mapMarkerIcon } from "@/components/map/base-map";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// DivIcon en vez del ícono de clúster celeste por defecto de la librería —
// el navy de la marca (#00385C, mismo --color-brand de globals.css) para
// que no se sienta un plugin pegado encima del diseño.
function createClusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;background:#00385C;color:#fff;font-weight:700;font-size:13px;font-family:inherit;border:3px solid rgba(255,255,255,0.85);box-shadow:0 2px 6px rgba(0,39,64,0.35);">${count}</div>`,
    className: "marker-cluster depaola-marker-cluster",
    iconSize: L.point(40, 40, true),
  });
}

export function ClusteredMarkers({ properties }: { properties: PropertyResult[] }) {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup({ iconCreateFunction: createClusterIcon });

    for (const property of properties) {
      if (property.lat == null || property.lng == null) continue;

      const marker = L.marker([property.lat, property.lng], { icon: mapMarkerIcon });
      marker.bindPopup(
        `<div style="width:160px">
          <p style="margin:0 0 4px;font-weight:600;color:#211f1b">${escapeHtml(property.title)}</p>
          <p style="margin:0 0 4px;color:#57534a">${escapeHtml(property.neighborhoodName)}</p>
          <p style="margin:0 0 8px;font-weight:600;color:#002740">${escapeHtml(formatPrice(property.price, property.currency))}</p>
          <a href="/propiedades/${property.slug}" style="color:#00385c;text-decoration:underline">Ver detalle</a>
        </div>`,
      );
      group.addLayer(marker);
    }

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, properties]);

  return null;
}
