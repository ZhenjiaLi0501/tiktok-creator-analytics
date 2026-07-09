'use client';

import { useEffect, useState } from 'react';

import { getDashboardOverview } from '@/services/dashboard';
import type { PlatformOverview } from '@/types/dashboard';
import { MetricCard } from '@/components/business/metric-card';

export function DashboardMockTest() {
  const [data, setData] = useState<PlatformOverview | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchOverview() {
      try {
        const overview = await getDashboardOverview({
          dataRange: '7d',
          platform: 'douyin',
          category: 'all',
        });

        setData(overview);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    fetchOverview();
  }, []);

  if (errorMessage) {
    return (
      <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        Mock 接口请求失败：{errorMessage}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">
        正在请求 Mock 数据...
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="创作者总数"
        value={data.totalCreators.toLocaleString()}
        trend={{ value: '+12.5%', type: 'up' }}
        description="较上周增长"
      />

      <MetricCard
        title="活跃创作者"
        value={data.activeCreators.toLocaleString()}
        trend={{ value: '+8.3%', type: 'up' }}
        description="较上周增长"
      />

      <MetricCard
        title="视频总量"
        value={data.totalVideos.toLocaleString()}
        trend={{ value: '+5.2%', type: 'up' }}
        description="较上周增长"
      />

      <MetricCard
        title="平均互动率"
        value={`${data.avgEngagementRate}%`}
        trend={{ value: '+1.1%', type: 'up' }}
        description="较上周增长"
      />
    </div>
  );
}
