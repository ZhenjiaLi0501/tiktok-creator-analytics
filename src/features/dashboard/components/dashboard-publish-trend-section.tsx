'use client';

import { SectionCard } from '@/components/business/section-card';
import { DashboardPublishTrendChart } from '@/features/dashboard/components/dashboard-publish-trend-chart';
import type { DashboardDateRange } from '@/types/dashboard';

type DashboardPublishTrendSectionProps = {
  dateRange: DashboardDateRange;
};

export function DashboardPublishTrendSection({ dateRange }: DashboardPublishTrendSectionProps) {
  return (
    <SectionCard
      title="视频发布趋势"
      description="展示抖音平台视频发布量与活跃创作者数量的变化趋势。"
    >
      <div className="space-y-6">
        <DashboardPublishTrendChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
