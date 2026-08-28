import type { PropertyType } from "@prisma/client";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  PH: "PH",
  TERRENO: "Terreno",
  LOCAL: "Local",
  OFICINA: "Oficina",
  GALPON: "Galpón",
};

export const PROPERTY_TYPE_OPTIONS = Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const ROOMS_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+ ambientes` }));
