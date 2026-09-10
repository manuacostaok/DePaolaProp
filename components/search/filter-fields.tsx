import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { PROPERTY_TYPE_OPTIONS, ROOMS_OPTIONS } from "@/lib/property-options";

export interface FilterFieldsProps {
  showOperacion: boolean;
  showZona: boolean;
  showTipo?: boolean;
  // Ambientes/Cochera no tienen sentido de negocio para categorías
  // industriales (galpones) — se ocultan del filtro cuando el tipo ya
  // viene fijo a Galpón, no solo de las specs de la card/detalle.
  showResidentialFields?: boolean;
  values: {
    operacion?: string;
    zona?: string;
    tipo?: string;
    moneda?: string;
    precioMin?: string;
    precioMax?: string;
    ambientes?: string;
    cochera?: string;
    caracteristicas?: string | string[];
  };
  neighborhoodOptions: { value: string; label: string }[];
  featureOptions: { value: string; label: string }[];
}

const OPERACION_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "venta", label: "Comprar" },
  { value: "alquiler", label: "Alquilar" },
];

// Los campos del formulario de filtros, compartidos entre la versión
// desktop (siempre visible) y la versión mobile (colapsada en un Drawer,
// ver filter-panel-mobile.tsx) — un solo lugar con los inputs reales para
// que no puedan divergir entre ambas versiones. Agrupa los campos en dos
// niveles de peso visual: Operación/Zona lideran (la decisión real de
// "qué estoy buscando y dónde"), el resto queda como afinado secundario.
export function FilterFields({
  showOperacion,
  showZona,
  showTipo = true,
  showResidentialFields = true,
  values,
  neighborhoodOptions,
  featureOptions,
}: FilterFieldsProps) {
  const selectedFeatures = Array.isArray(values.caracteristicas)
    ? values.caracteristicas
    : values.caracteristicas
      ? [values.caracteristicas]
      : [];

  return (
    <>
      {(showOperacion || showZona) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {showOperacion && (
            <div className="inline-flex w-fit rounded-control border border-line bg-bg-alt/60 p-1">
              {OPERACION_OPTIONS.map((option) => {
                const checked = (values.operacion ?? "") === option.value;
                return (
                  <label
                    key={option.value || "todas"}
                    className={cn(
                      "cursor-pointer rounded-[3px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                      checked ? "bg-brand text-white" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name="operacion"
                      value={option.value}
                      defaultChecked={checked}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          )}
          {showZona && (
            <Select
              name="zona"
              aria-label="Zona"
              uiSize="lg"
              defaultValue={values.zona ?? ""}
              placeholder="Zona"
              className="sm:w-56"
              options={neighborhoodOptions}
            />
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-wrap items-center gap-2.5",
          (showOperacion || showZona) && "border-t border-line/60 pt-4",
        )}
      >
        {showTipo && (
          <Select
            name="tipo"
            aria-label="Tipo de propiedad"
            defaultValue={values.tipo ?? ""}
            placeholder="Tipo"
            className="w-40"
            options={PROPERTY_TYPE_OPTIONS}
          />
        )}
        {showResidentialFields && (
          <Select
            name="ambientes"
            aria-label="Ambientes"
            defaultValue={values.ambientes ?? ""}
            placeholder="Ambientes"
            className="w-36"
            options={ROOMS_OPTIONS}
          />
        )}
        <Select
          name="moneda"
          aria-label="Moneda"
          defaultValue={values.moneda ?? "USD"}
          className="w-24"
          options={[
            { value: "USD", label: "USD" },
            { value: "ARS", label: "ARS" },
          ]}
        />
        <Input name="precioMin" type="number" min={0} placeholder="Precio mín." defaultValue={values.precioMin} className="w-28" />
        <Input name="precioMax" type="number" min={0} placeholder="Precio máx." defaultValue={values.precioMax} className="w-28" />
        {showResidentialFields && (
          <label className="flex items-center gap-2 rounded-control border border-line/70 px-3 py-2 text-[13.5px] text-ink-soft">
            <input type="checkbox" name="cochera" value="1" defaultChecked={values.cochera === "1"} />
            Cochera
          </label>
        )}
        {featureOptions.length > 0 && (
          <fieldset className="m-0 flex flex-wrap gap-2.5 border-0 p-0">
            <legend className="sr-only">Características</legend>
            {featureOptions.map((feature) => (
              <label
                key={feature.value}
                className="flex items-center gap-2 rounded-control border border-line/70 px-3 py-2 text-[13.5px] text-ink-soft"
              >
                <input
                  type="checkbox"
                  name="caracteristicas"
                  value={feature.value}
                  defaultChecked={selectedFeatures.includes(feature.value)}
                />
                {feature.label}
              </label>
            ))}
          </fieldset>
        )}
      </div>
    </>
  );
}
