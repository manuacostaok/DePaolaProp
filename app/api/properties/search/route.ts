import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const result = await searchProperties({
    operacion: searchParams.get("operacion") ?? undefined,
    zona: searchParams.get("zona") ?? undefined,
    tipo: searchParams.get("tipo") ?? undefined,
    moneda: searchParams.get("moneda") ?? undefined,
    precioMin: searchParams.get("precioMin") ?? undefined,
    precioMax: searchParams.get("precioMax") ?? undefined,
    ambientes: searchParams.get("ambientes") ?? undefined,
    cochera: searchParams.get("cochera") ?? undefined,
  });

  return NextResponse.json(result);
}
