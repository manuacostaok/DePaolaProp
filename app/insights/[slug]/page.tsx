import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryPage } from "@/components/insights/category-page";
import { ArticlePage } from "@/components/insights/article-page";

async function resolveSlug(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (category) return { kind: "category" as const, category };

  const article = await prisma.article.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { category: true, neighborhood: true },
  });
  if (article) return { kind: "article" as const, article };

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveSlug(slug);
  if (!resolved) return { title: "No encontrado | De Paola Propiedades" };

  if (resolved.kind === "category") {
    return { title: `${resolved.category.name} | De Paola Insights` };
  }
  return {
    title: `${resolved.article.title} | De Paola Insights`,
    description: resolved.article.body.slice(0, 160),
  };
}

export default async function InsightsSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolveSlug(slug);
  if (!resolved) notFound();

  if (resolved.kind === "category") {
    return <CategoryPage category={resolved.category} />;
  }

  return <ArticlePage article={resolved.article} />;
}
