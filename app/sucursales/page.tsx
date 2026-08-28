import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Sucursales",
  description: "Encontrá la sucursal de De Paola Propiedades más cercana en Zona Norte.",
};

export const revalidate = 3600;

export default async function SucursalesPage() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)]">Sucursales</h1>
      <p className="mb-8 max-w-xl text-ink-soft">Dos sucursales en Zona Norte, listas para atenderte en persona.</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {offices.map((office) => (
          <div key={office.id} className="rounded-card border border-line bg-white p-6">
            <h2 className="mb-2">{office.name}</h2>
            <p className="mb-4 text-ink-soft">{office.address}</p>
            <div className="mb-4 flex h-40 items-center justify-center rounded-control bg-bg-alt text-sm text-ink-soft">
              Mapa de {office.name}
            </div>
            <div className="flex flex-wrap gap-3">
              {office.phone && (
                <a href={`tel:+54${office.phone.replace(/\D/g, "")}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  {office.phone}
                </a>
              )}
              {office.whatsapp && (
                <a
                  href={`https://wa.me/${office.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "whatsapp", size: "sm" })}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        También podés escribirnos a{" "}
        <a href={`mailto:contacto@depaolapropiedades.com`} className="underline">
          contacto@depaolapropiedades.com
        </a>{" "}
        o completar el <Link href="/contacto" className="underline">formulario de contacto</Link>.
      </p>
      <p className="mt-2 text-xs text-ink-soft">{SITE.legalId}</p>
    </main>
  );
}
