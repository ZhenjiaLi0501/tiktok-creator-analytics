import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  {
    label: '平台总览',
    href: '/dashboard',
  },
  {
    label: '创作者分析',
    href: '/creators',
  },
  {
    label: '内容管理',
    href: '/content',
  },
  {
    label: '观众画像',
    href: '/audience',
  },
  {
    label: '创作助手',
    href: '/assistant',
  },
  {
    label: '系统设置',
    href: '/settings',
  },
];

type WorkspaceLayoutProps = {
  children: ReactNode;
};

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="bg-douyin-dark min-h-screen text-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-black/30 px-4 py-6 lg:block">
        <div className="mb-8">
          <div className="text-xl font-bold">创作者运营平台</div>
          <div className="mt-1 text-xs text-slate-400">Creator Analytics</div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="bg-douyin-dark/80 sticky top-0 z-10 border-b border-white/10 px-4 py-4 backdrop-blur lg:px-8">
          <div>
            <div className="text-sm text-slate-400">平台级数据分析后台</div>
            <h1 className="text-lg font-semibold">短视频创作者运营分析系统</h1>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
