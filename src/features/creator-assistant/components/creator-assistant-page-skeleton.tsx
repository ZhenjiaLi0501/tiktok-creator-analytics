import { Skeleton } from '@/components/ui/skeleton';

function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-7 w-28" />
      <Skeleton className="mt-3 h-3 w-36" />
    </div>
  );
}

export function CreatorAssistantPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-80" />

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <MetricSkeleton key={index} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-2 h-4 w-72" />

          <div className="mt-5 space-y-3">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-2 h-4 w-64" />

          <div className="mt-5 space-y-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
