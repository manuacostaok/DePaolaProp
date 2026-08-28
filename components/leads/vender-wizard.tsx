"use client";

import { useState } from "react";
import Link from "next/link";
import { PropertyType } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { StepProgress } from "@/components/leads/step-progress";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/property-options";
import { createLead } from "@/lib/leads";

const STEPS = ["Propiedad", "¿Sabés el valor?", "Contacto"];

export function VenderWizard({ neighborhoodOptions }: { neighborhoodOptions: { value: string; label: string }[] }) {
  const [step, setStep] = useState(1);
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [knowsValue, setKnowsValue] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await createLead({
      type: "VENDER",
      contactName: name,
      contactPhone: phone,
      neighborhoodId: neighborhoodId || undefined,
      filtersJson: { propertyType, availability },
    });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-center font-medium text-success">
        ¡Listo! Un agente de De Paola te va a contactar en las próximas horas hábiles.
      </p>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 sm:p-8">
      <StepProgress labels={STEPS} current={step} />

      {step === 1 && (
        <div className="grid gap-5">
          <Select
            label="Zona de la propiedad"
            placeholder="Elegí una zona"
            value={neighborhoodId}
            onChange={(e) => setNeighborhoodId(e.target.value)}
            options={neighborhoodOptions}
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
        <div>
          <Select
            label="¿Ya sabés cuánto vale tu propiedad?"
            placeholder="Elegí una opción"
            value={knowsValue}
            onChange={(e) => setKnowsValue(e.target.value)}
            options={[
              { value: "si", label: "Sí, ya lo sé" },
              { value: "no", label: "No, quiero una estimación" },
            ]}
          />
          {knowsValue === "no" && (
            <div className="mt-5 rounded-control border border-dashed border-[#9FB6AC] bg-brand-tint p-4 text-sm text-brand-dark">
              <p className="mb-3">
                Te llevamos directo a la tasación con la zona y el tipo de propiedad que ya nos dejaste.
              </p>
              <Link
                href={`/vender/tasacion?neighborhoodId=${neighborhoodId}&propertyType=${propertyType}`}
                className={buttonVariants({ size: "sm" })}
              >
                Ir a la tasación
              </Link>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-5">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Teléfono / WhatsApp" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Select
            label="Disponibilidad para que te contactemos"
            placeholder="Elegí una franja"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            options={[
              { value: "manana", label: "Mañana" },
              { value: "tarde", label: "Tarde" },
              { value: "cualquiera", label: "Cualquier horario" },
            ]}
          />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Atrás
        </Button>
        {step === 2 && knowsValue === "si" && (
          <Button type="button" onClick={() => setStep(3)}>
            Siguiente
          </Button>
        )}
        {step === 1 && (
          <Button type="button" onClick={() => setStep(2)} disabled={!neighborhoodId || !propertyType}>
            Siguiente
          </Button>
        )}
        {step === 3 && (
          <Button type="button" onClick={handleSubmit} disabled={!name || !phone || !availability || submitting}>
            {submitting ? "Enviando…" : "Enviar"}
          </Button>
        )}
      </div>
    </div>
  );
}
