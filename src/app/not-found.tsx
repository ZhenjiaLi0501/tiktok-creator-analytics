import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-douyin-dark px-4 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] text-2xl font-bold text-douyin-cyan">
          404
        </div>
        <h1 className="mt-6 text-2xl font-bold">页面未找到</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">当前访问的页面不存在</p>
        <Button className="mt-8">
          <Link href="/dashboard">返回首页</Link>
        </Button>
      </section>
    </main>
  );
}
