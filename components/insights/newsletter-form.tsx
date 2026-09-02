"use client";

import { useState, type KeyboardEvent } from "react";
import type { NewsletterSegment } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/insights/newsletter-actions";

const SEGMENTS: { value: NewsletterSegment; label: string }[] = [
  { value: "COMPRADOR", label: "Comprar" },
  { value: "VENDEDOR", label: "Vender" },
  { value: "INVERSOR", label: "Invertir" },
];

export function NewsletterForm() {
  const [segment, setSegment] = useState<NewsletterSegment | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [segmentError, setSegmentError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Roving tabindex: el grupo se navega con flechas como un radio nativo,
  // no con Tab entre cada chip (son mutuamente excluyentes).
  function handleChipKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = SEGMENTS[(index + delta + SEGMENTS.length) % SEGMENTS.length];
    setSegment(next.value);
    document.getElementById(`newsletter-segment-${next.value}`)?.focus();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSegmentError(null);
    setEmailError(null);

    if (!segment) {
      setSegmentError("Elegí qué contenido te interesa recibir.");
      return;
    }

    setStatus("submitting");
    const result = await subscribeToNewsletter({ email, segment });
    if (!result.ok) {
      setEmailError(result.error);
      setStatus("idle");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    const label = SEGMENTS.find((s) => s.value === segment)?.label.toLowerCase();
    return (
      <div className="rounded-card border border-line bg-brand-tint p-6 text-center">
        <p className="font-medium text-brand-dark">¡Listo! Te vamos a escribir con contenido de {label}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card border border-line bg-white p-6">
      <p className="mb-1 font-medium text-ink">Recibí novedades de Zona Norte</p>
      <p className="mb-4 text-sm text-ink-soft">Elegí qué contenido te interesa y te escribimos.</p>

      <div role="radiogroup" aria-label="Qué contenido te interesa" className="mb-3 flex flex-wrap gap-2">
        {SEGMENTS.map((option, index) => {
          const checked = segment === option.value;
          return (
            <button
              key={option.value}
              id={`newsletter-segment-${option.value}`}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (!segment && index === 0) ? 0 : -1}
              onClick={() => {
                setSegment(option.value);
                setSegmentError(null);
              }}
              onKeyDown={(event) => handleChipKeyDown(event, index)}
              className={buttonVariants({ variant: checked ? "primary" : "outline", size: "sm" })}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {segmentError && <p className="mb-3 text-xs text-alert">{segmentError}</p>}

      <div className="flex flex-wrap items-start gap-3">
        <Input
          type="email"
          placeholder="tu@email.com"
          aria-label="Email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError(null);
          }}
          error={emailError ?? undefined}
          className="flex-1"
        />
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando…" : "Suscribirme"}
        </Button>
      </div>
    </form>
  );
}
