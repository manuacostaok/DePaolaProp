export default function Loading() {
  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <div className="mb-10 max-w-[640px] animate-pulse">
        <div className="h-[42px] w-2/3 rounded bg-bg-alt" />
        <div className="mt-4 h-4 w-full max-w-[480px] rounded bg-bg-alt" />
      </div>
      <div className="mb-8 h-[68px] animate-pulse rounded-card bg-bg-alt" />
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-bg-alt" />
        <div className="h-9 w-40 animate-pulse rounded bg-bg-alt" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[4/3] rounded-card bg-bg-alt" />
            <div className="mt-4 h-3 w-1/3 rounded bg-bg-alt" />
            <div className="mt-2 h-5 w-2/3 rounded bg-bg-alt" />
            <div className="mt-2 h-5 w-1/3 rounded bg-bg-alt" />
          </div>
        ))}
      </div>
    </main>
  );
}
