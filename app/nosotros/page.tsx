import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AgentCard } from "@/components/ui/agent-card";
import { Callout } from "@/components/ui/callout";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Defendemos y preservamos el valor de tu propiedad — conocé a De Paola Propiedades y a Tatiana De Paola.",
};

export const revalidate = 3600;

export default async function NosotrosPage() {
  const agents = await prisma.agent.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  const founder = agents.find((a) => a.title === "Fundadora") ?? agents[0];

  return (
    <main>
      <section className="pb-0 pt-10">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <p className="mb-3 text-sm text-ink-soft">
            <Link href="/">Inicio</Link> / Nosotros
          </p>
          <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">
            Perfil de la empresa
          </span>
          <h1 className="mb-4 max-w-2xl text-[34px]">Defendemos y preservamos el valor de tu propiedad.</h1>
          <p className="mb-3 max-w-2xl text-[17px]">
            Somos una empresa que se dedica, se esfuerza y se compromete a defender y preservar el valor de su
            propiedad. Lo invitamos a conocer nuestro estilo, nuestro equipo de trabajo altamente capacitado,
            ofreciéndole información legal y técnica, para desarrollar la operación inmobiliaria más valiosa de su
            vida.
          </p>
          <p className="max-w-2xl">
            Respondemos a cada una de las necesidades de nuestros clientes, ofrecemos experiencia, firmeza,
            garantía, estabilidad, tranquilidad y solidez en cada uno de los procesos inmobiliarios, en todas sus
            fases.
          </p>
        </div>
      </section>

      {founder && (
        <section className="mt-10 bg-bg-alt py-16">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-6 sm:grid-cols-2 sm:px-8 sm:items-center">
            {!founder.isPlaceholderPhoto && founder.photoUrl ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-card">
                <Image src={founder.photoUrl} alt={founder.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center rounded-card bg-brand-tint text-6xl font-semibold text-brand-dark">
                {founder.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
            )}
            <div>
              <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">
                Fundadora
              </span>
              <h2 className="mb-3">{founder.name}</h2>
              {founder.bio && <p>{founder.bio}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-wider text-brand">Equipo</span>
              <h2>Nuestros especialistas</h2>
            </div>
            <Link href="/contacto" className="text-sm underline">
              Contactar
            </Link>
          </div>

          {agents.length <= 1 && (
            <Callout>Por ahora solo hay ficha pública de Tatiana De Paola — el resto del equipo se agrega con fotos y datos reales (Fase 9).</Callout>
          )}

          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                href={`/equipo/${agent.slug}`}
                name={agent.name}
                title={agent.title}
                photoUrl={agent.photoUrl}
                isPlaceholderPhoto={agent.isPlaceholderPhoto}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
