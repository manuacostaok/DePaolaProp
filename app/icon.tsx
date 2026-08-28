import { ImageResponse } from "next/og";
import { DpIcon } from "@/lib/brand-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<DpIcon size={32} padding={0.06} />, { ...size });
}
