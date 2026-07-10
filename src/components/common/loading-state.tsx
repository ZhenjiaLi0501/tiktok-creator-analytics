import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type LoadingStateProps = {
  title?: string;
  description?: string;
  rows?: number;
  className?: string;
};

export function LoadingState({
  title = '数据加载中',
  description = '正在获取最新数据，请稍后',
  rows = 4,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/[0.03] p-5', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-douyin-cyan/20 border-t-douyin-cyan" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="mt-4 h-8 w-32 bg-white/10" />
            <Skeleton className="mt-5 h-4 w-28 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
