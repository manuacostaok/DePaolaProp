"use server";

import { Prisma, NewsletterSegment } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type NewsletterSubscribeResult = { ok: true } | { ok: false; error: string };

export async function subscribeToNewsletter(input: {
  email: string;
  segment: NewsletterSegment;
}): Promise<NewsletterSubscribeResult> {
  const email = input.email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }

  try {
    await prisma.newsletterSubscriber.create({ data: { email, segment: input.segment } });
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Ese email ya está suscripto." };
    }
    throw error;
  }
}
