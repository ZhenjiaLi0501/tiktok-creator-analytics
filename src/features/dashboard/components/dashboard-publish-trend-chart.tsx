'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';

import { BaseEchart } from '@/components/charts/base-echart';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { getDashboardPublishTrend } from '@/services/dashboard';
import type { DashboardDateRange, DashboardPublishTrendPoint } from '@/types/dashboard';

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
      color: ['#FE2C55', '#00F2EA'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        top: 0,
        textStyle: {
          color: '#94A3B8',
        },
      },
      grid: {
        top: 48,
        left: 24,
        right: 24,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.date),
        axisLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.3)',
          },
        },
        axisLabel: {
          color: '#94A3B8',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#94A3B8',
          formatter: (value: number) => {
            if (value >= 10000) {
              return `${Math.round(value / 10000)}w`;
            }

            return String(value);
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.12)',
          },
        },
      },
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

  return <BaseEchart option={option} height={340} />;
}
