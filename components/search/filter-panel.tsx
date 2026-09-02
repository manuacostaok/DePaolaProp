import { Button } from "@/components/ui/button";
import { getNeighborhoodOptions, getFeatureOptions } from "@/lib/search";
import { PROPERTY_TYPE_LABELS } from "@/lib/property-options";
import { FilterFields, type FilterFieldsProps } from "@/components/search/filter-fields";
import { FilterPanelMobile } from "@/components/search/filter-panel-mobile";
import { FilterChips, type FilterChip } from "@/components/search/filter-chips";

export interface FilterPanelProps {
  basePath: string;
  showOperacion?: boolean;
  showZona?: boolean;
  showTipo?: boolean;
  showResidentialFields?: boolean;
  values: FilterFieldsProps["values"];
}

function countActiveFilters(
  values: FilterFieldsProps["values"],
  showOperacion: boolean,
  showZona: boolean,
  showTipo: boolean,
  showResidentialFields: boolean,
) {
  let count = 0;
  if (showOperacion && values.operacion) count++;
  if (showZona && values.zona) count++;
  if (showTipo && values.tipo) count++;
  if (showResidentialFields && values.ambientes) count++;
  if (values.precioMin) count++;
  if (values.precioMax) count++;
  if (showResidentialFields && values.cochera === "1") count++;
  count += Array.isArray(values.caracteristicas) ? values.caracteristicas.length : values.caracteristicas ? 1 : 0;
  return count;
}

function buildChips(
  values: FilterFieldsProps["values"],
  showOperacion: boolean,
  showZona: boolean,
  showTipo: boolean,
  showResidentialFields: boolean,
  neighborhoodOptions: { value: string; label: string }[],
  featureOptions: { value: string; label: string }[],
): FilterChip[] {
  const chips: FilterChip[] = [];

  if (showOperacion && values.operacion) {
    chips.push({ keysToRemove: ["operacion"], label: values.operacion === "venta" ? "Venta" : "Alquiler" });
  }
  if (showZona && values.zona) {
    const zona = neighborhoodOptions.find((o) => o.value === values.zona);
    if (zona) chips.push({ keysToRemove: ["zona"], label: zona.label });
  }
  if (showTipo && values.tipo && values.tipo in PROPERTY_TYPE_LABELS) {
    chips.push({ keysToRemove: ["tipo"], label: PROPERTY_TYPE_LABELS[values.tipo as keyof typeof PROPERTY_TYPE_LABELS] });
  }
  if (showResidentialFields && values.ambientes) {
    chips.push({ keysToRemove: ["ambientes"], label: `${values.ambientes}+ ambientes` });
  }
  if (values.precioMin || values.precioMax) {
    const moneda = values.moneda ?? "USD";
    const label =
      values.precioMin && values.precioMax
        ? `${moneda} ${values.precioMin} - ${values.precioMax}`
        : values.precioMin
          ? `Desde ${moneda} ${values.precioMin}`
          : `Hasta ${moneda} ${values.precioMax}`;
    chips.push({ keysToRemove: ["precioMin", "precioMax"], label });
  }
  if (showResidentialFields && values.cochera === "1") {
    chips.push({ keysToRemove: ["cochera"], label: "Cochera" });
  }
  const selectedFeatures = Array.isArray(values.caracteristicas)
    ? values.caracteristicas
    : values.caracteristicas
      ? [values.caracteristicas]
      : [];
  for (const value of selectedFeatures) {
    const feature = featureOptions.find((o) => o.value === value);
    if (feature) chips.push({ keysToRemove: ["caracteristicas"], value, label: feature.label });
  }

  return chips;
}

export async function FilterPanel({
  basePath,
  showOperacion = false,
  showZona = true,
  showTipo = true,
  showResidentialFields = true,
  values,
}: FilterPanelProps) {
  const [neighborhoodOptions, featureOptions] = await Promise.all([getNeighborhoodOptions(), getFeatureOptions()]);
  const activeCount = countActiveFilters(values, showOperacion, showZona, showTipo, showResidentialFields);
  const fieldsProps: FilterFieldsProps = {
    showOperacion,
    showZona,
    showTipo,
    showResidentialFields,
    values,
    neighborhoodOptions,
    featureOptions,
  };
  const chips = buildChips(values, showOperacion, showZona, showTipo, showResidentialFields, neighborhoodOptions, featureOptions);

  return (
    <>
      <FilterChips basePath={basePath} chips={chips} />

      {/* Desktop: form siempre visible, sin cambios de comportamiento. */}
      <form
        method="get"
        action={basePath}
        className="mb-8 hidden flex-wrap gap-3 rounded-card border border-line bg-white p-4 sm:flex"
      >
        <FilterFields {...fieldsProps} />
        <Button type="submit">Buscar</Button>
        {basePath && (
          <a href={basePath} className="flex items-center text-sm text-ink-soft underline">
            Limpiar filtros
          </a>
        )}
      </form>

      {/* Mobile: mismos campos, colapsados en un Drawer detrás de un botón
          resumen — antes el panel entero (7+ campos) ocupaba más de una
          pantalla completa antes de llegar a los resultados. */}
      <FilterPanelMobile basePath={basePath} activeCount={activeCount}>
        <FilterFields {...fieldsProps} />
      </FilterPanelMobile>
    </>
  );
}
