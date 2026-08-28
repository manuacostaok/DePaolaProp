import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ArticleForm } from "@/components/admin/article-form";
import type { ArticleFormInput } from "@/app/admin/(dashboard)/insights/actions";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [article, categories, neighborhoods, session] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.neighborhood.findMany({ orderBy: { name: "asc" } }),
    getSession(),
  ]);

  if (!article) notFound();

  const category = categories.find((c) => c.id === article.categoryId);

  const initial: ArticleFormInput = {
    title: article.title,
    slug: article.slug,
    body: article.body,
    coverImageUrl: article.coverImageUrl ?? "",
    authorName: article.authorName ?? "",
    categoryId: article.categoryId,
    categorySlug: category?.slug ?? "",
    neighborhoodId: article.neighborhoodId ?? "",
    publish: article.publishedAt != null,
  };

  return (
    <div className="max-w-3xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Editar artículo</h1>
      <ArticleForm
        articleId={article.id}
        initial={initial}
        categoryOptions={categories.map((c) => ({ value: c.id, label: c.name, slug: c.slug }))}
        neighborhoodOptions={neighborhoods.map((n) => ({ value: n.id, label: n.name }))}
        canPublish={session?.role === "ADMINISTRADOR"}
        isPublished={article.publishedAt != null}
      />
    </div>
  );
}
