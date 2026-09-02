"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  // lockedUntil viaja en el mismo findFirst que ya se hacía para obtener
  // passwordHash — no es una consulta nueva que pueda fallar aparte.
  const agent = await prisma.agent.findFirst({ where: { email, isActive: true } });

  if (!agent || !agent.passwordHash) {
    return { error: "Email o contraseña incorrectos." };
  }

  if (agent.lockedUntil && agent.lockedUntil > new Date()) {
    return { error: "Demasiados intentos fallidos. Esperá unos minutos e intentá de nuevo." };
  }

  const valid = await verifyPassword(password, agent.passwordHash);

  // El resultado del login ya está decidido acá — lo que sigue es
  // contabilidad best-effort: si este update falla, se loguea pero nunca
  // bloquea ni altera la respuesta al usuario. El incremento usa `{
  // increment: 1 }` (un UPDATE ... SET x = x + 1 atómico en la base) en vez
  // de leer-y-sumar en JS — varios intentos concurrentes (exactamente el
  // caso que un ataque de fuerza bruta real produce) no deben poder
  // pisarse el contador entre sí.
  try {
    if (valid) {
      await prisma.agent.update({ where: { id: agent.id }, data: { failedLoginCount: 0, lockedUntil: null } });
    } else {
      const updated = await prisma.agent.update({
        where: { id: agent.id },
        data: { failedLoginCount: { increment: 1 } },
      });
      if (updated.failedLoginCount >= MAX_FAILED_ATTEMPTS) {
        await prisma.agent.update({
          where: { id: agent.id },
          data: { lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60_000) },
        });
      }
    }
  } catch (error) {
    console.error("No se pudo actualizar el contador de intentos de login:", error);
  }

  if (!valid) {
    return { error: "Email o contraseña incorrectos." };
  }

  await createSession({ agentId: agent.id, name: agent.name, role: agent.role });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
