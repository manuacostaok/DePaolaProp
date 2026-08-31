import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LeadDetailForm } from "@/components/admin/lead-detail-form";

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      neighborhood: true,
      property: true,
      valuationRequest: true,
      appointment: true,
      inquiry: true,
    },
  });

  if (!lead) notFound();

  const agents = await prisma.agent.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-card border border-line bg-white p-6">
        <p className="mb-1 text-sm text-ink-soft">
          <Link href="/admin/leads">← Leads</Link>
        </p>
        <h1 className="mb-4 text-2xl">{lead.contactName}</h1>

        <dl className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-ink-soft">Teléfono</dt>
            <dd>{lead.contactPhone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Email</dt>
            <dd>{lead.contactEmail ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Zona</dt>
            <dd>{lead.neighborhood?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Propiedad</dt>
            <dd>{lead.property ? <Link href={`/propiedades/${lead.property.slug}`}>{lead.property.title}</Link> : "—"}</dd>
          </div>
        </dl>

        {lead.filtersJson != null && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg">Datos del formulario</h2>
            <pre className="overflow-x-auto rounded-control bg-bg-alt p-3 text-xs text-ink-soft">
              {JSON.stringify(lead.filtersJson, null, 2)}
            </pre>
          </div>
        )}

        {lead.valuationRequest && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg">Tasación</h2>
            <p className="text-sm text-ink-soft">
              {lead.valuationRequest.hasEnoughComparables
                ? `Rango estimado: USD ${lead.valuationRequest.estimatedMin?.toString()} – USD ${lead.valuationRequest.estimatedMax?.toString()}`
                : "Sin comparables suficientes — requiere tasación profesional presencial."}
            </p>
          </div>
        )}

        {lead.appointment && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg">Turno solicitado</h2>
            <p className="text-sm text-ink-soft">
              {lead.appointment.preferredDate?.toLocaleDateString("es-AR")} — {lead.appointment.preferredTimeSlot}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-card border border-line bg-white p-6">
        <h2 className="mb-4 text-lg">Gestión</h2>
        <LeadDetailForm
          leadId={lead.id}
          status={lead.status}
          agentId={lead.agentId}
          internalNotes={lead.internalNotes ?? ""}
          agentOptions={agents.map((a) => ({ value: a.id, label: a.name }))}
        />
      </div>
    </div>
  );
}
