import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AgentForm } from "@/components/admin/agent-form";
import type { AgentFormInput } from "@/app/admin/(dashboard)/agents/actions";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [agent, offices] = await Promise.all([
    prisma.agent.findUnique({ where: { id } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!agent) notFound();

  const initial: AgentFormInput = {
    name: agent.name,
    slug: agent.slug,
    title: agent.title ?? "",
    bio: agent.bio ?? "",
    phone: agent.phone ?? "",
    whatsapp: agent.whatsapp ?? "",
    email: agent.email ?? "",
    officeId: agent.officeId ?? "",
    role: agent.role,
    isActive: agent.isActive,
  };

  return (
    <div className="max-w-2xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Editar agente</h1>
      <AgentForm agentId={agent.id} initial={initial} officeOptions={offices.map((o) => ({ value: o.id, label: o.name }))} />
    </div>
  );
}
