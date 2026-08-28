import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/ui/property-card";
import { buttonVariants } from "@/components/ui/button";

async function getAgent(slug: string) {
  return prisma.agent.findUnique({
    where: { slug },
    include: {
      specializations: true,
      properties: {
        where: { status: "ACTIVA" },
        include: { location: { include: { neighborhood: true } }, images: { orderBy: { order: "asc" }, take: 1 } },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) return { title: "No encontrado | De Paola Propiedades" };
  return { title: `${agent.name} | De Paola Propiedades`, description: agent.bio?.slice(0, 160) };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent || !agent.isActive) notFound();

  const initials = agent.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <div className="mb-12 grid gap-8 sm:grid-cols-[280px_1fr]">
        {!agent.isPlaceholderPhoto && agent.photoUrl ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-card">
            <Image src={agent.photoUrl} alt={agent.name} fill className="object-cover" priority />
          </div>
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center rounded-card bg-brand-tint text-6xl font-semibold text-brand-dark">
            {initials}
          </div>
        )}

        <div>
          <h1 className="mb-1">{agent.name}</h1>
          {agent.title && <p className="mb-4 text-ink-soft">{agent.title}</p>}

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">Zonas</p>
          <p className="mb-5">
            {agent.specializations.length > 0 ? (
              agent.specializations.map((z, i) => (
                <span key={z.id}>
                  {i > 0 && ", "}
                  <Link href={`/zonas/${z.slug}`} className="underline">
                    {z.name}
                  </Link>
                </span>
              ))
            ) : (
              "Zona Norte"
            )}
          </p>

          {agent.bio && <p className="mb-6 max-w-xl">{agent.bio}</p>}

          <div className="flex flex-wrap gap-3">
            {agent.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "whatsapp" })}
              >
                WhatsApp
              </a>
            )}
            {agent.email && (
              <a href={`mailto:${agent.email}`} className={buttonVariants({ variant: "outline" })}>
                Email
              </a>
            )}
          </div>
        </div>
      </div>

      {agent.properties.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl">Propiedades a cargo de {agent.name.split(" ")[0]}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agent.properties.map((property) => (
              <PropertyCard
                key={property.id}
                href={`/propiedades/${property.slug}`}
                title={property.title}
                neighborhoodName={property.location.neighborhood.name}
                price={property.price ? Number(property.price) : null}
                currency={property.currency}
                operationType={property.operationType}
                imageUrl={property.images[0]?.url ?? "/placeholder-property.svg"}
                imageAlt={property.images[0]?.alt ?? property.title}
                rooms={property.rooms}
                bathrooms={property.bathrooms}
                coveredArea={property.coveredArea}
                isSample={property.isSample}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
