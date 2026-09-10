// Orden de visualización de barrios en todo el sitio (Home, /zonas, los
// selects de Zona en los filtros, el select de zona de los wizards de
// lead) — Villa Martelli va siempre primero porque es donde más trabaja
// el equipo hoy; el resto queda alfabético. Es un orden de presentación
// puro (no toca la base ni el orden real de carga de datos), así que
// vive acá como un sort en JS aplicado después de cada fetch.
const FEATURED_SLUG = "villa-martelli";

export function sortNeighborhoodsByPriority<T extends { slug: string; name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.slug === FEATURED_SLUG) return -1;
    if (b.slug === FEATURED_SLUG) return 1;
    return a.name.localeCompare(b.name, "es");
  });
}
