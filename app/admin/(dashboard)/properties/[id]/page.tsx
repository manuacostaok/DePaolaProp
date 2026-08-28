import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import type { PropertyFormInput } from "@/app/admin/(dashboard)/properties/actions";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [property, neighborhoods, agents, offices] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: { location: true, images: { orderBy: { order: "asc" } }, features: true },
    }),
    prisma.neighborhood.findMany({ orderBy: { name: "asc" } }),
    prisma.agent.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!property) notFound();

  const initial: PropertyFormInput = {
    title: property.title,
    slug: property.slug,
    description: property.description,
    operationType: property.operationType,
    propertyType: property.propertyType,
    condition: property.condition ?? "",
    status: property.status,
    price: property.price?.toString() ?? "",
    currency: property.currency ?? "",
    coveredArea: property.coveredArea?.toString() ?? "",
    totalArea: property.totalArea?.toString() ?? "",
    rooms: property.rooms?.toString() ?? "",
    bedrooms: property.bedrooms?.toString() ?? "",
    bathrooms: property.bathrooms?.toString() ?? "",
    hasGarage: property.hasGarage,
    isFeatured: property.isFeatured,
    isSample: property.isSample,
    neighborhoodId: property.location.neighborhoodId,
    address: property.location.address ?? "",
    agentId: property.agentId,
    officeId: property.officeId ?? "",
    imageUrls: property.images.map((img) => img.url).join("\n"),
    featureLabels: property.features.map((f) => f.label).join(", "),
  };

  return (
    <div className="max-w-3xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Editar propiedad</h1>
      <PropertyForm
        propertyId={property.id}
        initial={initial}
        neighborhoodOptions={neighborhoods.map((n) => ({ value: n.id, label: n.name }))}
        agentOptions={agents.map((a) => ({ value: a.id, label: a.name }))}
        officeOptions={offices.map((o) => ({ value: o.id, label: o.name }))}
      />
    </div>
  );
}
