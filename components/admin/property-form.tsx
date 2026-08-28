"use client";

import { useState, useTransition } from "react";
import { OperationType, PropertyType, PropertyCondition, PropertyStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPE_OPTIONS, CONDITION_OPTIONS } from "@/lib/property-options";
import { createProperty, updateProperty, deleteProperty, type PropertyFormInput } from "@/app/admin/(dashboard)/properties/actions";

export interface PropertyFormProps {
  propertyId?: string;
  initial: PropertyFormInput;
  neighborhoodOptions: { value: string; label: string }[];
  agentOptions: { value: string; label: string }[];
  officeOptions: { value: string; label: string }[];
}

const STATUS_OPTIONS = [
  { value: "ACTIVA", label: "Activa" },
  { value: "RESERVADA", label: "Reservada" },
  { value: "VENDIDA", label: "Vendida" },
  { value: "ALQUILADA", label: "Alquilada" },
  { value: "PAUSADA", label: "Pausada" },
];

export function PropertyForm({ propertyId, initial, neighborhoodOptions, agentOptions, officeOptions }: PropertyFormProps) {
  const [form, setForm] = useState<PropertyFormInput>(initial);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      if (propertyId) {
        await updateProperty(propertyId, form);
      } else {
        await createProperty(form);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Título" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        <Input label="Slug (URL)" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
      </div>

      <Textarea label="Descripción" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />

      <div className="grid gap-5 sm:grid-cols-3">
        <Select
          label="Operación"
          value={form.operationType}
          onChange={(e) => update("operationType", e.target.value as OperationType)}
          options={[
            { value: "VENTA", label: "Venta" },
            { value: "ALQUILER", label: "Alquiler" },
          ]}
        />
        <Select
          label="Tipo"
          value={form.propertyType}
          onChange={(e) => update("propertyType", e.target.value as PropertyType)}
          options={PROPERTY_TYPE_OPTIONS}
        />
        <Select
          label="Estado de publicación"
          value={form.status}
          onChange={(e) => update("status", e.target.value as PropertyStatus)}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Input label="Precio (vacío = consultar)" type="number" min={0} value={form.price} onChange={(e) => update("price", e.target.value)} />
        <Select
          label="Moneda"
          value={form.currency}
          placeholder="—"
          onChange={(e) => update("currency", e.target.value as "ARS" | "USD")}
          options={[
            { value: "USD", label: "USD" },
            { value: "ARS", label: "ARS" },
          ]}
        />
        <Select
          label="Estado de la propiedad"
          value={form.condition}
          placeholder="—"
          onChange={(e) => update("condition", e.target.value as PropertyCondition)}
          options={CONDITION_OPTIONS}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-5">
        <Input label="Sup. cubierta" type="number" min={0} value={form.coveredArea} onChange={(e) => update("coveredArea", e.target.value)} />
        <Input label="Sup. total" type="number" min={0} value={form.totalArea} onChange={(e) => update("totalArea", e.target.value)} />
        <Input label="Ambientes" type="number" min={0} value={form.rooms} onChange={(e) => update("rooms", e.target.value)} />
        <Input label="Dormitorios" type="number" min={0} value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
        <Input label="Baños" type="number" min={0} value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Zona"
          value={form.neighborhoodId}
          placeholder="Elegí una zona"
          onChange={(e) => update("neighborhoodId", e.target.value)}
          options={neighborhoodOptions}
        />
        <Input label="Dirección" value={form.address} onChange={(e) => update("address", e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Agente a cargo"
          value={form.agentId}
          placeholder="Elegí un agente"
          onChange={(e) => update("agentId", e.target.value)}
          options={agentOptions}
        />
        <Select
          label="Sucursal de origen"
          value={form.officeId}
          placeholder="—"
          onChange={(e) => update("officeId", e.target.value)}
          options={officeOptions}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.hasGarage} onChange={(e) => update("hasGarage", e.target.checked)} />
          Cochera
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
          Destacada
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.isSample} onChange={(e) => update("isSample", e.target.checked)} />
          Marcar como ejemplo (isSample)
        </label>
      </div>

      <Textarea
        label="Fotos (una URL por línea — la primera es la portada)"
        value={form.imageUrls}
        onChange={(e) => update("imageUrls", e.target.value)}
        rows={4}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Características (separadas por coma)</label>
        <Input value={form.featureLabels} onChange={(e) => update("featureLabels", e.target.value)} placeholder="Pileta, Jardín, Garage" />
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando…" : propertyId ? "Guardar cambios" : "Crear propiedad"}
        </Button>
        {propertyId && (
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Eliminar esta propiedad? No se puede deshacer.")) {
                startTransition(() => deleteProperty(propertyId));
              }
            }}
            className="text-sm text-alert underline"
          >
            Eliminar propiedad
          </button>
        )}
      </div>
    </form>
  );
}
