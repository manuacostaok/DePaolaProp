import { Prisma, OperationType, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface PropertySearchInput {
  operacion?: string;
  zona?: string;
  tipo?: string;
  moneda?: string;
  precioMin?: string;
  precioMax?: string;
  ambientes?: string;
  cochera?: string;
  caracteristicas?: string | string[];
  orden?: string;
}

// Normaliza para deduplicar variantes de tipeo de la misma característica
// (ej. "jardín" vs "jardin" cargadas por distintos agentes) sin tocar los
// datos reales en la base — el filtro sigue matcheando todas las filas.
function normalizeFeatureKey(key: string) {
  return key
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export interface PropertyResult {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency: "ARS" | "USD" | null;
  operationType: OperationType;
  neighborhoodName: string;
  imageUrl: string;
  imageAlt: string;
  rooms: number | null;
  bathrooms: number | null;
  coveredArea: number | null;
  isSample: boolean;
  lat: number | null;
  lng: number | null;
  agent: { name: string; slug: string; photoUrl: string | null; isPlaceholderPhoto: boolean };
}

const PROPERTY_INCLUDE = {
  location: { include: { neighborhood: true } },
  images: { orderBy: { order: "asc" as const }, take: 1 },
  agent: { select: { name: true, slug: true, photoUrl: true, isPlaceholderPhoto: true } },
};

function toResult(property: Prisma.PropertyGetPayload<{ include: typeof PROPERTY_INCLUDE }>): PropertyResult {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    price: property.price ? Number(property.price) : null,
    currency: property.currency,
    operationType: property.operationType,
    neighborhoodName: property.location.neighborhood.name,
    imageUrl: property.images[0]?.url ?? "/placeholder-property.svg",
    imageAlt: property.images[0]?.alt ?? property.title,
    rooms: property.rooms,
    bathrooms: property.bathrooms,
    coveredArea: property.coveredArea,
    isSample: property.isSample,
    lat: property.location.lat,
    lng: property.location.lng,
    agent: {
      name: property.agent.name,
      slug: property.agent.slug,
      photoUrl: property.agent.photoUrl,
      isPlaceholderPhoto: property.agent.isPlaceholderPhoto,
    },
  };
}

function buildWhere(params: PropertySearchInput, fixedOperation?: OperationType): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { status: "ACTIVA" };

  const operacion = fixedOperation ?? (params.operacion === "venta" ? "VENTA" : params.operacion === "alquiler" ? "ALQUILER" : undefined);
  if (operacion) where.operationType = operacion;

  if (params.zona) where.location = { neighborhood: { slug: params.zona } };

  if (params.tipo && params.tipo in PropertyType) where.propertyType = params.tipo as PropertyType;

  if (params.cochera === "1") where.hasGarage = true;

  const min = params.precioMin ? Number(params.precioMin) : undefined;
  const max = params.precioMax ? Number(params.precioMax) : undefined;
  if ((min && min > 0) || (max && max > 0)) {
    where.currency = params.moneda === "ARS" ? "ARS" : "USD";
    where.price = {};
    if (min && min > 0) where.price.gte = min;
    if (max && max > 0) where.price.lte = max;
  }

  const ambientes = params.ambientes ? Number(params.ambientes) : undefined;
  if (ambientes && ambientes > 0) where.rooms = { gte: ambientes };

  const caracteristicas = Array.isArray(params.caracteristicas)
    ? params.caracteristicas
    : params.caracteristicas
      ? [params.caracteristicas]
      : [];
  if (caracteristicas.length > 0) {
    const rawKeys = caracteristicas.flatMap((c) => c.split(","));
    where.features = { some: { key: { in: rawKeys } } };
  }

  return where;
}

function buildOrderBy(orden?: string): Prisma.PropertyOrderByWithRelationInput[] {
  // Ordenar por precio muestra TODO el inventario ordenado (ejemplo o no) —
  // alguien ordenando por precio quiere ver el universo completo, no que
  // las propiedades de ejemplo se escondan al final como en el resto del
  // buscador. Se agrupa por moneda primero: el inventario real mezcla ARS
  // y USD (ej. el local de Florida en ARS junto al resto en USD) y comparar
  // esos números directamente daría un orden sin sentido (700.000 ARS no es
  // "más caro" que USD 520.000). El grupo USD va siempre primero (es la
  // moneda de casi todo el inventario y la que ya viene preseleccionada en
  // el filtro de moneda) para que "menor a mayor" no arranque mostrando un
  // número grande en ARS antes que los USD chicos — confuso aunque sea
  // técnicamente correcto. Las que todavía no tienen precio cargado
  // ("Consultar precio") quedan al final de todo, no se pierden.
  switch (orden) {
    case "precio_asc":
      return [{ currency: { sort: "desc", nulls: "last" } }, { price: { sort: "asc", nulls: "last" } }];
    case "precio_desc":
      return [{ currency: { sort: "desc", nulls: "last" } }, { price: { sort: "desc", nulls: "last" } }];
    case "superficie":
      return [{ isSample: "asc" }, { coveredArea: { sort: "desc", nulls: "last" } }];
    default:
      return [{ isSample: "asc" }, { publishedAt: "desc" }];
  }
}

export async function searchProperties(params: PropertySearchInput, fixedOperation?: OperationType) {
  const where = buildWhere(params, fixedOperation);
  const orderBy = buildOrderBy(params.orden);

  const properties = await prisma.property.findMany({
    where,
    orderBy,
    include: PROPERTY_INCLUDE,
  });

  if (properties.length > 0) {
    return { results: properties.map(toResult), isFallback: false };
  }

  // Sin resultados exactos: mostramos propiedades similares (misma operación,
  // sin el resto de los filtros) en vez de una grilla vacía.
  const fallbackWhere: Prisma.PropertyWhereInput = { status: "ACTIVA" };
  if (where.operationType) fallbackWhere.operationType = where.operationType;

  const fallback = await prisma.property.findMany({
    where: fallbackWhere,
    orderBy: [{ isSample: "asc" }, { publishedAt: "desc" }],
    take: 6,
    include: PROPERTY_INCLUDE,
  });

  return { results: fallback.map(toResult), isFallback: true };
}

// Agrupa por key normalizada (ver normalizeFeatureKey) para no mostrar
// "jardín" y "jardin" como dos checkboxes separados por una diferencia de
// tipeo — el value junta todas las keys reales con esa forma normalizada,
// separadas por coma, para que buildWhere matchee todas las filas reales
// sin tener que tocar los datos en la base.
//
// "garage"/"cochera" se excluyen a propósito: son la misma feature cargada
// con dos keys distintas Y ya existe un checkbox "Cochera" dedicado en el
// form (ligado al campo hasGarage) — sumarlas acá duplicaría ese control
// con dos casillas más para el mismo concepto.
const EXCLUDED_FEATURE_KEYS = new Set(["cochera", "garage"]);

export async function getFeatureOptions() {
  const features = await prisma.propertyFeature.findMany({ distinct: ["key"], select: { key: true, label: true } });

  const groups = new Map<string, { label: string; rawKeys: string[] }>();
  for (const feature of features) {
    const normalized = normalizeFeatureKey(feature.key);
    if (EXCLUDED_FEATURE_KEYS.has(normalized)) continue;
    const existing = groups.get(normalized);
    if (existing) {
      existing.rawKeys.push(feature.key);
    } else {
      groups.set(normalized, { label: feature.label, rawKeys: [feature.key] });
    }
  }

  return Array.from(groups.values())
    .sort((a, b) => a.label.localeCompare(b.label, "es"))
    .map((group) => ({ value: group.rawKeys.join(","), label: group.label }));
}

// El modelo Neighborhood no tiene lat/lng propio (solo PropertyLocation lo
// tiene, por propiedad) — el "centro" de la zona se deriva como el
// promedio de las coordenadas de sus propiedades activas con ubicación
// cargada. Si ninguna tiene coordenadas, devuelve null (la página muestra
// el fallback "Mapa no disponible" que ya existía).
export async function getNeighborhoodCenter(neighborhoodId: string): Promise<[number, number] | null> {
  const locations = await prisma.propertyLocation.findMany({
    where: { neighborhoodId, property: { status: "ACTIVA" }, lat: { not: null }, lng: { not: null } },
    select: { lat: true, lng: true },
  });

  if (locations.length === 0) return null;

  let latSum = 0;
  let lngSum = 0;
  for (const loc of locations) {
    latSum += loc.lat ?? 0;
    lngSum += loc.lng ?? 0;
  }

  return [latSum / locations.length, lngSum / locations.length];
}

export async function getNeighborhoodOptions() {
  const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: "asc" } });
  return neighborhoods.map((n) => ({ value: n.slug, label: n.name }));
}

// Distinto del anterior: acá el value es el id real (FK), no el slug de URL —
// lo necesitan los flujos que crean registros (Lead, ValuationRequest, etc.).
export async function getNeighborhoodIdOptions() {
  const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: "asc" } });
  return neighborhoods.map((n) => ({ value: n.id, label: n.name }));
}

// Usado por /favoritos: los IDs guardados viven en localStorage (cliente),
// así que la página necesita pedir los datos reales por ID en vez de por
// filtros de búsqueda — mismo mapeo (toResult/PROPERTY_INCLUDE) que el resto
// del buscador, para no divergir en qué campos trae cada card.
export async function getPropertiesByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const properties = await prisma.property.findMany({
    where: { id: { in: ids } },
    include: PROPERTY_INCLUDE,
  });

  return properties.map(toResult);
}

export async function getSimilarProperties(params: {
  excludeId: string;
  neighborhoodId: string;
  operationType: OperationType;
}) {
  const properties = await prisma.property.findMany({
    where: {
      id: { not: params.excludeId },
      status: "ACTIVA",
      OR: [{ location: { neighborhoodId: params.neighborhoodId } }, { operationType: params.operationType }],
    },
    orderBy: [{ isSample: "asc" }, { publishedAt: "desc" }],
    take: 3,
    include: PROPERTY_INCLUDE,
  });

  return properties.map(toResult);
}
