import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "De Paola Propiedades",
    short_name: "De Paola",
    description: "Inmobiliaria en Zona Norte, Buenos Aires — Martínez, Florida, Vicente López y Villa Martelli.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#00385C",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
