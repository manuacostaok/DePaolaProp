import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPE_OPTIONS, ROOMS_OPTIONS } from "@/lib/property-options";
import { getNeighborhoodOptions, getFeatureOptions } from "@/lib/search";

export interface FilterPanelProps {
  basePath: string;
  showOperacion?: boolean;
  showZona?: boolean;
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
}

export async function FilterPanel({ basePath, showOperacion = false, showZona = true, values }: FilterPanelProps) {
  const [neighborhoodOptions, featureOptions] = await Promise.all([getNeighborhoodOptions(), getFeatureOptions()]);
  const selectedFeatures = Array.isArray(values.caracteristicas)
    ? values.caracteristicas
    : values.caracteristicas
      ? [values.caracteristicas]
      : [];

  return (
    <form
      method="get"
      action={basePath}
      className="mb-8 flex flex-wrap gap-3 rounded-card border border-line bg-white p-4"
    >
      {showOperacion && (
        <Select
          name="operacion"
          aria-label="Operación"
          defaultValue={values.operacion ?? ""}
          placeholder="Operación"
          className="w-44"
          options={[
            { value: "venta", label: "Venta" },
            { value: "alquiler", label: "Alquiler" },
          ]}
        />
      )}
      {showZona && (
        <Select
          name="zona"
          aria-label="Zona"
          defaultValue={values.zona ?? ""}
          placeholder="Zona"
          className="w-44"
          options={neighborhoodOptions}
        />
      )}
      <Select
        name="tipo"
        aria-label="Tipo de propiedad"
        defaultValue={values.tipo ?? ""}
        placeholder="Tipo"
        className="w-44"
        options={PROPERTY_TYPE_OPTIONS}
      />
      <Select
        name="ambientes"
        aria-label="Ambientes"
        defaultValue={values.ambientes ?? ""}
        placeholder="Ambientes"
        className="w-40"
        options={ROOMS_OPTIONS}
      />
      <Select
        name="moneda"
        aria-label="Moneda"
        defaultValue={values.moneda ?? "USD"}
        className="w-28"
        options={[
          { value: "USD", label: "USD" },
          { value: "ARS", label: "ARS" },
        ]}
      />
      <Input name="precioMin" type="number" min={0} placeholder="Precio mín." defaultValue={values.precioMin} className="w-32" />
      <Input name="precioMax" type="number" min={0} placeholder="Precio máx." defaultValue={values.precioMax} className="w-32" />
      <label className="flex items-center gap-2 rounded-control border border-line px-3.5 py-2.5 text-sm text-ink">
        <input type="checkbox" name="cochera" value="1" defaultChecked={values.cochera === "1"} />
        Cochera
      </label>
      {featureOptions.length > 0 && (
        <fieldset className="m-0 flex flex-wrap gap-3 border-0 p-0">
          <legend className="sr-only">Características</legend>
          {featureOptions.map((feature) => (
            <label
              key={feature.value}
              className="flex items-center gap-2 rounded-control border border-line px-3.5 py-2.5 text-sm text-ink"
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
      <Button type="submit">Buscar</Button>
      {basePath && (
        <a href={basePath} className="flex items-center text-sm text-ink-soft underline">
          Limpiar filtros
        </a>
      )}
    </form>
  );
}
