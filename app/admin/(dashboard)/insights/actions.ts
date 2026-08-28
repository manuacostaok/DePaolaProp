"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { CATEGORIES_REQUIRING_ZONE } from "@/lib/insights";

export interface ArticleFormInput {
  title: string;
  slug: string;
  body: string;
  coverImageUrl: string;
  authorName: string;
  categoryId: string;
  categorySlug: string;
  neighborhoodId: string;
  publish: boolean;
}

function validate(input: ArticleFormInput) {
  if (!input.categoryId) throw new Error("La categoría es obligatoria.");
  if (CATEGORIES_REQUIRING_ZONE.includes(input.categorySlug) && !input.neighborhoodId) {
    throw new Error("Esta categoría requiere una zona relacionada antes de publicar.");
  }
}

export async function createArticle(input: ArticleFormInput) {
  validate(input);
  const session = await getSession();
  const canPublish = session?.role === "ADMINISTRADOR";

  const article = await prisma.article.create({
    data: {
      title: input.title,
      slug: input.slug,
      body: input.body,
      coverImageUrl: input.coverImageUrl || null,
      authorName: input.authorName || null,
      category: { connect: { id: input.categoryId } },
      neighborhood: input.neighborhoodId ? { connect: { id: input.neighborhoodId } } : undefined,
      publishedAt: canPublish && input.publish ? new Date() : null,
    },
  });

  revalidatePath("/admin/insights");
  redirect(`/admin/insights/${article.id}`);
}

export async function updateArticle(articleId: string, input: ArticleFormInput) {
  validate(input);
  const session = await getSession();
  const canPublish = session?.role === "ADMINISTRADOR";

  const current = await prisma.article.findUniqueOrThrow({ where: { id: articleId } });

  await prisma.article.update({
    where: { id: articleId },
    data: {
      title: input.title,
      slug: input.slug,
      body: input.body,
      coverImageUrl: input.coverImageUrl || null,
      authorName: input.authorName || null,
      category: { connect: { id: input.categoryId } },
      neighborhood: input.neighborhoodId ? { connect: { id: input.neighborhoodId } } : { disconnect: true },
      publishedAt: canPublish ? (input.publish ? (current.publishedAt ?? new Date()) : null) : current.publishedAt,
    },
  });

  revalidatePath("/admin/insights");
  revalidatePath(`/admin/insights/${articleId}`);
  revalidatePath(`/insights/${input.slug}`);
}

export async function deleteArticle(articleId: string) {
  await prisma.article.delete({ where: { id: articleId } });
  revalidatePath("/admin/insights");
  redirect("/admin/insights");
}
