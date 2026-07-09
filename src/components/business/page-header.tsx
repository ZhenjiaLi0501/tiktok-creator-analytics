import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ badge, title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-4 md:flex-row md:items-start md:justify-between', className)}
    >
      <div>
        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
