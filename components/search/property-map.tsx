"use client";

// Fallback de mapa sin costo/API key: Leaflet + tiles de OpenStreetMap.
// TODO: migrar a Google Maps cuando haya GOOGLE_MAPS_API_KEY (decisión
// abierta de la Fase 17) — no bloquea el desarrollo mientras tanto.
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import type { PropertyResult } from "@/lib/search";
import { formatPrice } from "@/lib/format";

// react-leaflet no resuelve bien los íconos default con el bundler de Next —
// se apunta a los mismos assets publicados en el CDN del paquete (patrón
// estándar de la comunidad react-leaflet + Next.js).
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ZONA_NORTE_CENTER: [number, number] = [-34.518, -58.495];

export function PropertyMap({ properties }: { properties: PropertyResult[] }) {
  const withCoords = properties.filter((p) => p.lat != null && p.lng != null);

  return (
    <MapContainer center={ZONA_NORTE_CENTER} zoom={13} scrollWheelZoom={false} className="h-[520px] w-full rounded-card">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withCoords.map((property) => (
        <Marker key={property.id} position={[property.lat as number, property.lng as number]} icon={icon}>
          <Popup>
            <div className="w-40">
              <p className="mb-1 font-semibold text-ink">{property.title}</p>
              <p className="mb-1 text-ink-soft">{property.neighborhoodName}</p>
              <p className="mb-2 font-medium text-brand-dark">{formatPrice(property.price, property.currency)}</p>
              <Link href={`/propiedades/${property.slug}`} className="text-brand underline">
                Ver detalle
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
