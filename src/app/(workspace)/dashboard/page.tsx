import { PageHeader } from '@/components/business/page-header';
import { DashboardOverviewSection } from '@/features/dashboard/components/dashboard-overview-section';
import { DashboardTrendPreview } from '@/features/dashboard/components/dashboard-trend-preview';
import { SectionCard } from '@/components/business/section-card';
export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        badge="Dashboard"
        title="平台数据大盘"
        description="展示全平台创作者数量、活跃创作者、视频发布量、播放量和互动率等核心指标。"
      />
      <DashboardOverviewSection />
      <SectionCard title="核心指标趋势" description="展示播放量、点赞量和评论量的近7日变化趋势">
        <DashboardTrendPreview />
      </SectionCard>
    </section>
  );
}
