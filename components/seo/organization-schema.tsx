import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";
import { SITE } from "@/lib/nav";
import { JsonLd } from "@/components/seo/json-ld";

export async function OrganizationSchema() {
  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } });

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: SITE.name,
        url: SITE_URL,
        logo: SITE.logoUrl,
        image: SITE.logoUrl,
        areaServed: ["Martínez", "Florida", "Vicente López", "Villa Martelli"],
        location: offices.map((office) => ({
          "@type": "Place",
          name: office.name,
          address: { "@type": "PostalAddress", streetAddress: office.address, addressRegion: "Buenos Aires", addressCountry: "AR" },
          telephone: office.phone ?? undefined,
        })),
      }}
    />
  );
}
