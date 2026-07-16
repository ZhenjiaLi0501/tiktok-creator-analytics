'use client';

import { useState } from 'react';

import { FilterBar, type FilterOption } from '@/components/business/filter-bar';
import { DashboardCategorySection } from '@/features/dashboard/components/dashboard-category-section';
import { DashboardOverviewSection } from '@/features/dashboard/components/dashboard-overview-section';
import { DashboardPublishTrendSection } from '@/features/dashboard/components/dashboard-publish-trend-section';
import { DashboardTrendSection } from '@/features/dashboard/components/dashboard-trend-section';
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

export function DashboardPageContent() {
  const [dateRange, setDateRange] = useState<DashboardDateRange>('7d');

  return (
    <div className="space-y-6">
      <FilterBar<DashboardDateRange>
        label="时间范围"
        value={dateRange}
        options={dateRangeOptions}
        onChange={setDateRange}
      />
      <DashboardOverviewSection dateRange={dateRange} />
      <DashboardTrendSection dateRange={dateRange} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <DashboardCategorySection dateRange={dateRange} />
        <DashboardPublishTrendSection dateRange={dateRange} />
      </div>
    </div>
  );
}
