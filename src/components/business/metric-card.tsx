import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  icon?: ReactNode;
  className?: string;
};

const trendClassNameMap = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-slate-400',
};
export function MetricCard({ title, value, description, trend, icon, className }: MetricCardProps) {
  return (
    <Card
      className={cn('border-white/10 bg-white/[0.04] transition hover:bg-white/[0.06]', className)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
          </div>
          {icon ? (
            <div className="item-center flex h-10 w-10 justify-center rounded-xl bg-white/[0.06] text-douyin-cyan">
              {icon}
            </div>
          ) : null}
        </div>
        {description || trend ? (
          <div className="item-center mt-4 flex gap-2 text-sm">
            {trend ? <span className={trendClassNameMap[trend.type]}>{trend.value}</span> : null}
            {description ? <span className="text-slate-500">{description}</span> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
