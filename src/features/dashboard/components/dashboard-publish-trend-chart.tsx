'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';

import { BaseEchart } from '@/components/charts/base-echart';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { EmptyState } from '@/components/common/empty-state';
import { getDashboardPublishTrend } from '@/services/dashboard';
import type { DashboardDateRange, DashboardPublishTrendPoint } from '@/types/dashboard';
import { createAxisTooltipFormatter } from '@/components/charts/chart-tooltip';
import {
  chartColors,
  createBaseGrid,
  createBaseLegend,
  createBaseTooltip,
  createCategoryXAxis,
  createValueYAxis,
} from '@/components/charts/chart-theme';

type DashboardPublishTrendChartProps = {
  dateRange?: DashboardDateRange;
};

export function DashboardPublishTrendChart({ dateRange = '7d' }: DashboardPublishTrendChartProps) {
  const [data, setData] = useState<DashboardPublishTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchPublishTrend() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const publishTrendData = await getDashboardPublishTrend({
          dateRange,
          category: 'all',
        });

        setData(publishTrendData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPublishTrend();
  }, [dateRange]);

  const option = useMemo<EChartsOption>(() => {
    return {
      backgroundColor: 'transparent',
      color: [chartColors.red, chartColors.cyan],
      tooltip: createBaseTooltip(createAxisTooltipFormatter()),
      legend: createBaseLegend(),
      grid: createBaseGrid(),
      xAxis: createCategoryXAxis(data.map((item) => item.date)),
      yAxis: createValueYAxis(),
      series: [
        {
          name: '发布视频数',
          type: 'bar',
          data: data.map((item) => item.publishedVideos),
          barMaxWidth: 28,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
          },
        },
        {
          name: '活跃创作者',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.activeCreators),
        },
      ],
    };
  }, [data]);

  if (errorMessage) {
    return (
      <ErrorState
        title="发布趋势加载失败"
        description="发布趋势接口请求失败，请检查 MSW Mock 配置。"
        errorMessage={errorMessage}
      />
    );
  }

  if (isLoading) {
    return (
      <LoadingState title="发布趋势加载中" description="正在获取抖音视频发布趋势数据。" rows={2} />
    );
  }
  if (data.length === 0) {
    return (
      <EmptyState title="暂无发布趋势数据" description="当前时间范围内没有可用的发布趋势数据。" />
    );
  }

  return <BaseEchart option={option} height={340} />;
}
