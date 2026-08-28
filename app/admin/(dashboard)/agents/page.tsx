import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({ include: { office: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Agentes</h1>
        <Link href="/admin/agents/new" className={buttonVariants({ size: "sm" })}>
          Nuevo agente
        </Link>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line bg-bg-alt text-left text-ink-soft">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Sucursal</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-line last:border-0 hover:bg-brand-tint/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/agents/${agent.id}`} className="font-medium text-ink hover:text-brand-dark">
                    {agent.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{agent.role === "ADMINISTRADOR" ? "Administrador" : "Agente"}</Badge>
                </td>
                <td className="px-4 py-3">{agent.office?.name ?? "—"}</td>
                <td className="px-4 py-3">{agent.email ?? "—"}</td>
                <td className="px-4 py-3">{agent.isActive ? "Activo" : "Inactivo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
