import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ArticleForm } from "@/components/admin/article-form";
import type { ArticleFormInput } from "@/app/admin/(dashboard)/insights/actions";

const EMPTY: ArticleFormInput = {
  title: "",
  slug: "",
  body: "",
  coverImageUrl: "",
  authorName: "",
  categoryId: "",
  categorySlug: "",
  neighborhoodId: "",
  publish: false,
};

export default async function NewArticlePage() {
  const [categories, neighborhoods, session] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.neighborhood.findMany({ orderBy: { name: "asc" } }),
    getSession(),
  ]);

  return (
    <div className="max-w-3xl rounded-card border border-line bg-white p-6">
      <h1 className="mb-6 text-2xl">Nuevo artículo</h1>
      <ArticleForm
        initial={EMPTY}
        categoryOptions={categories.map((c) => ({ value: c.id, label: c.name, slug: c.slug }))}
        neighborhoodOptions={neighborhoods.map((n) => ({ value: n.id, label: n.name }))}
        canPublish={session?.role === "ADMINISTRADOR"}
        isPublished={false}
      />
    </div>
  );
}
