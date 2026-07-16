'use client';

import { SectionCard } from '@/components/business/section-card';
import { DashboardCategoryChart } from '@/features/dashboard/components/dashboard-category-chart';
import type { DashboardDateRange } from '@/types/dashboard';

type DashboardCategorySectionProps = {
  dateRange: DashboardDateRange;
};

export function DashboardCategorySection({ dateRange }: DashboardCategorySectionProps) {
  return (
    <SectionCard title="内容分类占比" description="展示各内容分类的视频数量、播放量和占比情况">
      <div className="space-y-6">
        <DashboardCategoryChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
