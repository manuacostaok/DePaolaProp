import { cn } from "@/lib/cn";

export interface ChapterHeadingProps {
  // La Home se lee como un recorrido en capítulos (Identidad → Propiedades →
  // Zonas → ...) — la numeración acá es un device editorial real, no
  // decoración: marca un orden que efectivamente existe. Ver DESIGN.md
  // Etapa 2.
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  light?: boolean;
  className?: string;
}

export function ChapterHeading({ index, eyebrow, title, description, action, light = false, className }: ChapterHeadingProps) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 sm:mb-14", className)}>
      <div className="flex gap-4 sm:gap-6">
        <span className={cn("hidden font-display text-base sm:block", light ? "text-white/35" : "text-brand/35")} aria-hidden="true">
          {index}
        </span>
        <div>
          <span className={cn("mb-2.5 block text-[11px] font-medium uppercase tracking-[0.12em]", light ? "text-white/70" : "text-brand")}>
            {eyebrow}
          </span>
          <h2 className={cn("max-w-xl text-balance text-[clamp(28px,3.6vw,42px)]", light && "text-white")}>{title}</h2>
          {description && <p className={cn("mt-3 max-w-md text-[15px]", light ? "text-white/75" : "text-ink-soft")}>{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
