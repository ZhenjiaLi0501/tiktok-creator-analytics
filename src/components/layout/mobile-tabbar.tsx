'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { workspaceNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-douyin-dark/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {workspaceNavItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs transition',
                isActive
                  ? 'bg-douyin-red text-white'
                  : 'text-slate-500 hover:bg-white/[0.06] hover:text-white',
              )}
            >
              <span className="line-clamp-1">{item.label.replace('平台', '')}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
