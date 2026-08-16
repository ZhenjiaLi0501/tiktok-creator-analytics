'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { FilterBar, type FilterOption } from '@/components/business/filter-bar';
import { DashboardOverviewSection } from '@/features/dashboard/components/dashboard-overview-section';
import type { DashboardDateRange } from '@/types/dashboard';

function DashboardChartSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-800" />
      <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-800" />
      <div className="mt-5 flex h-[320px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-sm text-slate-500">
        {title}
      </div>
    </section>
  );
}
const DashboardTrendSection = dynamic(
  () => import('./dashboard-trend-section').then((module) => module.DashboardTrendSection),
  {
    ssr: false,
    loading: () => <DashboardChartSectionSkeleton title="核心指标趋势加载中..." />,
  },
);

const DashboardCategorySection = dynamic(
  () => import('./dashboard-category-section').then((module) => module.DashboardCategorySection),
  {
    ssr: false,
    loading: () => <DashboardChartSectionSkeleton title="内容分类占比加载中..." />,
  },
);

const DashboardPublishTrendSection = dynamic(
  () =>
    import('./dashboard-publish-trend-section').then(
      (module) => module.DashboardPublishTrendSection,
    ),
  {
    ssr: false,
    loading: () => <DashboardChartSectionSkeleton title="视频发布趋势加载中..." />,
  },
);

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
