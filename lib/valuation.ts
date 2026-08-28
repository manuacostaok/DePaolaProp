import { PropertyType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Mínimo de comparables para animarnos a mostrar un rango automático.
// Regla simple (promedio ± desvío) — nada de IA todavía (Fase 5, sección 5).
const MIN_COMPARABLES = 3;
const SURFACE_TOLERANCE = 0.25;

export interface ValuationInput {
  neighborhoodId: string;
  propertyType: PropertyType;
  coveredArea: number;
}

export interface ValuationResult {
  hasEnoughComparables: boolean;
  estimatedMin: number | null;
  estimatedMax: number | null;
  currency: "USD" | null;
  comparablesCount: number;
}

export async function estimateValuation(input: ValuationInput): Promise<ValuationResult> {
  const min = input.coveredArea * (1 - SURFACE_TOLERANCE);
  const max = input.coveredArea * (1 + SURFACE_TOLERANCE);

  const comparables = await prisma.property.findMany({
    where: {
      propertyType: input.propertyType,
      operationType: "VENTA",
      currency: "USD",
      price: { not: null },
      coveredArea: { gte: min, lte: max },
      location: { neighborhoodId: input.neighborhoodId },
    },
    select: { price: true },
  });

  if (comparables.length < MIN_COMPARABLES) {
    return { hasEnoughComparables: false, estimatedMin: null, estimatedMax: null, currency: null, comparablesCount: comparables.length };
  }

  const prices = comparables.map((c) => Number(c.price));
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + (p - mean) ** 2, 0) / prices.length;
  const stddev = Math.sqrt(variance);

  const round = (n: number) => Math.max(0, Math.round(n / 1000) * 1000);

  return {
    hasEnoughComparables: true,
    estimatedMin: round(mean - stddev),
    estimatedMax: round(mean + stddev),
    currency: "USD",
    comparablesCount: comparables.length,
  };
}
