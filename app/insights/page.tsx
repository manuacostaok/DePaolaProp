import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ui/article-card";
import { NewsletterForm } from "@/components/insights/newsletter-form";

export const metadata: Metadata = {
  title: "Novedades",
  description: "Criterio experto sobre Zona Norte — mercado, guías, zonas y más.",
  alternates: { canonical: "/insights" },
};
export const revalidate = 300;

export default async function InsightsPage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const [featured, ...rest] = articles;

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.12em] text-brand">Editorial</span>
      <h1 className="mb-3 text-[clamp(28px,3.4vw,40px)]">Novedades</h1>
      <p className="mb-10 max-w-xl text-ink-soft">Criterio experto sobre Zona Norte — mercado, guías, zonas y más.</p>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link key={category.id} href={`/insights/${category.slug}`} className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft hover:bg-brand-tint">
            {category.name}
          </Link>
        ))}
      </div>

      {featured && (
        <Link href={`/insights/${featured.slug}`} className="group mb-16 grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-bg-alt">
            <Image
              src={featured.coverImageUrl ?? "/placeholder-property.svg"}
              alt={featured.title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[430ms] ease-brand group-hover:scale-[1.05]"
            />
          </div>
          <div>
            <span className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-brand">{featured.category.name}</span>
            <h2 className="mb-2 text-balance text-[clamp(24px,3vw,34px)] group-hover:text-brand-dark">{featured.title}</h2>
            <p className="text-[13px] text-ink-soft">{featured.publishedAt?.toLocaleDateString("es-AR")}</p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              href={`/insights/${article.slug}`}
              title={article.title}
              categoryName={article.category.name}
              imageUrl={article.coverImageUrl ?? "/placeholder-property.svg"}
              imageAlt={article.title}
              publishedAt={article.publishedAt?.toLocaleDateString("es-AR")}
            />
          ))}
        </div>
      )}

      {articles.length === 0 && <p className="py-16 text-center text-ink-soft">Todavía no hay artículos publicados.</p>}

      <div className="mt-12 max-w-xl">
        <NewsletterForm />
      </div>
    </main>
  );
}
