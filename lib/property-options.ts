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

export type PropertyOrder =
  | "recientes"
  | "antiguas"
  | "precio_asc"
  | "precio_desc"
  | "superficie_asc"
  | "superficie_desc";

// El competidor (anasimeone.com) separa "superficie total" de "superficie
// terreno" — Property acá solo distingue coveredArea/totalArea, y
// totalArea está null en el 100% del inventario activo hoy (verificado
// contra producción). Ordenar por coveredArea es lo único que hoy separa
// resultados de verdad; agregar un segundo criterio de superficie sería
// una opción que no ordena nada con los datos reales actuales.
export const ORDER_SELECT_OPTIONS: { value: PropertyOrder; label: string }[] = [
  { value: "recientes", label: "Publicaciones más recientes" },
  { value: "antiguas", label: "Publicaciones más antiguas" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "precio_asc", label: "Menor precio" },
  { value: "superficie_desc", label: "Mayor superficie" },
  { value: "superficie_asc", label: "Menor superficie" },
];
