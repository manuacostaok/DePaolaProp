"use server";

import { revalidatePath } from "next/cache";
import { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  await prisma.lead.update({ where: { id: leadId }, data: { status } });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

export async function reassignLead(leadId: string, agentId: string) {
  await prisma.lead.update({ where: { id: leadId }, data: { agentId: agentId || null } });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

export async function updateLeadNotes(leadId: string, internalNotes: string) {
  await prisma.lead.update({ where: { id: leadId }, data: { internalNotes } });
  revalidatePath(`/admin/leads/${leadId}`);
}
