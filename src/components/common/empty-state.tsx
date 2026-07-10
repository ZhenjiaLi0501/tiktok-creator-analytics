import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-douyin-cyan">
          {icon}
        </div>
      ) : (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-douyin-cyan">
          <span className="text-xl">∅</span>
        </div>
      )}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      ) : null}
      {actionText && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
