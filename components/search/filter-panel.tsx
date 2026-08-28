import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPE_OPTIONS, ROOMS_OPTIONS } from "@/lib/property-options";
import { getNeighborhoodOptions } from "@/lib/search";

export interface FilterPanelProps {
  basePath: string;
  showOperacion?: boolean;
  values: {
    operacion?: string;
    zona?: string;
    tipo?: string;
    moneda?: string;
    precioMin?: string;
    precioMax?: string;
    ambientes?: string;
    cochera?: string;
  };
}

export async function FilterPanel({ basePath, showOperacion = false, values }: FilterPanelProps) {
  const neighborhoodOptions = await getNeighborhoodOptions();

  return (
    <form
      method="get"
      action={basePath}
      className="mb-8 flex flex-wrap gap-3 rounded-card border border-line bg-white p-4"
    >
      {showOperacion && (
        <Select
          name="operacion"
          defaultValue={values.operacion ?? ""}
          placeholder="Operación"
          className="w-44"
          options={[
            { value: "venta", label: "Venta" },
            { value: "alquiler", label: "Alquiler" },
          ]}
        />
      )}
      <Select
        name="zona"
        defaultValue={values.zona ?? ""}
        placeholder="Zona"
        className="w-44"
        options={neighborhoodOptions}
      />
      <Select
        name="tipo"
        defaultValue={values.tipo ?? ""}
        placeholder="Tipo"
        className="w-44"
        options={PROPERTY_TYPE_OPTIONS}
      />
      <Select
        name="ambientes"
        defaultValue={values.ambientes ?? ""}
        placeholder="Ambientes"
        className="w-40"
        options={ROOMS_OPTIONS}
      />
      <Select
        name="moneda"
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
      <Button type="submit">Buscar</Button>
      {basePath && (
        <a href={basePath} className="flex items-center text-sm text-ink-soft underline">
          Limpiar filtros
        </a>
      )}
    </form>
  );
}
