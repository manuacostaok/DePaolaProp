"use client";

import { useState } from "react";
import { PropertyType } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/leads/step-progress";
import { PROPERTY_TYPE_OPTIONS, ROOMS_OPTIONS } from "@/lib/property-options";
import { createLead } from "@/lib/leads";

const STEPS = ["Zona y tipo", "Presupuesto", "Contacto"];

export function AlquilarWizard({ neighborhoodOptions }: { neighborhoodOptions: { value: string; label: string }[] }) {
  const [step, setStep] = useState(1);
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [rooms, setRooms] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guarantee, setGuarantee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await createLead({
      type: "ALQUILAR",
      contactName: name,
      contactPhone: phone,
      neighborhoodId: neighborhoodId || undefined,
      filtersJson: { propertyType, budgetMin, budgetMax, rooms, guarantee },
    });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-center font-medium text-success">
        ¡Listo! Un agente de De Paola va a revisar tu búsqueda y contactarte apenas tengamos algo que matchee.
      </p>
    );
  }

  return (
    <div>
      <StepProgress labels={STEPS} current={step} />

      {step === 1 && (
        <div className="grid gap-5">
          <Select
            label="Zona de interés"
            placeholder="Elegí una zona"
            value={neighborhoodId}
            onChange={(e) => setNeighborhoodId(e.target.value)}
            options={[{ value: "", label: "Todas las zonas" }, ...neighborhoodOptions]}
          />
          <Select
            label="Tipo de propiedad"
            placeholder="Elegí un tipo"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            options={PROPERTY_TYPE_OPTIONS}
          />
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Presupuesto mínimo (USD)" type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
          <Input label="Presupuesto máximo (USD)" type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
          <Select label="Ambientes" placeholder="Elegí ambientes" value={rooms} onChange={(e) => setRooms(e.target.value)} options={ROOMS_OPTIONS} />
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-5">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="WhatsApp o email" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Select
            label="¿Con o sin garantía propietaria?"
            placeholder="Elegí una opción"
            value={guarantee}
            onChange={(e) => setGuarantee(e.target.value)}
            options={[
              { value: "con", label: "Con garantía propietaria" },
              { value: "sin", label: "Sin garantía propietaria" },
            ]}
          />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Atrás
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={(step === 1 && !propertyType) || (step === 2 && !budgetMin)}>
            Siguiente
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={!name || !phone || submitting}>
            {submitting ? "Enviando…" : "Enviar"}
          </Button>
        )}
      </div>
    </div>
  );
}
