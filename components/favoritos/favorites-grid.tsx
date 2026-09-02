"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/ui/property-card";
import { buttonVariants } from "@/components/ui/button";
import { useFavorites } from "@/lib/use-favorites";
import { fetchFavoriteProperties } from "@/app/favoritos/actions";
import type { PropertyResult } from "@/lib/search";

export function FavoritesGrid() {
  const { favorites, toggle, isFavorite } = useFavorites();
  const [properties, setProperties] = useState<PropertyResult[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchFavoriteProperties(favorites).then((results) => {
      if (!cancelled) setProperties(results);
    });
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  if (properties === null) {
    return <p className="py-16 text-center text-ink-soft">Cargando tus favoritos…</p>;
  }

  if (properties.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-ink-soft">Todavía no guardaste ninguna propiedad.</p>
        <Link href="/propiedades" className={buttonVariants()}>
          Ver propiedades
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-ink-soft">
        {properties.length} {properties.length === 1 ? "propiedad guardada" : "propiedades guardadas"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
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
            agent={property.agent}
            isFavorite={isFavorite(property.id)}
            onToggleFavorite={() => toggle(property.id)}
          />
        ))}
      </div>
    </div>
  );
}
