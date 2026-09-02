"use client";

// Fallback de mapa sin costo/API key: Leaflet + tiles de OpenStreetMap.
// TODO: migrar a Google Maps cuando haya GOOGLE_MAPS_API_KEY (decisión
// abierta de la Fase 17) — no bloquea el desarrollo mientras tanto.
//
// Extraído de components/search/property-map.tsx (Fase 5) para compartirlo
// con el mapa de /zonas/[zona] y el clustering del buscador sin duplicar la
// config de tiles/ícono entre los 3 mapas del sitio.
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import type { ReactNode } from "react";

// react-leaflet no resuelve bien los íconos default con el bundler de Next —
// se apunta a los mismos assets publicados en el CDN del paquete (patrón
// estándar de la comunidad react-leaflet + Next.js).
export const mapMarkerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  className?: string;
  children: ReactNode;
}

export function BaseMap({
  center,
  zoom = 13,
  scrollWheelZoom = false,
  className = "h-[520px] w-full rounded-card",
  children,
}: BaseMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
