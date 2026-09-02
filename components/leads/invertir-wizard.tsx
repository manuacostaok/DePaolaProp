"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { StepProgress } from "@/components/leads/step-progress";
import { createLead } from "@/lib/leads";
import { splitContactInput } from "@/lib/contact-input";
import { trackEvent } from "@/lib/analytics";
import { SITE } from "@/lib/nav";

const STEPS = ["Inversión", "Zona", "Contacto"];

const INVESTMENT_TYPES = [
  { value: "renta", label: "Renta (alquilar para generar ingresos)" },
  { value: "reventa", label: "Reventa (comprar, refaccionar, vender)" },
  { value: "desarrollo", label: "Desarrollo / pozo" },
];

export function InvertirWizard({ neighborhoodOptions }: { neighborhoodOptions: { value: string; label: string }[] }) {
  const [step, setStep] = useState(1);
  const [investmentType, setInvestmentType] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const { leadId } = await createLead({
      type: "INVERTIR",
      contactName: name,
      ...splitContactInput(contact),
      neighborhoodId: neighborhoodId || undefined,
      filtersJson: { investmentType, budgetMin, budgetMax },
    });
    trackEvent("lead_created", { leadId, type: "INVERTIR" });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <p className="mb-4 font-medium text-success">
          ¡Listo! Un agente especializado en inversión de De Paola te va a contactar para conversar en detalle.
        </p>
        <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp" })}>
          Hablar ahora por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 sm:p-8">
      <StepProgress labels={STEPS} current={step} />

      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Tipo de inversión"
            placeholder="Elegí una opción"
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value)}
            options={INVESTMENT_TYPES}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Presupuesto mín. (USD)" type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
            <Input label="Presupuesto máx. (USD)" type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
          </div>
        </div>
      )}

      {step === 2 && (
        <Select
          label="Zona de interés"
          placeholder="Elegí una zona"
          value={neighborhoodId}
          onChange={(e) => setNeighborhoodId(e.target.value)}
          options={[{ value: "", label: "Abierto a recomendación" }, ...neighborhoodOptions]}
        />
      )}

      {step === 3 && (
        <div className="grid gap-5">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email o WhatsApp" value={contact} onChange={(e) => setContact(e.target.value)} />
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Atrás
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={step === 1 && !investmentType}>
            Siguiente
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={!name || !contact || submitting}>
            {submitting ? "Enviando…" : "Enviar"}
          </Button>
        )}
      </div>
    </div>
  );
}
