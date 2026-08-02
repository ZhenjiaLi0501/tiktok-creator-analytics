'use client';

import type { EChartsOption } from 'echarts';

import { BaseEchart } from '@/components/charts/base-echart';
import type { AudienceMetricItem } from '@/types/audience';

type AudienceDemographicChartProps = {
  title: string;
  data: AudienceMetricItem[];
  chartType: 'pie' | 'bar';
};

const chartColors = ['#ff3b70', '#5eead4', '#8b5cf6', '#f97316', '#22c55e'];

export function AudienceDemographicChart({
  title,
  data,
  chartType,
}: AudienceDemographicChartProps) {
  const option: EChartsOption =
    chartType === 'pie'
      ? {
          color: chartColors,
          tooltip: {
            trigger: 'item',
          },
          legend: {
            bottom: 0,
            textStyle: {
              color: '#94a3b8',
            },
          },
          series: [
            {
              name: title,
              type: 'pie',
              radius: ['45%', '68%'],
              center: ['50%', '42%'],
              avoidLabelOverlap: true,
              label: {
                color: '#cbd5e1',
                formatter: '{b}: {d}%',
              },
              labelLine: {
                lineStyle: {
                  color: '#64748b',
                },
              },
              data: data.map((item) => ({
                name: item.label,
                value: item.value,
              })),
            },
          ],
        }
      : {
          color: ['#ff3b70'],
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            top: 24,
            right: 24,
            bottom: 32,
            left: 48,
          },
          xAxis: {
            type: 'category',
            data: data.map((item) => item.label),
            axisLabel: {
              color: '#94a3b8',
            },
            axisLine: {
              lineStyle: {
                color: '#334155',
              },
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#94a3b8',
              formatter: '{value}%',
            },
            splitLine: {
              lineStyle: {
                color: '#1e293b',
              },
            },
          },
          series: [
            {
              name: title,
              type: 'bar',
              barWidth: 28,
              data: data.map((item) => item.value),
              itemStyle: {
                borderRadius: [8, 8, 0, 0],
              },
            },
          ],
        };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">基于中国区观众画像 mock 数据生成</p>
      </div>

      <BaseEchart option={option} height={320} />
    </div>
  );
}
