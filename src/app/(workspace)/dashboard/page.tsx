import { PageHeader } from '@/components/business/page-header';
import { DashboardPageContent } from '@/features/dashboard/components/dashboard-page-content';
export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        badge="Dashboard"
        title="平台数据大盘"
        description="展示全平台创作者数量、活跃创作者、视频发布量、播放量和互动率等核心指标。"
      />
      <DashboardPageContent />
    </section>
  );
}
