"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { createLead } from "@/lib/leads";
import { splitContactInput } from "@/lib/contact-input";
import { SITE } from "@/lib/nav";

export function DevelopmentLeadForm({ developmentId, developmentName }: { developmentId: string; developmentName: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await createLead({
      type: "COMPRAR",
      contactName: name,
      ...splitContactInput(contact),
      developmentId,
      message: message || undefined,
    });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="mb-4 font-medium text-success">
          ¡Listo! Un asesor de {developmentName} te va a contactar a la brevedad.
        </p>
        <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "whatsapp" })}>
          Hablar ahora por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email o WhatsApp" value={contact} onChange={(e) => setContact(e.target.value)} />
      <Textarea
        label="Mensaje (opcional)"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Quiero más información sobre ${developmentName}`}
      />
      <Button type="button" onClick={handleSubmit} disabled={!name || !contact || submitting}>
        {submitting ? "Enviando…" : "Enviar consulta"}
      </Button>
    </div>
  );
}
