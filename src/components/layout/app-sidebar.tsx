'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { workspaceNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-[#080B12] px-4 py-6 lg:block">
      <div className="mb-8">
        <div className="text-xl font-bold text-white">创作者运营平台</div>
        <div className="mt-1 text-xs text-slate-500">Creator Analytics</div>
      </div>

      <nav className="space-y-2">
        {workspaceNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-xl px-4 py-3 text-sm transition',
                isActive ? 'text-white/70' : 'text-slate-500',
              )}
            >
              <div className="font-medium">{item.label}</div>
              <div className={cn('mt-1 text-xs', isActive ? 'text-white/70' : 'text-slate-500')}>
                {item.description}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
