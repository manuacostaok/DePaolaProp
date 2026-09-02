"use client";

import { useEffect, useState } from "react";
import { PropertyType, PropertyCondition } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { PROPERTY_TYPE_OPTIONS, CONDITION_OPTIONS } from "@/lib/property-options";
import { trackEvent } from "@/lib/analytics";
import { submitValuation, scheduleValuationAppointment, type ValuationSubmission } from "@/app/vender/tasacion/actions";

type FormState = {
  neighborhoodId: string;
  propertyType: PropertyType | "";
  coveredArea: string;
  totalArea: string;
  rooms: string;
  condition: PropertyCondition | "";
  hasGarage: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

const INITIAL_STATE: FormState = {
  neighborhoodId: "",
  propertyType: "",
  coveredArea: "",
  totalArea: "",
  rooms: "",
  condition: "",
  hasGarage: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

const STEP_LABELS = ["Ubicación", "Dimensiones", "Estado", "Contacto"];

type ResultState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "range"; leadId: string; min: number; max: number }
  | { status: "no-comparables"; leadId: string }
  | { status: "scheduled" }
  | { status: "confirmed" }
  | { status: "error" };

export function TasacionWizard({
  neighborhoodOptions,
  initialNeighborhoodId,
  initialPropertyType,
}: {
  neighborhoodOptions: { value: string; label: string }[];
  initialNeighborhoodId?: string;
  initialPropertyType?: PropertyType;
}) {
  const prefilled = Boolean(initialNeighborhoodId && initialPropertyType);
  const [step, setStep] = useState(prefilled ? 2 : 1);
  const [form, setForm] = useState<FormState>({
    ...INITIAL_STATE,
    neighborhoodId: initialNeighborhoodId ?? "",
    propertyType: initialPropertyType ?? "",
  });
  const [result, setResult] = useState<ResultState>({ status: "idle" });

  useEffect(() => {
    trackEvent("valuation_start");
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canAdvanceStep1 = form.neighborhoodId !== "" && form.propertyType !== "";
  const canAdvanceStep2 = form.coveredArea !== "";
  const canAdvanceStep3 = form.condition !== "" && form.hasGarage !== "";
  const canSubmit = form.contactName.trim() !== "" && form.contactPhone.trim() !== "";

  async function handleSubmit() {
    setResult({ status: "submitting" });

    const payload: ValuationSubmission = {
      neighborhoodId: form.neighborhoodId,
      propertyType: form.propertyType as PropertyType,
      coveredArea: Number(form.coveredArea),
      totalArea: form.totalArea ? Number(form.totalArea) : undefined,
      rooms: form.rooms ? Number(form.rooms) : undefined,
      condition: form.condition as PropertyCondition,
      hasGarage: form.hasGarage === "si",
      contactName: form.contactName,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail || undefined,
    };

    try {
      const response = await submitValuation(payload);
      trackEvent("valuation_submit", { hasEnoughComparables: response.hasEnoughComparables });
      trackEvent("lead_created", { leadId: response.leadId, type: "TASAR" });

      if (response.hasEnoughComparables && response.estimatedMin != null && response.estimatedMax != null) {
        setResult({ status: "range", leadId: response.leadId, min: response.estimatedMin, max: response.estimatedMax });
      } else {
        setResult({ status: "no-comparables", leadId: response.leadId });
      }
    } catch {
      setResult({ status: "error" });
    }
  }

  if (result.status === "error") {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <p className="mb-4 text-ink-soft">
          Algo falló al enviar tu consulta. Podés escribirnos directo por WhatsApp mientras lo resolvemos.
        </p>
        <Button onClick={() => setResult({ status: "idle" })}>Reintentar</Button>
      </div>
    );
  }

  if (result.status === "range") {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Estimación automática</p>
        <p className="mb-4 font-display text-3xl text-brand-dark">
          USD {result.min.toLocaleString("es-AR")} – USD {result.max.toLocaleString("es-AR")}
        </p>
        <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">
          Esta es una estimación automática calculada con propiedades comparables — un agente de De Paola puede
          afinarla con una visita presencial.
        </p>
        {result.status === "range" && "leadId" in result && (
          <ConfirmInterestButton confirmed={false} />
        )}
      </div>
    );
  }

  if (result.status === "no-comparables") {
    return <NoComparablesResult leadId={result.leadId} />;
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 sm:p-8">
      <div className="mb-8 flex items-center gap-2">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`h-1.5 w-full rounded-full ${stepNumber <= step ? "bg-brand" : "bg-line"}`}
              />
              <span className={`text-[11px] ${stepNumber === step ? "font-semibold text-brand-dark" : "text-ink-soft"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Zona"
            placeholder="Elegí una zona"
            options={neighborhoodOptions}
            value={form.neighborhoodId}
            onChange={(e) => update("neighborhoodId", e.target.value)}
          />
          <Select
            label="Tipo de propiedad"
            placeholder="Elegí un tipo"
            options={PROPERTY_TYPE_OPTIONS}
            value={form.propertyType}
            onChange={(e) => update("propertyType", e.target.value as PropertyType)}
          />
        </div>
      )}

      {step === 2 && prefilled && (
        <Callout>Ya cargamos la zona y el tipo de propiedad que nos dejaste en el paso anterior.</Callout>
      )}

      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Superficie cubierta (m²)"
            type="number"
            min={0}
            value={form.coveredArea}
            onChange={(e) => update("coveredArea", e.target.value)}
          />
          <Input
            label="Superficie total (m²)"
            type="number"
            min={0}
            value={form.totalArea}
            onChange={(e) => update("totalArea", e.target.value)}
          />
          <Input label="Ambientes" type="number" min={0} value={form.rooms} onChange={(e) => update("rooms", e.target.value)} />
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Estado general"
            placeholder="Elegí un estado"
            options={CONDITION_OPTIONS}
            value={form.condition}
            onChange={(e) => update("condition", e.target.value as PropertyCondition)}
          />
          <Select
            label="Cochera"
            placeholder="¿Tiene cochera?"
            options={[
              { value: "si", label: "Sí" },
              { value: "no", label: "No" },
            ]}
            value={form.hasGarage}
            onChange={(e) => update("hasGarage", e.target.value)}
          />
        </div>
      )}

      {step === 4 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Nombre" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
          <Input
            label="Teléfono / WhatsApp"
            type="tel"
            value={form.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value)}
          />
          <Input
            label="Email (opcional)"
            type="email"
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
          />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Atrás
        </Button>
        {step < 4 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={(step === 1 && !canAdvanceStep1) || (step === 2 && !canAdvanceStep2) || (step === 3 && !canAdvanceStep3)}
          >
            Siguiente
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit || result.status === "submitting"}>
            {result.status === "submitting" ? "Enviando…" : "Ver estimación"}
          </Button>
        )}
      </div>
    </div>
  );
}

function ConfirmInterestButton({ confirmed }: { confirmed: boolean }) {
  const [done, setDone] = useState(confirmed);
  if (done) {
    return <p className="font-medium text-success">¡Listo! Un agente de De Paola te va a contactar.</p>;
  }
  return <Button onClick={() => setDone(true)}>Quiero una tasación profesional</Button>;
}

function formatDateInput(value: string) {
  // Evita el corrimiento de un día que da `new Date("YYYY-MM-DD")` al
  // interpretarse como UTC y mostrarse en una zona horaria más atrasada.
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function NoComparablesResult({ leadId }: { leadId: string }) {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSchedule() {
    setSubmitting(true);
    await scheduleValuationAppointment({ leadId, preferredDate: date, preferredTimeSlot: slot });
    trackEvent("visit_request", { leadId, type: "tasacion" });
    setSubmitting(false);
    setScheduled(true);
  }

  return (
    <div className="rounded-card border border-line bg-white p-8">
      <Callout>
        Todavía no tenemos suficientes datos en esta zona para una estimación automática. Un especialista de De
        Paola te contacta con una tasación profesional.
      </Callout>

      {scheduled ? (
        <p className="font-medium text-success">
          ¡Listo! Coordinamos tu tasación para el {formatDateInput(date)} ({slot === "manana" ? "Mañana" : "Tarde"}).
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Input label="Fecha preferida" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select
            label="Franja horaria"
            placeholder="Elegí un horario"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            options={[
              { value: "manana", label: "Mañana" },
              { value: "tarde", label: "Tarde" },
            ]}
          />
          <Button onClick={handleSchedule} disabled={!date || !slot || submitting}>
            {submitting ? "Agendando…" : "Agendar visita"}
          </Button>
        </div>
      )}
    </div>
  );
}
