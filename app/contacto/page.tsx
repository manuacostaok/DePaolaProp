import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá a De Paola Propiedades por WhatsApp, teléfono, email o en cualquiera de nuestras sucursales en Zona Norte.",
  alternates: { canonical: "/contacto" },
};

export const revalidate = 3600;

const QUICK_LINKS = [
  { label: "Quiero comprar", href: "/propiedades/comprar" },
  { label: "Quiero alquilar", href: "/propiedades/alquilar" },
  { label: "Quiero vender", href: "/vender" },
  { label: "Quiero invertir", href: "/invertir" },
  { label: "Quiero tasar mi propiedad", href: "/vender/tasacion" },
];

export default async function ContactoPage() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });
  const whatsapp = offices[0]?.whatsapp ?? SITE.whatsapp;
  const email = offices[0]?.email ?? "contacto@depaolapropiedades.com";

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)]">Contacto</h1>
      <p className="mb-8 max-w-xl text-ink-soft">
        Elegí el canal que prefieras — te contestamos nosotros o un agente, según lo que necesites.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl">Hablemos directo</h2>
          <div className="mb-6 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp" })}
            >
              WhatsApp
            </a>
            <a href={`mailto:${email}`} className={buttonVariants({ variant: "outline" })}>
              {email}
            </a>
          </div>

          <h2 className="mb-3 text-xl">Sucursales</h2>
          {offices.map((office) => (
            <div key={office.id} className="mb-4">
              <p className="font-semibold text-ink">{office.name}</p>
              <p className="text-sm text-ink-soft">{office.address}</p>
              {office.phone && <p className="text-sm text-ink-soft">{office.phone}</p>}
              {office.hours && <p className="text-sm text-ink-soft">{office.hours}</p>}
            </div>
          ))}
          <Link href="/sucursales" className="text-sm underline">
            Ver sucursales en el mapa
          </Link>
        </div>

        <div>
          <h2 className="mb-4 text-xl">¿Qué estás buscando?</h2>
          <div className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-control border border-line bg-white px-4 py-3 text-sm text-ink hover:border-brand hover:text-brand-dark"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
