"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const agent = await prisma.agent.findFirst({ where: { email, isActive: true } });

  if (!agent || !agent.passwordHash) {
    return { error: "Email o contraseña incorrectos." };
  }

  const valid = await verifyPassword(password, agent.passwordHash);
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
