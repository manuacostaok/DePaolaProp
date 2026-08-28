"use client";

import { useState, useTransition } from "react";
import { LeadStatus } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateLeadStatus, reassignLead, updateLeadNotes } from "@/app/admin/(dashboard)/leads/actions";

const STATUS_OPTIONS = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "CONTACTADO", label: "Contactado" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "CERRADO", label: "Cerrado" },
];

export function LeadDetailForm({
  leadId,
  status,
  agentId,
  internalNotes,
  agentOptions,
}: {
  leadId: string;
  status: LeadStatus;
  agentId: string | null;
  internalNotes: string;
  agentOptions: { value: string; label: string }[];
}) {
  const [notes, setNotes] = useState(internalNotes);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentAgentId, setCurrentAgentId] = useState(agentId ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-5">
      <Select
        label="Estado"
        value={currentStatus}
        options={STATUS_OPTIONS}
        onChange={(e) => {
          const value = e.target.value as LeadStatus;
          setCurrentStatus(value);
          startTransition(() => updateLeadStatus(leadId, value));
        }}
      />
      <Select
        label="Agente asignado"
        value={currentAgentId}
        placeholder="Sin asignar"
        options={agentOptions}
        onChange={(e) => {
          setCurrentAgentId(e.target.value);
          startTransition(() => reassignLead(leadId, e.target.value));
        }}
      />
      <div>
        <Textarea label="Notas internas" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        <Button
          type="button"
          size="sm"
          className="mt-2"
          onClick={() => startTransition(() => updateLeadNotes(leadId, notes))}
          disabled={isPending}
        >
          Guardar notas
        </Button>
      </div>
    </div>
  );
}
