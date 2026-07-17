'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { BaseEchart } from '@/components/charts/base-echart';
import { ErrorState } from '@/components/common/error-state';
import { LoadingState } from '@/components/common/loading-state';
import { getDashboardCategory } from '@/services/dashboard';
import type { DashboardCategoryItem, DashboardDateRange } from '@/types/dashboard';
import { chartColorPalette, createItemTooltip } from '@/components/charts/chart-theme';
import { createPieTooltipFormatter } from '@/components/charts/chart-tooltip';

type DashboardCategoryChartProps = {
  dateRange: DashboardDateRange;
};

export function DashboardCategoryChart({ dateRange = '7d' }: DashboardCategoryChartProps) {
  const [data, setData] = useState<DashboardCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchCategory() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const categoryData = await getDashboardCategory({
          dateRange,
        });
        setData(categoryData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategory();
  }, [dateRange]);

  const option = useMemo<EChartsOption>(() => {
    return {
      backgroundColor: 'transparent',
      color: chartColorPalette,
      tooltip: createItemTooltip(
        createPieTooltipFormatter({
          valueLabel: '视频数',
          extraFields: [
            {
              key: 'playCount',
              label: '播放量',
            },
          ],
        }),
      ),
      legend: {
        bottom: 0,
        left: 'center',
        textStyle: {
          color: '#94A3B8',
        },
      },
      series: [
        {
          name: '内容分类',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '43%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: '#0B0F19',
            borderWidth: 3,
          },
          label: {
            color: '#CBD5E1',
            formatter: '{b}: {d}%',
          },
          labelLine: {
            lineStyle: {
              color: '#64748B',
            },
          },
          data: data.map((item) => ({
            name: item.category,
            value: item.videoCount,
            playCount: item.playCount,
          })),
        },
      ],
    };
  }, [data]);

  if (isLoading) {
    return (
      <LoadingState
        title="分类图表加载中"
        description="正在通过MSW Mock 接口获取内容分类占比数据"
        rows={2}
      />
    );
  }

  if (errorMessage) {
    return (
      <ErrorState
        title="分类数据加载失败"
        description="内容分类占比接口请求失败，请检查MSW MOCK配置"
        errorMessage={errorMessage}
      />
    );
  }

  return <BaseEchart option={option} height={340} />;
}
