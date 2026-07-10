'use client';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  title?: string;
  description?: string;
  errorMessage?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
};
export function ErrorState({
  title = '数据加载失败',
  description = '当前数据请求出现异常，请稍后重试',
  errorMessage,
  icon,
  actionText = '重新加载',
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-6 py-10 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
        {icon ? icon : <span className="text-2xl font-bold">!</span>}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {errorMessage ? (
        <div className="mt-4 max-w-xl rounded-xl border border-red-500/20 bg-black/30 px-4 py-3 text-left text-xs leading-5 text-red-300">
          {errorMessage}
        </div>
      ) : null}
      {onAction ? (
        <Button className="mt-6" variant="destructive" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
