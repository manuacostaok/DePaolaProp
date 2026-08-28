"use client";

import { useState, useTransition } from "react";
import { AgentRole } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAgent, updateAgent, resetAgentPassword, type AgentFormInput } from "@/app/admin/(dashboard)/agents/actions";

export function AgentForm({
  agentId,
  initial,
  officeOptions,
}: {
  agentId?: string;
  initial: AgentFormInput;
  officeOptions: { value: string; label: string }[];
}) {
  const [form, setForm] = useState<AgentFormInput>(initial);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [passwordMessage, setPasswordMessage] = useState("");

  function update<K extends keyof AgentFormInput>(key: K, value: AgentFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      if (agentId) {
        await updateAgent(agentId, form);
      } else {
        await createAgent(form, password);
      }
    });
  }

  return (
    <div className="grid gap-8">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Nombre" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          <Input label="Slug (URL)" value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
        </div>
        <Input label="Título / rol público" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Ej: Agente inmobiliario" />
        <Textarea label="Presentación" value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} />
        <div className="grid gap-5 sm:grid-cols-3">
          <Input label="Teléfono" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          <Input label="WhatsApp" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+549..." />
          <Input label="Email (login)" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Select label="Sucursal" value={form.officeId} placeholder="—" onChange={(e) => update("officeId", e.target.value)} options={officeOptions} />
          <Select
            label="Rol en el panel"
            value={form.role}
            onChange={(e) => update("role", e.target.value as AgentRole)}
            options={[
              { value: "AGENTE", label: "Agente" },
              { value: "ADMINISTRADOR", label: "Administrador" },
            ]}
          />
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} />
            Activo
          </label>
        </div>

        {!agentId && (
          <Input
            label="Contraseña inicial"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejar vacío para crear sin acceso al panel"
          />
        )}

        <Button type="submit" disabled={isPending} className="w-fit">
          {isPending ? "Guardando…" : agentId ? "Guardar cambios" : "Crear agente"}
        </Button>
      </form>

      {agentId && (
        <div className="border-t border-line pt-6">
          <h2 className="mb-3 text-lg">Restablecer contraseña</h2>
          <div className="flex flex-wrap items-end gap-3">
            <Input label="Nueva contraseña" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                startTransition(async () => {
                  await resetAgentPassword(agentId, newPassword);
                  setPasswordMessage("Contraseña actualizada.");
                  setNewPassword("");
                });
              }}
              disabled={!newPassword || isPending}
            >
              Actualizar
            </Button>
          </div>
          {passwordMessage && <p className="mt-2 text-sm text-success">{passwordMessage}</p>}
        </div>
      )}
    </div>
  );
}
