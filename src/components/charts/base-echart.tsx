'use client';

import { useEffect, useRef } from 'react';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { cn } from '@/lib/utils';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  CanvasRenderer,
]);

type BaseEchartProps = {
  option: EChartsOption;
  height?: string | number;
  loading?: boolean;
  className?: string;
};

export function BaseEchart({ option, height = 320, loading = false, className }: BaseEchartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, 'dark');
    chartRef.current = chart;
    return () => {
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setOption(option, true);
  }, [option]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (loading) {
      chart.showLoading('default', {
        text: '加载中...',
        color: '#00F2EA',
        textColor: '#94A3B8',
        maskColor: 'rgba(11,15,25,0.35)',
      });
    } else {
      chart.hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('w-full', className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}
