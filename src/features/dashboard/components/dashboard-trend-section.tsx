'use client';
import { SectionCard } from '@/components/business/section-card';
import { DashboardTrendChart } from '@/features/dashboard/components/dashboard-trend-chart';
import type { DashboardDateRange } from '@/types/dashboard';

type DashboardTrendSectionProps = {
  dateRange: DashboardDateRange;
};

export function DashboardTrendSection({ dateRange }: DashboardTrendSectionProps) {
  return (
    <SectionCard title="核心指标趋势" description="展示播放量、点赞量和评论量的变化趋势">
      <div className="space-y-6">
        <DashboardTrendChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
