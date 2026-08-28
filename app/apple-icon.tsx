import { ImageResponse } from "next/og";
import { DpIcon } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<DpIcon size={180} padding={0.1} />, { ...size });
}
