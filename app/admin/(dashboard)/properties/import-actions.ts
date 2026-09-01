"use server";

import { revalidatePath } from "next/cache";
import { OperationType, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseCsv, csvToRecords } from "@/lib/csv";
import { PROPERTY_TYPE_LABELS } from "@/lib/property-options";

export interface ImportRowResult {
  row: number;
  title: string;
  status: "created" | "skipped";
  reason?: string;
}

export interface ImportSummary {
  total: number;
  created: number;
  skipped: number;
  results: ImportRowResult[];
}

const HEADER_ALIASES: Record<string, string[]> = {
  title: ["titulo", "título", "title"],
  operationType: ["operacion", "operación", "tipo de operacion", "operation"],
  propertyType: ["tipo", "tipo de propiedad", "property type"],
  price: ["precio", "price"],
  currency: ["moneda", "currency"],
  zone: ["zona", "direccion", "dirección", "zona/direccion", "address", "ubicacion", "ubicación"],
  rooms: ["ambientes", "rooms"],
  bedrooms: ["dormitorios", "bedrooms"],
  bathrooms: ["banos", "baños", "bathrooms"],
  area: ["superficie", "superficie total", "m2", "area"],
  sourceUrl: ["url de la publicacion original", "url original", "url", "link", "publicacion original"],
  imageUrls: ["urls de fotos", "fotos", "imagenes", "imágenes", "photos", "images"],
};

function findField(record: Record<string, string>, canonicalKey: keyof typeof HEADER_ALIASES): string {
  for (const alias of HEADER_ALIASES[canonicalKey]) {
    if (record[alias] !== undefined) return record[alias];
  }
  return "";
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseOperationType(raw: string): OperationType | null {
  const value = raw.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (value.includes("alquiler")) return "ALQUILER";
  if (value.includes("venta")) return "VENTA";
  return null;
}

function parsePropertyType(raw: string): PropertyType | null {
  const value = raw.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const entries = Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][];
  const match = entries.find(([, label]) => {
    const normalizedLabel = label.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    return value.includes(normalizedLabel) || normalizedLabel.includes(value);
  });
  if (match) return match[0];
  if (value.includes("deposito") || value.includes("galpon")) return "GALPON";
  if (value.includes("lote") || value.includes("terreno")) return "TERRENO";
  return null;
}

function parsePrice(raw: string): number | undefined {
  const cleaned = raw.replace(/[^\d.,]/g, "");
  if (!cleaned) return undefined;
  // Precios argentinos suelen usar "." como separador de miles y "," como
  // decimal (ej. "150.000,50") — si hay ambos, el último separador manda.
  const normalized =
    cleaned.includes(",") && cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned.replace(/,/g, "");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : undefined;
}

function parseCurrency(raw: string): "ARS" | "USD" | undefined {
  const value = raw.toUpperCase();
  if (value.includes("USD") || value.includes("U$S") || value.includes("US$")) return "USD";
  if (value.includes("ARS") || value.includes("$")) return "ARS";
  return undefined;
}

function parseIntField(raw: string): number | undefined {
  const num = parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(num) ? num : undefined;
}

function parseFloatField(raw: string): number | undefined {
  const num = Number(raw.replace(/[^\d.,]/g, "").replace(",", "."));
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

function parseImageUrls(raw: string): string[] {
  return raw
    .split(/[|;\s]+/)
    .map((url) => url.trim())
    .filter((url) => url.startsWith("http"));
}

export async function importPropertiesFromCsv(csvText: string): Promise<ImportSummary> {
  const session = await getSession();
  if (!session) throw new Error("No autorizado.");

  const neighborhoods = await prisma.neighborhood.findMany();
  const normalizedNeighborhoods = neighborhoods.map((n) => ({
    id: n.id,
    normalizedName: n.name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(),
  }));

  function matchNeighborhood(zoneText: string): string | null {
    const value = zoneText.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const match = normalizedNeighborhoods.find((n) => value.includes(n.normalizedName));
    return match?.id ?? null;
  }

  const rows = csvToRecords(parseCsv(csvText));
  const results: ImportRowResult[] = [];
  const existingSlugs = new Set((await prisma.property.findMany({ select: { slug: true } })).map((p) => p.slug));

  for (let i = 0; i < rows.length; i++) {
    const record = rows[i];
    const rowNumber = i + 2; // +1 por header, +1 porque los usuarios cuentan desde 1
    const title = findField(record, "title").trim();

    if (!title) {
      results.push({ row: rowNumber, title: "(sin título)", status: "skipped", reason: "Falta la columna título." });
      continue;
    }

    const operationType = parseOperationType(findField(record, "operationType"));
    if (!operationType) {
      results.push({ row: rowNumber, title, status: "skipped", reason: "No se pudo interpretar la operación (venta/alquiler)." });
      continue;
    }

    const propertyType = parsePropertyType(findField(record, "propertyType"));
    if (!propertyType) {
      results.push({ row: rowNumber, title, status: "skipped", reason: "No se pudo interpretar el tipo de propiedad." });
      continue;
    }

    const zoneText = findField(record, "zone");
    const neighborhoodId = matchNeighborhood(zoneText);
    if (!neighborhoodId) {
      results.push({
        row: rowNumber,
        title,
        status: "skipped",
        reason: `No se encontró una zona que coincida con "${zoneText || "(vacío)"}". Cargar a mano o agregar la zona al sitio primero.`,
      });
      continue;
    }

    let slug = slugify(title);
    if (!slug) slug = `propiedad-${rowNumber}`;
    let uniqueSlug = slug;
    let suffix = 2;
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${suffix}`;
      suffix++;
    }
    existingSlugs.add(uniqueSlug);

    const sourceUrl = findField(record, "sourceUrl") || undefined;
    const imageUrls = parseImageUrls(findField(record, "imageUrls"));
    const totalArea = parseFloatField(findField(record, "area"));

    try {
      await prisma.property.create({
        data: {
          title,
          slug: uniqueSlug,
          description: `${title}. Publicación importada — pendiente de revisión y descripción definitiva.${
            sourceUrl ? ` Publicación original: ${sourceUrl}` : ""
          }`,
          operationType,
          propertyType,
          price: parsePrice(findField(record, "price")),
          currency: parseCurrency(findField(record, "currency")) ?? parseCurrency(findField(record, "price")),
          totalArea,
          rooms: parseIntField(findField(record, "rooms")),
          bedrooms: parseIntField(findField(record, "bedrooms")),
          bathrooms: parseIntField(findField(record, "bathrooms")),
          isSample: false,
          needsReview: true,
          sourceUrl,
          publishedAt: new Date(),
          agent: { connect: { id: session.agentId } },
          location: {
            create: {
              address: zoneText || null,
              neighborhoodId,
            },
          },
          images: {
            create: imageUrls.map((url, index) => ({ url, order: index, isCover: index === 0 })),
          },
        },
      });
      results.push({ row: rowNumber, title, status: "created" });
    } catch (error) {
      results.push({
        row: rowNumber,
        title,
        status: "skipped",
        reason: error instanceof Error ? error.message : "Error desconocido al crear la propiedad.",
      });
    }
  }

  revalidatePath("/admin/properties");

  return {
    total: rows.length,
    created: results.filter((r) => r.status === "created").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    results,
  };
}
