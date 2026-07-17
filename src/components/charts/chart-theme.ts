import type { EChartsOption } from 'echarts';
import { formatCompactNumber } from '@/lib/format';

export const chartColors = {
  red: '#FE2C55',
  cyan: '#00F2EA',
  purple: '#8B5CF6',
  orange: '#F97316',
  green: '#22C55E',
  blue: '#38BDF8',
};

export const chartColorPalette = [
  chartColors.red,
  chartColors.cyan,
  chartColors.purple,
  chartColors.orange,
  chartColors.green,
  chartColors.blue,
];

export function createBaseTooltip(): EChartsOption['tooltip'] {
  return {
    trigger: 'axis',
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderColor: 'rgba(255,255,255,0.12)',
    textStyle: {
      color: '#E2E8F0',
    },
  };
}

export function createItemTooltip(): EChartsOption['tooltip'] {
  return {
    trigger: 'item',
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderColor: 'rgba(255,255,255,0.12)',
    textStyle: {
      color: '#E2E8F0',
    },
  };
}

export function createBaseLegend(): EChartsOption['legend'] {
  return {
    top: 0,
    textStyle: {
      color: '#94A3B8',
    },
  };
}

export function createBaseGrid(): EChartsOption['grid'] {
  return {
    top: 48,
    left: 24,
    right: 24,
    bottom: 24,
    containLabel: true,
  };
}

export function createCategoryXAxis(data: string[]): EChartsOption['xAxis'] {
  return {
    type: 'category',
    data,
    axisLine: {
      lineStyle: {
        color: 'rgba(148,163,184,0.3)',
      },
    },
    axisLabel: {
      color: '#94A3B8',
    },
  };
}

export function createValueYAxis(): EChartsOption['yAxis'] {
  return {
    type: 'value',
    axisLabel: {
      color: '#94A3B8',
      formatter: (value: number) => formatCompactNumber(value),
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(148,163,184,0.12)',
      },
    },
  };
}
