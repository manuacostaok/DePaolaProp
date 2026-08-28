export function StepProgress({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className={`h-1.5 w-full rounded-full ${stepNumber <= current ? "bg-brand" : "bg-line"}`} />
            <span className={`text-[11px] ${stepNumber === current ? "font-semibold text-brand-dark" : "text-ink-soft"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
