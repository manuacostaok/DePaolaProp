import { OperationType } from "@prisma/client";
import { LeadModal } from "@/components/leads/lead-modal";
import { ComprarWizard } from "@/components/leads/comprar-wizard";
import { AlquilarWizard } from "@/components/leads/alquilar-wizard";
import { getNeighborhoodIdOptions } from "@/lib/search";

export async function SearchLeadBanner({ operation }: { operation: OperationType }) {
  const neighborhoodOptions = await getNeighborhoodIdOptions();
  const isVenta = operation === "VENTA";

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-brand-tint px-5 py-4">
      <p className="text-sm text-brand-dark">
        {isVenta
          ? "¿No encontrás lo que buscás? Dejanos tus datos y te avisamos apenas aparezca algo."
          : "¿No encontrás lo que buscás para alquilar? Dejanos tus datos y te avisamos."}
      </p>
      <LeadModal triggerLabel="Quiero que me avisen" title={isVenta ? "Estoy buscando comprar" : "Estoy buscando alquilar"}>
        {isVenta ? (
          <ComprarWizard neighborhoodOptions={neighborhoodOptions} />
        ) : (
          <AlquilarWizard neighborhoodOptions={neighborhoodOptions} />
        )}
      </LeadModal>
    </div>
  );
}
