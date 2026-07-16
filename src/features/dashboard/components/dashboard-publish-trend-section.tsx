'use client';

import { useState } from 'react';

import { FilterBar, type FilterOption } from '@/components/business/filter-bar';
import { SectionCard } from '@/components/business/section-card';
import { DashboardPublishTrendChart } from '@/features/dashboard/components/dashboard-publish-trend-chart';
import type { DashboardDateRange } from '@/types/dashboard';

const dateRangeOptions: FilterOption<DashboardDateRange>[] = [
  {
    label: '今日',
    value: 'today',
  },
  {
    label: '近 7 日',
    value: '7d',
  },
  {
    label: '近 30 日',
    value: '30d',
  },
  {
    label: '自定义',
    value: 'custom',
  },
];

export function DashboardPublishTrendSection() {
  const [dateRange, setDateRange] = useState<DashboardDateRange>('7d');

  return (
    <SectionCard
      title="视频发布趋势"
      description="展示抖音平台视频发布量与活跃创作者数量的变化趋势。"
    >
      <div className="space-y-6">
        <FilterBar<DashboardDateRange>
          label="时间范围"
          value={dateRange}
          options={dateRangeOptions}
          onChange={setDateRange}
        />

        <DashboardPublishTrendChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
