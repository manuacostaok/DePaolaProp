"use server";

import { LeadType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateLeadInput {
  type: LeadType;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  neighborhoodId?: string;
  developmentId?: string;
  message?: string;
  filtersJson?: Record<string, unknown>;
}

export async function createLead(input: CreateLeadInput) {
  const defaultAgent = await prisma.agent.findFirst({ orderBy: { createdAt: "asc" } });

  const lead = await prisma.lead.create({
    data: {
      type: input.type,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      neighborhoodId: input.neighborhoodId,
      developmentId: input.developmentId,
      message: input.message,
      agentId: defaultAgent?.id,
      filtersJson: input.filtersJson as Prisma.InputJsonValue | undefined,
    },
  });

  return { leadId: lead.id };
}
