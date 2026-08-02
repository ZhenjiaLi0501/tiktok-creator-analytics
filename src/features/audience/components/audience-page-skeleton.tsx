import { Skeleton } from '@/components/ui/skeleton';

function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-7 w-32" />
      <Skeleton className="mt-3 h-3 w-40" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-2 h-3 w-48" />
      <Skeleton className="mt-6 h-[260px] w-full rounded-xl" />
    </div>
  );
}

export function AudiencePageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-80" />

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <MetricSkeleton key={index} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-80" />

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <ChartSkeleton key={index} />
          ))}
        </div>
      </section>

      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}
