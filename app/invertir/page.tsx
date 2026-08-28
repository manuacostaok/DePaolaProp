import type { Metadata } from "next";
import { getNeighborhoodIdOptions } from "@/lib/search";
import { InvertirWizard } from "@/components/leads/invertir-wizard";

export const metadata: Metadata = { title: "Invertir en Zona Norte", description: "Oportunidades de renta, reventa y desarrollo en Zona Norte, Buenos Aires." };
export const revalidate = 3600;

export default async function InvertirPage() {
  const neighborhoodOptions = await getNeighborhoodIdOptions();

  return (
    <main>
      <section className="bg-brand-dark py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <span className="mb-3 block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#DCE7DE]">
            Quiero invertir
          </span>
          <h1 className="mb-4 text-white">Oportunidades de inversión en Zona Norte</h1>
          <p className="text-[#EDEAE0]">
            Renta, reventa o desarrollo — contanos qué buscás y te conectamos con un agente especializado en
            inversión, no con un vendedor genérico.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[560px] px-6 py-16 sm:px-8">
        <InvertirWizard neighborhoodOptions={neighborhoodOptions} />
      </section>
    </main>
  );
}
