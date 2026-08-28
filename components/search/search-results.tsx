"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PropertyCard } from "@/components/ui/property-card";
import { Callout } from "@/components/ui/callout";
import { cn } from "@/lib/cn";
import { useFavorites } from "@/lib/use-favorites";
import type { PropertyResult } from "@/lib/search";

const PropertyMap = dynamic(() => import("@/components/search/property-map").then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => <div className="flex h-[520px] items-center justify-center rounded-card border border-line bg-bg-alt text-ink-soft">Cargando mapa…</div>,
});

export function SearchResults({ results, isFallback }: { results: PropertyResult[]; isFallback: boolean }) {
  const [view, setView] = useState<"lista" | "mapa">("lista");
  const { isFavorite, toggle } = useFavorites();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          {results.length} {results.length === 1 ? "propiedad" : "propiedades"}
        </p>
        <div className="flex rounded-control border border-line p-1">
          {(["lista", "mapa"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={cn(
                "rounded-[3px] px-4 py-1.5 text-sm font-medium capitalize",
                view === option ? "bg-brand text-white" : "text-ink-soft",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {isFallback && (
        <Callout>
          No encontramos propiedades con esos filtros exactos. Te mostramos otras propiedades disponibles que
          pueden interesarte.
        </Callout>
      )}

      {results.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">
          No hay propiedades disponibles por el momento. Un agente de De Paola puede ayudarte a encontrar algo a
          medida — contactanos.
        </p>
      ) : view === "lista" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((property) => (
            <PropertyCard
              key={property.id}
              href={`/propiedades/${property.slug}`}
              title={property.title}
              neighborhoodName={property.neighborhoodName}
              price={property.price}
              currency={property.currency}
              operationType={property.operationType}
              imageUrl={property.imageUrl}
              imageAlt={property.imageAlt}
              rooms={property.rooms}
              bathrooms={property.bathrooms}
              coveredArea={property.coveredArea}
              isSample={property.isSample}
              isFavorite={isFavorite(property.id)}
              onToggleFavorite={() => toggle(property.id)}
            />
          ))}
        </div>
      ) : (
        <PropertyMap properties={results} />
      )}
    </div>
  );
}
