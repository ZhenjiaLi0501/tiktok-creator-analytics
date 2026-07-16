'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseEchart } from '@/components/charts/base-echart';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { getDashboardTrend } from '@/services/dashboard';
import type { DashboardDateRange, DashboardTrendPoint } from '@/types/dashboard';

type DashboardTrendChartProps = {
  dateRange: DashboardDateRange;
};

export function DashboardTrendChart({ dateRange = '7d' }: DashboardTrendChartProps) {
  const [data, setData] = useState<DashboardTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchTrend() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const trendData = await getDashboardTrend({
          dateRange,
          category: 'all',
        });
        setData(trendData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrend();
  }, [dateRange]);

  const option = useMemo<EChartsOption>(() => {
    return {
      backgroundColor: 'transparent',
      color: ['#FE2C55', '#00F2EA', '#8B5CF6'],
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
        boundaryGap: false,
        data: data.map((item) => item.date),
        axisLine: {
          lineStyle: {
            color: 'rgba(148,163,184,0.3)',
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
            color: 'rgba(148,163,184,0.12)',
          },
        },
      },
      series: [
        {
          name: '播放量',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.playCount),
          areaStyle: {
            opacity: 0.08,
          },
        },
        {
          name: '点赞量',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.likeCount),
        },
        {
          name: '评论量',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.commentCount),
        },
      ],
    };
  }, [data]);

  if (errorMessage) {
    return (
      <ErrorState
        title="趋势数据加载失败"
        description="核心指标趋势接口请求失败，请检查MSW Mock配置"
        errorMessage={errorMessage}
      />
    );
  }
  if (isLoading) {
    return (
      <LoadingState
        title="趋势数据加载中"
        description="正在获取播放量、点赞量和评论量趋势数据。"
        rows={2}
      />
    );
  }
  return <BaseEchart option={option} height={360} />;
}
