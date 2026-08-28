import { ImageResponse } from "next/og";
import { DpIcon } from "@/lib/brand-icon";

export async function GET() {
  return new ImageResponse(<DpIcon size={192} padding={0.1} />, { width: 192, height: 192 });
}
