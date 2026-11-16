import type { Metadata } from "next";
import { getNeighborhoodIdOptions } from "@/lib/search";
import { PageHero } from "@/components/ui/page-hero";
import { InvertirWizard } from "@/components/leads/invertir-wizard";

export const metadata: Metadata = {
  title: "Invertir en Zona Norte",
  description: "Oportunidades de renta, reventa y desarrollo en Zona Norte, Buenos Aires.",
  alternates: { canonical: "/invertir" },
};
export const revalidate = 3600;

export default async function InvertirPage() {
  const neighborhoodOptions = await getNeighborhoodIdOptions();

  return (
    <main>
      <PageHero
        eyebrow="Quiero invertir"
        title="Oportunidades de inversión en Zona Norte"
        description="Renta, reventa o desarrollo — contanos qué buscás y te conectamos con un agente especializado en inversión, no con un vendedor genérico."
        imageSrc="/pages/invertir.jpg"
        imageAlt="Pileta en la terraza de un edificio de Campus Norte, Zona Norte"
      />

      <section className="mx-auto max-w-[560px] px-6 py-16 sm:px-8">
        <InvertirWizard neighborhoodOptions={neighborhoodOptions} />
      </section>
    </main>
  );
}
