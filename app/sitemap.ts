import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

const STATIC_ROUTES = [
  "",
  "/propiedades",
  "/propiedades/comprar",
  "/propiedades/alquilar",
  "/propiedades/destacadas",
  "/zonas",
  "/vender",
  "/vender/tasacion",
  "/invertir",
  "/insights",
  "/nosotros",
  "/equipo",
  "/sucursales",
  "/contacto",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, neighborhoods, articles, categories, agents] = await Promise.all([
    prisma.property.findMany({ where: { status: "ACTIVA" }, select: { slug: true, updatedAt: true } }),
    prisma.neighborhood.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { publishedAt: { not: null } }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.agent.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/propiedades/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const zoneEntries: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${SITE_URL}/zonas/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/insights/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/insights/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const agentEntries: MetadataRoute.Sitemap = agents.map((a) => ({
    url: `${SITE_URL}/equipo/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...propertyEntries, ...zoneEntries, ...articleEntries, ...categoryEntries, ...agentEntries];
}
