import Image from "next/image";
import Link from "next/link";
import type { Article, Category, Neighborhood } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ui/article-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryCTA, estimateReadingTime } from "@/lib/insights";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site-url";

type ArticleWithRelations = Article & { category: Category; neighborhood: Neighborhood | null };

export async function ArticlePage({ article }: { article: ArticleWithRelations }) {
  const related = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      publishedAt: { not: null },
      OR: [{ categoryId: article.categoryId }, { neighborhoodId: article.neighborhoodId ?? undefined }],
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  const cta = getCategoryCTA(article.category.slug, article.neighborhood?.slug);
  const readingTime = estimateReadingTime(article.body);

  return (
    <main className="mx-auto max-w-[760px] px-6 py-10 sm:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.body.slice(0, 160),
          image: article.coverImageUrl ?? undefined,
          datePublished: article.publishedAt?.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          author: { "@type": "Organization", name: article.authorName ?? "De Paola Propiedades" },
          publisher: { "@type": "Organization", name: "De Paola Propiedades" },
          mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
        }}
      />
      <p className="mb-3 text-sm text-ink-soft">
        <Link href="/insights">Insights</Link> / <Link href={`/insights/${article.category.slug}`}>{article.category.name}</Link>
      </p>

      <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-card bg-bg-alt">
        <Image src={article.coverImageUrl ?? "/placeholder-property.svg"} alt={article.title} fill className="object-cover" priority />
      </div>

      {article.isSample && (
        <Badge variant="dark" className="mb-3">
          Ejemplo
        </Badge>
      )}
      <h1 className="mb-3">{article.title}</h1>
      <p className="mb-8 text-sm text-ink-soft">
        {article.category.name} · {article.publishedAt?.toLocaleDateString("es-AR")} · {readingTime} min de lectura
        {article.authorName ? ` · Por ${article.authorName}` : ""}
      </p>

      <div className="mb-10 whitespace-pre-line text-[17px] leading-relaxed text-ink">{article.body}</div>

      <div className="mb-12 rounded-card bg-brand-tint p-6 text-center">
        <p className="mb-3 text-brand-dark">¿Te interesa dar el siguiente paso?</p>
        <Link href={cta.href} className={buttonVariants()}>
          {cta.label}
        </Link>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl">Te puede interesar</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard
                key={item.id}
                href={`/insights/${item.slug}`}
                title={item.title}
                categoryName={item.category.name}
                imageUrl={item.coverImageUrl ?? "/placeholder-property.svg"}
                imageAlt={item.title}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
