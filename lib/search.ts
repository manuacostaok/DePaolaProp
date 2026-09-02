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
}

const PROPERTY_INCLUDE = {
  location: { include: { neighborhood: true } },
  images: { orderBy: { order: "asc" as const }, take: 1 },
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

  return where;
}

export async function searchProperties(params: PropertySearchInput, fixedOperation?: OperationType) {
  const where = buildWhere(params, fixedOperation);

  const properties = await prisma.property.findMany({
    where,
    orderBy: [{ isSample: "asc" }, { publishedAt: "desc" }],
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
