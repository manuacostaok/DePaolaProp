"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, type LoginState } from "@/app/admin/login/actions";

const INITIAL_STATE: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, INITIAL_STATE);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-alt px-6">
      <form action={formAction} className="w-full max-w-sm rounded-card border border-line bg-white p-8">
        <h1 className="mb-1 text-2xl">Panel De Paola</h1>
        <p className="mb-6 text-sm text-ink-soft">Acceso interno para el equipo.</p>

        <div className="mb-4">
          <Input label="Email" name="email" type="email" required autoFocus />
        </div>
        <div className="mb-6">
          <Input label="Contraseña" name="password" type="password" required />
        </div>

        {state.error && <p className="mb-4 text-sm text-alert">{state.error}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </main>
  );
}
