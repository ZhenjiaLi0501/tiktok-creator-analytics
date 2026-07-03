import { DashboardMockTest } from '@/features/dashboard/components/dashboard-mock-test';

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">平台数据大盘</h2>
      <p className="mt-2 text-sm text-slate-400">
        展示全平台创作者数量、活跃创作者、视频发布量、播放量和互动率等核心指标。
      </p>

      <DashboardMockTest />
    </section>
  );
}
