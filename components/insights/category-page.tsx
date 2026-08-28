import Link from "next/link";
import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ui/article-card";

const CATEGORY_INTRO: Record<string, string> = {
  mercado: "Datos y tendencias de precios en Zona Norte, siempre con fuente real — nunca cifras inventadas.",
  inversion: "Oportunidades y criterio experto para quienes buscan renta o reventa en Zona Norte.",
  guias: "Guías paso a paso para comprar o alquilar con más información y menos incertidumbre.",
  arquitectura: "El patrimonio y los estilos de construcción que hacen a la identidad de cada barrio.",
  "zona-norte": "Todo lo que pasa en Zona Norte, barrio por barrio.",
  lifestyle: "Cómo se vive el día a día en cada zona, más allá de los metros cuadrados.",
  consejos: "Recomendaciones prácticas para vender, comprar o tasar mejor.",
  noticias: "Novedades de De Paola Propiedades y del mercado inmobiliario.",
};

export async function CategoryPage({ category }: { category: Category }) {
  const articles = await prisma.article.findMany({
    where: { categoryId: category.id, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <p className="mb-3 text-sm text-ink-soft">
        <Link href="/insights">Insights</Link> / {category.name}
      </p>
      <h1 className="mb-2 text-[clamp(26px,3vw,36px)]">{category.name}</h1>
      <p className="mb-8 max-w-xl text-ink-soft">{CATEGORY_INTRO[category.slug] ?? "Artículos de De Paola Insights."}</p>

      {articles.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">Todavía no hay artículos publicados en esta categoría.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
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
    </main>
  );
}
