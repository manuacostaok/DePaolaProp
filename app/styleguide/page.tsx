"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/ui/property-card";
import { ZoneCard } from "@/components/ui/zone-card";
import { ArticleCard } from "@/components/ui/article-card";

const colors = [
  { name: "bg", className: "bg-bg", hex: "#FAF8F3" },
  { name: "bg-alt", className: "bg-bg-alt", hex: "#EFE9DC" },
  { name: "ink", className: "bg-ink", hex: "#211F1B" },
  { name: "ink-soft", className: "bg-ink-soft", hex: "#57534A" },
  { name: "brand", className: "bg-brand", hex: "#24443F" },
  { name: "brand-dark", className: "bg-brand-dark", hex: "#172C29" },
  { name: "brand-tint", className: "bg-brand-tint", hex: "#E4EDE9" },
  { name: "line", className: "bg-line", hex: "#DED7C6" },
  { name: "success", className: "bg-success", hex: "#3F7A5C" },
  { name: "alert", className: "bg-alert", hex: "#B9853A" },
  { name: "whatsapp", className: "bg-whatsapp", hex: "#25D366" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-12">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
        <h2 className="mb-6 text-2xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main>
      <div className="border-b border-line bg-brand-dark px-6 py-3 text-center text-[12.5px] tracking-wide text-bg-alt sm:px-8">
        <strong className="text-white">Styleguide interno</strong> — referencia de componentes base (Phase 1), no
        forma parte del sitio público.
      </div>

      <Section title="Paleta">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {colors.map((color) => (
            <div key={color.name}>
              <div className={`mb-2 h-16 rounded-card border border-line ${color.className}`} />
              <p className="text-sm font-medium text-ink">{color.name}</p>
              <p className="text-xs text-ink-soft">{color.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografía">
        <p className="mb-2 font-display text-4xl text-ink">Fraunces — encabezados</p>
        <p className="mb-6 text-ink-soft">
          Casa 5 ambientes en Barrio Parque — usado en h1/h2/h3/h4, peso medium, tracking ajustado.
        </p>
        <p className="text-lg text-ink">Inter — cuerpo y UI</p>
        <p className="text-ink-soft">
          Texto de párrafo, formularios, botones y metadatos usan Inter en distintos pesos (400/500/600/700).
        </p>
      </Section>

      <Section title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Ver propiedad</Button>
          <Button variant="outline">Contactar agente</Button>
          <Button variant="whatsapp">WhatsApp</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="primary" disabled>
            Deshabilitado
          </Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">Venta</Badge>
          <Badge variant="alert">Reservada</Badge>
          <Badge variant="dark">Ejemplo</Badge>
          <Badge variant="outline">Alquiler</Badge>
        </div>
      </Section>

      <Section title="Inputs y Select">
        <div className="grid max-w-xl gap-5">
          <Input label="Nombre" placeholder="Tu nombre" />
          <Input label="Email" type="email" placeholder="tu@email.com" error="Ingresá un email válido" />
          <Select
            label="Zona"
            placeholder="Elegí una zona"
            options={[
              { value: "martinez", label: "Martínez" },
              { value: "florida", label: "Florida" },
              { value: "vicente-lopez", label: "Vicente López" },
              { value: "villa-martelli", label: "Villa Martelli" },
            ]}
          />
        </div>
      </Section>

      <Section title="Skeleton">
        <div className="grid max-w-sm gap-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Section>

      <Section title="Card — Propiedad">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyCard
            href="#"
            title="Casa 5 ambientes en Barrio Parque"
            neighborhoodName="Villa Martelli"
            price={320000}
            currency="USD"
            operationType="VENTA"
            imageUrl="/placeholder-property.svg"
            imageAlt="Casa en Barrio Parque"
            rooms={5}
            bathrooms={3}
            coveredArea={210}
            isFavorite
            onToggleFavorite={() => {}}
          />
          <PropertyCard
            href="#"
            title="Departamento 2 ambientes con balcón"
            neighborhoodName="Martínez"
            price={950}
            currency="USD"
            operationType="ALQUILER"
            imageUrl="/placeholder-property.svg"
            imageAlt="Departamento en Martínez"
            rooms={2}
            bathrooms={1}
            coveredArea={58}
            isSample
          />
        </div>
      </Section>

      <Section title="Card — Zona">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ZoneCard
            href="#"
            name="Martínez"
            tagline="Arbolado, colegios y cercanía al río"
            imageUrl="/placeholder-zone.svg"
            imageAlt="Martínez"
          />
          <ZoneCard
            href="#"
            name="Vicente López"
            tagline="Vida de barrio con acceso directo a CABA"
            imageUrl="/placeholder-zone.svg"
            imageAlt="Vicente López"
          />
        </div>
      </Section>

      <Section title="Card — Artículo">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard
            href="#"
            title="Qué mirar antes de comprar en Zona Norte"
            categoryName="Guías"
            imageUrl="/placeholder-property.svg"
            imageAlt="Guía de compra"
            publishedAt="Agosto 2026"
          />
        </div>
      </Section>
    </main>
  );
}
