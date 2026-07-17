'use client';

import { useEffect, useState } from 'react';

import { getDashboardOverview } from '@/services/dashboard';
import { MetricCard } from '@/components/business/metric-card';
import type { DashboardDateRange, PlatformOverview } from '@/types/dashboard';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { formatCompactNumber, formatPercent, formatSignedPercent } from '@/lib/format';

type DashboardMockTestProps = {
  dateRange?: DashboardDateRange;
};

export function DashboardMockTest({ dateRange = '7d' }: DashboardMockTestProps) {
  const [data, setData] = useState<PlatformOverview | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchOverview() {
      try {
        const overview = await getDashboardOverview({
          dateRange,
          category: 'all',
        });

        setData(overview);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    fetchOverview();
  }, [dateRange]);

  if (errorMessage) {
    return (
      <ErrorState
        title="Mock 接口请求失败"
        description="当前数据请求出现异常，请稍后重试"
        errorMessage={errorMessage}
        actionText="重新加载"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!data) {
    return (
      <LoadingState
        title="核心指标加载中"
        description="正在通过MSW Mock 接口获取平台运营指标"
        rows={4}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="创作者总数"
        value={formatCompactNumber(data.totalCreators)}
        trend={{ value: formatSignedPercent(12.5), type: 'up' }}
        description="较上周增长"
      />

      <MetricCard
        title="活跃创作者"
        value={formatCompactNumber(data.activeCreators)}
        trend={{ value: formatSignedPercent(8.3), type: 'up' }}
        description="较上周增长"
      />

      <MetricCard
        title="视频总量"
        value={formatCompactNumber(data.totalVideos)}
        trend={{ value: formatSignedPercent(5.2), type: 'up' }}
        description="较上周增长"
      />

      <MetricCard
        title="平均互动率"
        value={formatPercent(data.avgEngagementRate)}
        trend={{ value: formatSignedPercent(1.1), type: 'up' }}
        description="较上周增长"
      />
    </div>
  );
}
