"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OperationType, PropertyType, PropertyCondition, PropertyStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface PropertyFormInput {
  title: string;
  slug: string;
  description: string;
  operationType: OperationType;
  propertyType: PropertyType;
  condition: PropertyCondition | "";
  status: PropertyStatus;
  price: string;
  currency: "ARS" | "USD" | "";
  coveredArea: string;
  totalArea: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  hasGarage: boolean;
  isFeatured: boolean;
  isSample: boolean;
  needsReview: boolean;
  neighborhoodId: string;
  address: string;
  agentId: string;
  officeId: string;
  imageUrls: string;
  featureLabels: string;
}

function parseNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

function buildImages(imageUrls: string) {
  return imageUrls
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url, index) => ({ url, order: index, isCover: index === 0 }));
}

function buildFeatures(featureLabels: string) {
  return featureLabels
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label) => ({ key: label.toLowerCase().replace(/\s+/g, "-"), label }));
}

export async function createProperty(input: PropertyFormInput) {
  const property = await prisma.property.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      operationType: input.operationType,
      propertyType: input.propertyType,
      condition: input.condition || undefined,
      status: input.status,
      price: parseNumber(input.price),
      currency: input.currency || undefined,
      coveredArea: parseNumber(input.coveredArea),
      totalArea: parseNumber(input.totalArea),
      rooms: parseNumber(input.rooms),
      bedrooms: parseNumber(input.bedrooms),
      bathrooms: parseNumber(input.bathrooms),
      hasGarage: input.hasGarage,
      isFeatured: input.isFeatured,
      isSample: input.isSample,
      needsReview: input.needsReview,
      publishedAt: new Date(),
      agent: { connect: { id: input.agentId } },
      office: input.officeId ? { connect: { id: input.officeId } } : undefined,
      location: {
        create: {
          address: input.address || null,
          neighborhoodId: input.neighborhoodId,
        },
      },
      images: { create: buildImages(input.imageUrls) },
      features: { create: buildFeatures(input.featureLabels) },
    },
  });

  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${property.id}`);
}

export async function updateProperty(propertyId: string, input: PropertyFormInput) {
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      operationType: input.operationType,
      propertyType: input.propertyType,
      condition: input.condition || null,
      status: input.status,
      price: parseNumber(input.price) ?? null,
      currency: input.currency || null,
      coveredArea: parseNumber(input.coveredArea) ?? null,
      totalArea: parseNumber(input.totalArea) ?? null,
      rooms: parseNumber(input.rooms) ?? null,
      bedrooms: parseNumber(input.bedrooms) ?? null,
      bathrooms: parseNumber(input.bathrooms) ?? null,
      hasGarage: input.hasGarage,
      isFeatured: input.isFeatured,
      isSample: input.isSample,
      needsReview: input.needsReview,
      agent: { connect: { id: input.agentId } },
      office: input.officeId ? { connect: { id: input.officeId } } : { disconnect: true },
      location: {
        update: {
          address: input.address || null,
          neighborhoodId: input.neighborhoodId,
        },
      },
      images: {
        deleteMany: {},
        create: buildImages(input.imageUrls),
      },
      features: {
        deleteMany: {},
        create: buildFeatures(input.featureLabels),
      },
    },
  });

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/propiedades/${input.slug}`);
}

export async function deleteProperty(propertyId: string) {
  await prisma.property.delete({ where: { id: propertyId } });
  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}
