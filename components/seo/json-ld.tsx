export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// Reusa el mismo array de {label, href} que ya arma el breadcrumb visual en
// HTML — evita mantener dos fuentes de verdad para el mismo trail.
export function BreadcrumbJsonLd({ items, siteUrl }: { items: { name: string; href: string }[]; siteUrl: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${siteUrl}${item.href}`,
        })),
      }}
    />
  );
}
