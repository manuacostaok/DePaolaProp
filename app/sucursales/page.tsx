import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OfficeMapLoader } from "@/components/office/office-map-loader";
import { SITE } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Sucursales",
  description: "Encontrá la sucursal de De Paola Propiedades más cercana en Zona Norte.",
  alternates: { canonical: "/sucursales" },
};

export const revalidate = 3600;

// Íconos de línea fina, un solo trazo — misma familia que el resto del
// sitio (WhatsAppFloat), no un set de librería genérico.
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" />
    </svg>
  );
}

export default async function SucursalesPage() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-16 sm:px-8 sm:py-20">
      <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.12em] text-brand">Dónde encontrarnos</span>
      <h1 className="mb-3 text-[clamp(28px,3.4vw,40px)]">Sucursales</h1>
      <p className="mb-14 max-w-xl text-ink-soft">Dos sucursales en Zona Norte, listas para atenderte en persona.</p>

      {/* Sin caja blanca ni borde: cada sucursal es un bloque tipográfico
          (nombre + dirección/teléfono/mail con ícono) + un mapa real —
          no el placeholder de texto "Mapa de X" que había antes. */}
      <div className="grid gap-14 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16">
        {offices.map((office) => (
          <div key={office.id}>
            <h2 className="mb-4">{office.name}</h2>
            <ul className="mb-5 space-y-2.5 text-[14.5px] text-ink-soft">
              <li className="flex items-start gap-2.5">
                <PinIcon />
                <span>{office.address}</span>
              </li>
              {office.hours && (
                <li className="pl-[26px] text-[13px] text-ink-soft/80">{office.hours}</li>
              )}
              {office.phone && (
                <li className="flex items-center gap-2.5">
                  <PhoneIcon />
                  <a href={`tel:+54${office.phone.replace(/\D/g, "")}`} className="hover:text-brand-dark">
                    {office.phone}
                  </a>
                </li>
              )}
              {office.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <PhoneIcon />
                  <a
                    href={`https://wa.me/${office.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-dark"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {office.email && (
                <li className="flex items-center gap-2.5">
                  <MailIcon />
                  <a href={`mailto:${office.email}`} className="hover:text-brand-dark">
                    {office.email}
                  </a>
                </li>
              )}
            </ul>
            {office.lat != null && office.lng != null ? (
              <OfficeMapLoader lat={office.lat} lng={office.lng} name={office.name} />
            ) : (
              <div className="flex h-44 items-center justify-center rounded-card bg-bg-alt text-sm text-ink-soft sm:h-52">
                Ubicación no disponible todavía
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-16 border-t border-line pt-8 text-sm text-ink-soft">
        También podés escribirnos a{" "}
        <a href="mailto:contacto@depaolapropiedades.com" className="underline">
          contacto@depaolapropiedades.com
        </a>{" "}
        o completar el{" "}
        <Link href="/contacto" className="underline">
          formulario de contacto
        </Link>
        .
      </p>
      <p className="mt-2 text-xs text-ink-soft">{SITE.legalId}</p>
    </main>
  );
}
