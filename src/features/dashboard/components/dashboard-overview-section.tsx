'use client';
import { SectionCard } from '@/components/business/section-card';
import { DashboardMockTest } from '@/features/dashboard/components/dashboard-mock-test';
import type { DashboardDateRange } from '@/types/dashboard';

type DashboardOverviewSectionProps = {
  dateRange: DashboardDateRange;
};

export function DashboardOverviewSection({ dateRange }: DashboardOverviewSectionProps) {
  return (
    <SectionCard title="核心指标概览" description="通过MSW Mock 接口获取平台运营指标">
      <div className="space-y-6">
        <DashboardMockTest dateRange={dateRange} />
      </div>
    </SectionCard>
  );
}
