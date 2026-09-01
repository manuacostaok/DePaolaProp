import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import type { PropertyFormInput } from "@/app/admin/(dashboard)/properties/actions";

const EMPTY: PropertyFormInput = {
  title: "",
  slug: "",
  description: "",
  operationType: "VENTA",
  propertyType: "CASA",
  condition: "",
  status: "ACTIVA",
  price: "",
  currency: "USD",
  coveredArea: "",
  totalArea: "",
  rooms: "",
  bedrooms: "",
  bathrooms: "",
  hasGarage: false,
  isFeatured: false,
  isSample: false,
  needsReview: false,
  neighborhoodId: "",
  address: "",
  agentId: "",
  officeId: "",
  imageUrls: "",
  featureLabels: "",
};

export default async function NewPropertyPage() {
  const [neighborhoods, agents, offices] = await Promise.all([
    prisma.neighborhood.findMany({ orderBy: { name: "asc" } }),
    prisma.agent.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Nueva propiedad</h1>
      <PropertyForm
        initial={EMPTY}
        neighborhoodOptions={neighborhoods.map((n) => ({ value: n.id, label: n.name }))}
        agentOptions={agents.map((a) => ({ value: a.id, label: a.name }))}
        officeOptions={offices.map((o) => ({ value: o.id, label: o.name }))}
      />
    </div>
  );
}
