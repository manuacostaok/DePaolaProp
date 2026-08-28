import { prisma } from "@/lib/prisma";
import { AgentForm } from "@/components/admin/agent-form";
import type { AgentFormInput } from "@/app/admin/(dashboard)/agents/actions";

const EMPTY: AgentFormInput = {
  name: "",
  slug: "",
  title: "",
  bio: "",
  phone: "",
  whatsapp: "",
  email: "",
  officeId: "",
  role: "AGENTE",
  isActive: true,
};

export default async function NewAgentPage() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Nuevo agente</h1>
      <AgentForm initial={EMPTY} officeOptions={offices.map((o) => ({ value: o.id, label: o.name }))} />
    </div>
  );
}
