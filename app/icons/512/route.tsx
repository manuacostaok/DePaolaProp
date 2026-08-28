import { ImageResponse } from "next/og";
import { DpIcon } from "@/lib/brand-icon";

export async function GET() {
  return new ImageResponse(<DpIcon size={512} padding={0.1} />, { width: 512, height: 512 });
}
