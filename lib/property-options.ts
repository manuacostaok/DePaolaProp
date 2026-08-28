import type { PropertyType, PropertyCondition } from "@prisma/client";

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

export const CONDITION_OPTIONS: { value: PropertyCondition; label: string }[] = [
  { value: "A_ESTRENAR", label: "A estrenar" },
  { value: "MUY_BUENO", label: "Muy bueno" },
  { value: "BUENO", label: "Bueno" },
  { value: "A_REFACCIONAR", label: "A refaccionar" },
];
