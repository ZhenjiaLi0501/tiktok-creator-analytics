import type { EChartsOption } from 'echarts';
import { BaseEchart } from '@/components/charts/base-echart';

const trendOption: EChartsOption = {
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
    data: ['05-14', '05-15', '05-16', '05-17', '05-18', '05-19', '05-20'],
    axisLine: {
      lineStyle: {
        color: 'rgba(148,163,184,0.3)',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#94A3B8',
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
      data: [120, 200, 180, 260, 310, 280, 360],
      areaStyle: {
        opacity: 0.08,
      },
    },
    {
      name: '点赞量',
      type: 'line',
      smooth: true,
      data: [40, 72, 66, 96, 120, 108, 146],
    },
    {
      name: '评论量',
      type: 'line',
      smooth: true,
      data: [18, 26, 24, 40, 48, 44, 60],
    },
  ],
};

export function DashboardTrendPreview() {
  return <BaseEchart option={trendOption} height={360} />;
}
