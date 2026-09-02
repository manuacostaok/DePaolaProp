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

export type PropertyOrder = "recientes" | "precio_asc" | "precio_desc" | "superficie";

export const ORDER_SELECT_OPTIONS: { value: PropertyOrder; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "superficie", label: "Superficie" },
];
