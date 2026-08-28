import { SITE } from "@/lib/nav";
import { cn } from "@/lib/cn";

// Bounding box of the "dP" mark within the real logo file (1784x526),
// measured by sampling opaque pixels directly from the source PNG —
// the wordmark starts past x≈518, so this crops the icon-only glyph.
const LOGO_NATURAL_WIDTH = 1784;
const LOGO_NATURAL_HEIGHT = 526;
const CROP_X = 112;
const CROP_Y = 90;
const CROP_WIDTH = 410;
const CROP_HEIGHT = 296;

export const BRAND_NAVY = "#00385C";
export const LOGO_ASPECT_RATIO = LOGO_NATURAL_WIDTH / LOGO_NATURAL_HEIGHT;

// Logo completo (ícono + wordmark) recoloreable: usa el PNG real como
// máscara CSS en vez de <img>, así el mismo logo puede pintarse crema
// sobre el hero navy o navy sobre el header claro sin dos assets.
export function LogoMark({ className, colorClassName }: { className?: string; colorClassName: string }) {
  return (
    <span
      role="img"
      aria-label={SITE.name}
      className={cn(className, colorClassName)}
      style={{
        display: "inline-block",
        aspectRatio: `${LOGO_NATURAL_WIDTH} / ${LOGO_NATURAL_HEIGHT}`,
        WebkitMaskImage: `url(${SITE.logoUrl})`,
        maskImage: `url(${SITE.logoUrl})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function DpIcon({ size, padding = 0.14 }: { size: number; padding?: number }) {
  const iconWidth = size * (1 - padding * 2);
  const iconHeight = iconWidth * (CROP_HEIGHT / CROP_WIDTH);
  const scale = iconWidth / CROP_WIDTH;
  const bgWidth = LOGO_NATURAL_WIDTH * scale;
  const bgHeight = LOGO_NATURAL_HEIGHT * scale;
  const bgPosX = -(CROP_X * scale);
  const bgPosY = -(CROP_Y * scale);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_NAVY,
      }}
    >
      <div
        style={{
          width: iconWidth,
          height: iconHeight,
          backgroundImage: `url(${SITE.logoUrl})`,
          backgroundSize: `${bgWidth}px ${bgHeight}px`,
          backgroundPosition: `${bgPosX}px ${bgPosY}px`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
