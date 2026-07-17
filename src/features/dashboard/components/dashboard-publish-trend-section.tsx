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
      description="基于热门视频样本的 publish_time 统计视频发布时间分布与创作者活跃度。"
    >
      <div className="space-y-6">
        <DashboardPublishTrendChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
