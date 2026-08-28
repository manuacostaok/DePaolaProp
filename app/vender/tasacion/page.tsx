import type { Metadata } from "next";
import { getNeighborhoodIdOptions } from "@/lib/search";
import { TasacionWizard } from "@/components/valuation/tasacion-wizard";

export const metadata: Metadata = { title: "Tasá tu propiedad | De Paola Propiedades" };

export default async function TasacionPage() {
  const neighborhoodOptions = await getNeighborhoodIdOptions();

  return (
    <main className="mx-auto max-w-[720px] px-6 py-12 sm:px-8">
      <h1 className="mb-2 text-center text-[clamp(26px,3vw,36px)]">¿Cuánto vale tu propiedad?</h1>
      <p className="mb-8 text-center text-ink-soft">
        Contanos algunos datos y te damos una primera orientación, sin costo ni compromiso.
      </p>
      <TasacionWizard neighborhoodOptions={neighborhoodOptions} />
    </main>
  );
}
