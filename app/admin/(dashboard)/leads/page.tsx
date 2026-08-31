import Link from "next/link";
import { LeadType, LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";

const TYPE_LABELS: Record<LeadType, string> = {
  COMPRAR: "Comprar",
  ALQUILAR: "Alquilar",
  VENDER: "Vender",
  TASAR: "Tasar",
  INVERTIR: "Invertir",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  NUEVO: "Nuevo",
  CONTACTADO: "Contactado",
  EN_PROCESO: "En proceso",
  CERRADO: "Cerrado",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; estado?: string }>;
}) {
  const session = await getSession();
  const { tipo, estado } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: {
      ...(session?.role === "AGENTE" ? { agentId: session.agentId } : {}),
      ...(tipo && tipo in TYPE_LABELS ? { type: tipo as LeadType } : {}),
      ...(estado && estado in STATUS_LABELS ? { status: estado as LeadStatus } : {}),
    },
    include: { agent: true, neighborhood: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl">Leads</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/leads" className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
          Todos
        </Link>
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <Link key={value} href={`/admin/leads?tipo=${value}`} className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-bg-alt text-left text-ink-soft">
            <tr>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Agente</th>
              <th className="px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-line last:border-0 hover:bg-brand-tint/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-ink hover:text-brand-dark">
                    {lead.contactName}
                  </Link>
                  <p className="text-xs text-ink-soft">{lead.contactPhone ?? lead.contactEmail ?? "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{TYPE_LABELS[lead.type]}</Badge>
                </td>
                <td className="px-4 py-3">{lead.neighborhood?.name ?? "—"}</td>
                <td className="px-4 py-3">{STATUS_LABELS[lead.status]}</td>
                <td className="px-4 py-3">{lead.agent?.name ?? "Sin asignar"}</td>
                <td className="px-4 py-3 text-ink-soft">{lead.createdAt.toLocaleDateString("es-AR")}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No hay leads todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
