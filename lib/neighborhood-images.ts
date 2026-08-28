// Fotos reales de Buenos Aires (Pexels, uso libre comercial) — las que
// había antes (logo en una puerta, un laptop con el sitio, una gráfica
// genérica) no mostraban las zonas en absoluto. Cobertura fotográfica
// específica de estas localidades puntuales es escasa en los bancos
// libres, así que son fotos representativas del carácter arbolado/
// residencial de Buenos Aires — no fotos documentales de una calle
// puntual de cada barrio.
export const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  martinez: "/zones/martinez.jpg",
  "vicente-lopez": "/zones/vicente-lopez.jpg",
  "villa-martelli": "/zones/villa-martelli.jpg",
  florida: "/zones/florida.jpg",
};

export function neighborhoodImage(slug: string) {
  return NEIGHBORHOOD_IMAGES[slug] ?? "/placeholder-zone.svg";
}
