'use client';

import { useState } from 'react';
import { FilterBar, type FilterOption } from '@/components/business/filter-bar';
import { SectionCard } from '@/components/business/section-card';
import { DashboardTrendChart } from '@/features/dashboard/components/dashboard-trend-chart';
import type { DashboardDateRange } from '@/types/dashboard';

const dateRangeOptions: FilterOption<DashboardDateRange>[] = [
  {
    label: '今日',
    value: 'today',
  },
  {
    label: '近7日',
    value: '7d',
  },
  {
    label: '近30日',
    value: '30d',
  },
  {
    label: '自定义',
    value: 'custom',
  },
];

export function DashboardTrendSection() {
  const [dateRange, setDateRange] = useState<DashboardDateRange>('7d');
  return (
    <SectionCard title="核心指标趋势" description="展示播放量、点赞量和评论量的变化趋势">
      <div className="space-y-6">
        <FilterBar<DashboardDateRange>
          label="时间范围"
          value={dateRange}
          options={dateRangeOptions}
          onChange={setDateRange}
        />
        <DashboardTrendChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
