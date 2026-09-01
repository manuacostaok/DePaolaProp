import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export default async function AdminPropertiesPage() {
  const session = await getSession();

  const properties = await prisma.property.findMany({
    where: session?.role === "AGENTE" ? { agentId: session.agentId } : {},
    include: { location: { include: { neighborhood: true } }, agent: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Propiedades</h1>
        <div className="flex gap-3">
          <Link href="/admin/properties/import" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Importar CSV
          </Link>
          <Link href="/admin/properties/new" className={buttonVariants({ size: "sm" })}>
            Nueva propiedad
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-bg-alt text-left text-ink-soft">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Zona</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Agente</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-line last:border-0 hover:bg-brand-tint/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/properties/${property.id}`} className="font-medium text-ink hover:text-brand-dark">
                    {property.title}
                  </Link>
                  {property.isFeatured && <Badge className="ml-2">Destacada</Badge>}
                  {property.isSample && (
                    <Badge variant="dark" className="ml-2">
                      Ejemplo
                    </Badge>
                  )}
                  {property.needsReview && (
                    <Badge variant="dark" className="ml-2">
                      A revisar
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">{property.location.neighborhood.name}</td>
                <td className="px-4 py-3">{formatPrice(property.price ? Number(property.price) : null, property.currency)}</td>
                <td className="px-4 py-3">{property.status}</td>
                <td className="px-4 py-3">{property.agent?.name ?? "—"}</td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No hay propiedades todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
