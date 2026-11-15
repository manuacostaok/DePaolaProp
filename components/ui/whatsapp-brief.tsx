"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

// Consulta guiada a WhatsApp: tres preguntas con botones grandes (pensadas
// para el pulgar) y un último paso con el nombre. Arma el mensaje con lo
// elegido y abre WhatsApp. No crea un Lead en la base — para eso están los
// wizards de Comprar/Alquilar/Vender; esto es el camino corto de quien
// prefiere escribir directo.

const STEPS = [
  {
    key: "accion",
    question: "¿Qué querés hacer?",
    options: ["Comprar", "Alquilar", "Vender o tasar", "Invertir"],
  },
  {
    key: "zona",
    question: "¿En qué zona?",
    options: ["Villa Martelli", "Florida", "Martínez", "Vicente López", "Otra zona de Zona Norte"],
  },
  {
    key: "tipo",
    question: "¿Qué tipo de propiedad?",
    options: ["Casa", "Departamento", "PH", "Local o galpón"],
  },
] as const;

type Answers = Partial<Record<(typeof STEPS)[number]["key"], string>>;

export function buildBrief(answers: Answers, name: string) {
  const who = name.trim() ? `Hola, soy ${name.trim()}.` : "Hola.";
  const accion = (answers.accion ?? "consultar").toLowerCase();
  const zona = answers.zona ? ` en ${answers.zona}` : " en Zona Norte";
  const tipo = answers.tipo ? ` (${answers.tipo.toLowerCase()})` : "";
  return `${who} Quiero ${accion}${zona}${tipo}. ¿Podemos hablar?`;
}

export function WhatsAppBrief({ whatsapp }: { whatsapp: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const total = STEPS.length + 1;
  const finalStep = step === STEPS.length;
  const href = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(buildBrief(answers, name))}`;

  function choose(value: string) {
    const current = STEPS[step];
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    window.setTimeout(() => setStep((s) => s + 1), 160);
  }

  function send() {
    trackEvent("whatsapp_click", { source: "home_brief" });
    setSent(true);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <div>
        <p className="mb-3 font-display text-[clamp(28px,4.4vw,44px)] leading-[1.1] text-ink">Contanos qué buscás.</p>
        <p className="max-w-[36ch] text-[15px] text-ink-soft">
          Tres toques y te escribimos por WhatsApp con lo que elegiste ya cargado — sin formularios largos.
        </p>
        <div className="mt-6 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn("h-[3px] flex-1 origin-left rounded-full transition-colors duration-500", sent || i <= step ? "bg-brand" : "bg-ink/15")}
            />
          ))}
        </div>
      </div>

      <div aria-live="polite" className="min-h-[250px] lg:min-h-[300px]">
        {sent ? (
          <div className="animate-fade-up motion-reduce:animate-none">
            <svg viewBox="0 0 64 64" className="mb-4 size-14 text-brand" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="32" cy="32" r="27" pathLength={1} className="brief-draw" />
              <path d="M20 33 L29 42 L45 24" pathLength={1} className="brief-draw brief-draw-delay" />
            </svg>
            <p className="mb-2 font-display text-[28px] text-ink">¡Listo! Te abrimos WhatsApp.</p>
            <p className="mb-5 max-w-[40ch] text-[15px] text-ink-soft">
              Si no se abrió solo, tocá el botón. Escribinos el mensaje tal cual está o cambialo — alguien del equipo te responde.
            </p>
            <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-dark underline underline-offset-4">
              Abrir WhatsApp de nuevo
            </a>
          </div>
        ) : (
          <div key={step} className="animate-fade-up motion-reduce:animate-none">
            {!finalStep ? (
              <>
                <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.12em] text-brand">{STEPS[step].question}</p>
                <div className="flex flex-wrap gap-3">
                  {STEPS[step].options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(option)}
                      className={cn(
                        "min-h-12 rounded-pill border px-5 py-3 text-[15px] font-medium transition-[transform,background-color,color,border-color] duration-150 active:scale-[0.95]",
                        answers[STEPS[step].key] === option
                          ? "border-brand bg-brand text-white"
                          : "border-ink/25 text-ink hover:border-brand hover:bg-brand-tint hover:text-brand-dark",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.12em] text-brand">Último paso</p>
                <label htmlFor="brief-name" className="mb-2 block text-[15px] text-ink">
                  ¿Cómo te llamás? <span className="text-ink-soft">(opcional)</span>
                </label>
                <input
                  id="brief-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  className="mb-5 w-full max-w-sm rounded-control border border-line bg-white px-4 py-3 text-[16px] outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint"
                />
                <p className="mb-6 max-w-[44ch] rounded-control bg-brand-tint px-4 py-3 text-[14.5px] text-brand-dark">{buildBrief(answers, name)}</p>
                <button
                  type="button"
                  onClick={send}
                  className="inline-flex min-h-12 items-center justify-center rounded-pill bg-whatsapp px-6 py-3 text-[15px] font-semibold text-white transition-transform duration-150 active:scale-[0.96]"
                >
                  Abrir WhatsApp
                </button>
              </>
            )}
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-6 block text-[14px] text-ink-soft underline underline-offset-4">
                Volver
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
