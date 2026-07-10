'use client';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type FilterOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

type FilterBarProps<TValue extends string = string> = {
  label?: string;
  value: TValue;
  options: FilterOption<TValue>[];
  onChange: (value: TValue) => void;
  actions?: ReactNode;
  className?: string;
};

export function FilterBar<TValue extends string = string>({
  label = '筛选条件',
  value,
  options,
  onChange,
  actions,
  className,
}: FilterBarProps<TValue>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition',
                  isActive
                    ? 'border-douyin-red bg-douyin-red text-white shadow-lg shadow-douyin-red/20'
                    : 'border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
