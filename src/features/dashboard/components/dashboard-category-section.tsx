'use client';

import { useState } from 'react';
import { FilterBar, type FilterOption } from '@/components/business/filter-bar';
import { SectionCard } from '@/components/business/section-card';
import { DashboardCategoryChart } from '@/features/dashboard/components/dashboard-category-chart';
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

export function DashboardCategorySection() {
  const [dateRange, setDateRange] = useState<DashboardDateRange>('7d');
  return (
    <SectionCard title="内容分类占比" description="展示各内容分类的视频数量、播放量和占比情况">
      <div className="space-y-6">
        <FilterBar<DashboardDateRange>
          label="时间范围"
          value={dateRange}
          options={dateRangeOptions}
          onChange={setDateRange}
        />
        <DashboardCategoryChart dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
