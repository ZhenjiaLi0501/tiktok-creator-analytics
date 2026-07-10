'use client';
import { useState } from 'react';
import { FilterBar, type FilterOption } from '@/components/business/filter-bar';
import { SectionCard } from '@/components/business/section-card';
import { DashboardMockTest } from '@/features/dashboard/components/dashboard-mock-test';
import type { DashboardDateRange } from '@/types/dashboard';

const dateRangeOptions: FilterOption<DashboardDateRange>[] = [
  {
    label: '今日',
    value: 'today',
  },
  {
    label: '近7天',
    value: '7d',
  },
  {
    label: '近30天',
    value: '30d',
  },
  {
    label: '自定义',
    value: 'custom',
  },
];

export function DashboardOverviewSection() {
  const [dateRange, setDateRange] = useState<DashboardDateRange>('7d');

  return (
    <SectionCard title="核心指标概览" description="通过MSW Mock 接口获取平台运营指标">
      <div className="space-y-6">
        <FilterBar
          label="时间范围"
          options={dateRangeOptions}
          value={dateRange}
          onChange={setDateRange}
        />
        <DashboardMockTest dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
