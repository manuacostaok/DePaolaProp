import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getNeighborhoodIdOptions } from "@/lib/search";
import { VenderWizard } from "@/components/leads/vender-wizard";

export const metadata: Metadata = { title: "Vender mi propiedad | De Paola Propiedades" };

const REASONS = [
  {
    title: "20 años en Zona Norte",
    body: "Conocemos el barrio casa por casa — Martínez, Florida, Vicente López y Villa Martelli.",
  },
  {
    title: "Publicación en los portales que importan",
    body: "Zonaprop, Argenprop, Mercado Libre y Clarín, además de tu propia ficha en depaolapropiedades.com.",
  },
  {
    title: "Acompañamiento de punta a punta",
    body: "Desde la tasación hasta la firma, con un agente a cargo durante todo el proceso.",
  },
];

export default async function VenderPage() {
  const neighborhoodOptions = await getNeighborhoodIdOptions();

  return (
    <main>
      <section className="bg-brand-dark py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <span className="mb-3 block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#DCE7DE]">
            Quiero vender
          </span>
          <h1 className="mb-4 text-white">Vendé tu propiedad con quien conoce Zona Norte hace 20 años</h1>
          <p className="mb-8 text-[#EDEAE0]">
            El primer paso es saber cuánto vale hoy. Es gratis, no tiene compromiso, y no hace falta cargar fotos
            todavía.
          </p>
          <Link href="/vender/tasacion" className={buttonVariants({ className: "border-white bg-white text-brand-dark" })}>
            Tasar mi propiedad
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-16 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title}>
              <h2 className="mb-2 text-[19px]">{reason.title}</h2>
              <p>{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-alt py-16">
        <div className="mx-auto max-w-[560px] px-6 sm:px-8">
          <h2 className="mb-6 text-center">Contanos sobre tu propiedad</h2>
          <VenderWizard neighborhoodOptions={neighborhoodOptions} />
        </div>
      </section>
    </main>
  );
}
