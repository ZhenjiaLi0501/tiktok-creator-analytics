'use client';

import { useEffect, useState } from 'react';

import { getDashboardOverview } from '@/services/dashboard';
import type { PlatformOverview } from '@/types/dashboard';

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
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
        <div className="text-sm text-slate-400">创作者总数</div>
        <div className="mt-3 text-3xl font-bold text-white">
          {data.totalCreators.toLocaleString()}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
        <div className="text-sm text-slate-400">活跃创作者</div>
        <div className="mt-3 text-3xl font-bold text-white">
          {data.activeCreators.toLocaleString()}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
        <div className="text-sm text-slate-400">视频总量</div>
        <div className="mt-3 text-3xl font-bold text-white">
          {data.totalVideos.toLocaleString()}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
        <div className="text-sm text-slate-400">平均互动率</div>
        <div className="mt-3 text-3xl font-bold text-white">{data.avgEngagementRate}%</div>
      </div>
    </div>
  );
}
