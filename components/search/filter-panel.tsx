import { Button } from "@/components/ui/button";
import { getNeighborhoodOptions, getFeatureOptions } from "@/lib/search";
import { FilterFields, type FilterFieldsProps } from "@/components/search/filter-fields";
import { FilterPanelMobile } from "@/components/search/filter-panel-mobile";

export interface FilterPanelProps {
  basePath: string;
  showOperacion?: boolean;
  showZona?: boolean;
  values: FilterFieldsProps["values"];
}

function countActiveFilters(values: FilterFieldsProps["values"], showOperacion: boolean, showZona: boolean) {
  let count = 0;
  if (showOperacion && values.operacion) count++;
  if (showZona && values.zona) count++;
  if (values.tipo) count++;
  if (values.ambientes) count++;
  if (values.precioMin) count++;
  if (values.precioMax) count++;
  if (values.cochera === "1") count++;
  count += Array.isArray(values.caracteristicas) ? values.caracteristicas.length : values.caracteristicas ? 1 : 0;
  return count;
}

export async function FilterPanel({ basePath, showOperacion = false, showZona = true, values }: FilterPanelProps) {
  const [neighborhoodOptions, featureOptions] = await Promise.all([getNeighborhoodOptions(), getFeatureOptions()]);
  const activeCount = countActiveFilters(values, showOperacion, showZona);
  const fieldsProps: FilterFieldsProps = { showOperacion, showZona, values, neighborhoodOptions, featureOptions };

  return (
    <>
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
