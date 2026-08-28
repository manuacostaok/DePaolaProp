import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default async function AdminInsightsPage() {
  const articles = await prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Insights</h1>
        <Link href="/admin/insights/new" className={buttonVariants({ size: "sm" })}>
          Nuevo artículo
        </Link>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line bg-bg-alt text-left text-ink-soft">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Autor</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-line last:border-0 hover:bg-brand-tint/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/insights/${article.id}`} className="font-medium text-ink hover:text-brand-dark">
                    {article.title}
                  </Link>
                  {article.isSample && (
                    <Badge variant="dark" className="ml-2">
                      Ejemplo
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">{article.category.name}</td>
                <td className="px-4 py-3">{article.publishedAt ? "Publicado" : "Borrador"}</td>
                <td className="px-4 py-3">{article.authorName ?? "—"}</td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                  No hay artículos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
