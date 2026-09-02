"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AgentRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireSession } from "@/lib/session";

export interface AgentFormInput {
  name: string;
  slug: string;
  title: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeId: string;
  role: AgentRole;
  isActive: boolean;
}

export async function createAgent(input: AgentFormInput, password: string) {
  await requireSession("ADMINISTRADOR");
  const agent = await prisma.agent.create({
    data: {
      name: input.name,
      slug: input.slug,
      title: input.title || undefined,
      bio: input.bio || undefined,
      phone: input.phone || undefined,
      whatsapp: input.whatsapp || undefined,
      email: input.email || undefined,
      office: input.officeId ? { connect: { id: input.officeId } } : undefined,
      role: input.role,
      isActive: input.isActive,
      isPlaceholderPhoto: true,
      passwordHash: password ? await hashPassword(password) : undefined,
    },
  });

  revalidatePath("/admin/agents");
  redirect(`/admin/agents/${agent.id}`);
}

export async function updateAgent(agentId: string, input: AgentFormInput) {
  await requireSession("ADMINISTRADOR");
  await prisma.agent.update({
    where: { id: agentId },
    data: {
      name: input.name,
      slug: input.slug,
      title: input.title || null,
      bio: input.bio || null,
      phone: input.phone || null,
      whatsapp: input.whatsapp || null,
      email: input.email || null,
      office: input.officeId ? { connect: { id: input.officeId } } : { disconnect: true },
      role: input.role,
      isActive: input.isActive,
    },
  });

  revalidatePath("/admin/agents");
  revalidatePath(`/admin/agents/${agentId}`);
}

export async function resetAgentPassword(agentId: string, newPassword: string) {
  await requireSession("ADMINISTRADOR");
  await prisma.agent.update({ where: { id: agentId }, data: { passwordHash: await hashPassword(newPassword) } });
}
