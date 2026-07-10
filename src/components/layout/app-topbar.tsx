'use client';

import { usePathname } from 'next/navigation';

import { routeTitleMap } from '@/lib/navigation';

export function AppTopbar() {
  const pathname = usePathname();
  const currentTitle = routeTitleMap[pathname] ?? '平台工作台';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-douyin-dark/90 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-slate-500">
            平台工作台 / <span className="text-slate-300">{currentTitle}</span>
          </div>

          <h1 className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
            {currentTitle}
          </h1>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-400">
            全平台数据视角
          </div>

          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-douyin-red to-douyin-cyan" />
        </div>
      </div>
    </header>
  );
}
