import type { Metadata } from "next";
import { PropertyType } from "@prisma/client";
import { getNeighborhoodIdOptions } from "@/lib/search";
import { TasacionWizard } from "@/components/valuation/tasacion-wizard";

export const metadata: Metadata = {
  title: "Tasá tu propiedad",
  description: "Estimación orientativa gratis y sin compromiso, o tasación profesional con un agente.",
  alternates: { canonical: "/vender/tasacion" },
};

export default async function TasacionPage({
  searchParams,
}: {
  searchParams: Promise<{ neighborhoodId?: string; propertyType?: string }>;
}) {
  const neighborhoodOptions = await getNeighborhoodIdOptions();
  const { neighborhoodId, propertyType } = await searchParams;

  const validNeighborhoodId = neighborhoodOptions.some((o) => o.value === neighborhoodId) ? neighborhoodId : undefined;
  const validPropertyType = propertyType && propertyType in PropertyType ? (propertyType as PropertyType) : undefined;

  return (
    <main className="mx-auto max-w-[720px] px-6 py-12 sm:px-8">
      <h1 className="mb-2 text-center text-[clamp(26px,3vw,36px)]">¿Cuánto vale tu propiedad?</h1>
      <p className="mb-8 text-center text-ink-soft">
        Contanos algunos datos y te damos una primera orientación, sin costo ni compromiso.
      </p>
      <TasacionWizard
        neighborhoodOptions={neighborhoodOptions}
        initialNeighborhoodId={validNeighborhoodId}
        initialPropertyType={validPropertyType}
      />
    </main>
  );
}
