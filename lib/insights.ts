export interface CategoryCTA {
  label: string;
  href: string;
}

// CTA contextual automático por categoría (Fase 7, sección 5) — nunca genérico.
export function getCategoryCTA(categorySlug: string, neighborhoodSlug?: string | null): CategoryCTA {
  switch (categorySlug) {
    case "mercado":
    case "zona-norte":
      return neighborhoodSlug
        ? { label: "Ver la zona", href: `/zonas/${neighborhoodSlug}` }
        : { label: "Conocé nuestras zonas", href: "/zonas" };
    case "inversion":
      return { label: "Quiero invertir", href: "/invertir" };
    case "consejos":
      return { label: "Tasá tu propiedad", href: "/vender/tasacion" };
    case "guias":
      return { label: "Ver propiedades", href: "/propiedades" };
    default:
      return { label: "Ver propiedades", href: "/propiedades" };
  }
}

// Categorías que requieren zona relacionada antes de publicar (Fase 7,
// sección 7 — regla de gobernanza) porque su contenido es hiperlocal.
export const CATEGORIES_REQUIRING_ZONE = ["mercado", "zona-norte"];

export function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
