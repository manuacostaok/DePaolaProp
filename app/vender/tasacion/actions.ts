"use server";

import { PropertyType, PropertyCondition } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { estimateValuation } from "@/lib/valuation";

export interface ValuationSubmission {
  neighborhoodId: string;
  propertyType: PropertyType;
  coveredArea: number;
  totalArea?: number;
  rooms?: number;
  condition: PropertyCondition;
  hasGarage: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
}

export async function submitValuation(input: ValuationSubmission) {
  const estimate = await estimateValuation({
    neighborhoodId: input.neighborhoodId,
    propertyType: input.propertyType,
    coveredArea: input.coveredArea,
  });

  const defaultAgent = await prisma.agent.findFirst({ orderBy: { createdAt: "asc" } });

  const lead = await prisma.lead.create({
    data: {
      type: "TASAR",
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      neighborhoodId: input.neighborhoodId,
      agentId: defaultAgent?.id,
      filtersJson: {
        propertyType: input.propertyType,
        coveredArea: input.coveredArea,
        totalArea: input.totalArea,
        rooms: input.rooms,
        condition: input.condition,
        hasGarage: input.hasGarage,
      },
      valuationRequest: {
        create: {
          propertyType: input.propertyType,
          coveredArea: input.coveredArea,
          totalArea: input.totalArea,
          rooms: input.rooms,
          condition: input.condition,
          hasEnoughComparables: estimate.hasEnoughComparables,
          estimatedMin: estimate.estimatedMin,
          estimatedMax: estimate.estimatedMax,
          currency: estimate.currency,
          neighborhoodId: input.neighborhoodId,
        },
      },
    },
  });

  return { leadId: lead.id, ...estimate };
}

export async function scheduleValuationAppointment(input: {
  leadId: string;
  preferredDate: string;
  preferredTimeSlot: string;
}) {
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id: input.leadId } });
  const agentId = lead.agentId ?? (await prisma.agent.findFirstOrThrow({ orderBy: { createdAt: "asc" } })).id;

  await prisma.appointment.create({
    data: {
      leadId: lead.id,
      agentId,
      // Mediodía en vez de medianoche para que ninguna zona horaria lo
      // muestre como el día anterior o siguiente al elegido.
      preferredDate: new Date(`${input.preferredDate}T12:00:00`),
      preferredTimeSlot: input.preferredTimeSlot,
    },
  });

  return { ok: true };
}
