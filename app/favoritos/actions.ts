"use server";

import { getPropertiesByIds } from "@/lib/search";

export async function fetchFavoriteProperties(ids: string[]) {
  return getPropertiesByIds(ids);
}
