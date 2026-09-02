import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryPage } from "@/components/insights/category-page";
import { ArticlePage } from "@/components/insights/article-page";

export const revalidate = 300;

export async function generateStaticParams() {
  const [categories, articles] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.article.findMany({ where: { publishedAt: { not: null } }, select: { slug: true } }),
  ]);
  return [...categories, ...articles].map((item) => ({ slug: item.slug }));
}

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
  if (!resolved) return { title: "No encontrado" };

  if (resolved.kind === "category") {
    return { title: `${resolved.category.name} — Insights`, alternates: { canonical: `/insights/${slug}` } };
  }
  const description = resolved.article.body.slice(0, 160);
  return {
    title: `${resolved.article.title} — Insights`,
    description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: { title: resolved.article.title, description, images: resolved.article.coverImageUrl ? [resolved.article.coverImageUrl] : undefined },
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
