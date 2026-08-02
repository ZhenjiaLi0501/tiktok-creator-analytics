'use client';

import * as d3 from 'd3';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/format';
import type { AudienceRegion } from '@/types/audience';

type ChinaAudienceHeatmapProps = {
  regions: AudienceRegion[];
  selectedRegionId: string;
  onRegionSelect: (regionId: string) => void;
};

type HeatPoint = AudienceRegion & {
  x: number;
  y: number;
  radius: number;
  color: string;
};

const mapWidth = 760;
const mapHeight = 500;

export function ChinaAudienceHeatmap({
  regions,
  selectedRegionId,
  onRegionSelect,
}: ChinaAudienceHeatmapProps) {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const projection = useMemo(
    () =>
      d3
        .geoMercator()
        .center([104, 35])
        .scale(650)
        .translate([mapWidth / 2, mapHeight / 2]),
    [],
  );
  const graticulePath = useMemo(() => {
    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule().extent([
      [73, 18],
      [135, 54],
    ]);

    return path(graticule()) ?? undefined;
  }, [projection]);

  const heatPoints = useMemo<HeatPoint[]>(() => {
    if (regions.length === 0) return [];
    const maxAudience = d3.max(regions, (region) => region.audienceCount) ?? 1;
    const radiusScale = d3.scaleSqrt().domain([0, maxAudience]).range([8, 34]);
    const colorScale = d3
      .scaleSequential()
      .domain([0, maxAudience])
      .interpolator(d3.interpolateRgb('#22d3ee', '#ff3b70'));
    return regions
      .map((region) => {
        const projectedPoint = projection([region.lng, region.lat]);
        if (!projectedPoint) return null;
        const [x, y] = projectedPoint;

        return {
          ...region,
          x,
          y,
          radius: radiusScale(region.audienceCount),
          color: colorScale(region.audienceCount),
        };
      })
      .filter(Boolean) as HeatPoint[];
  }, [regions, projection]);
  const activePoint =
    heatPoints.find((point) => point.id === hoveredRegionId) ??
    heatPoints.find((point) => point.id === selectedRegionId) ??
    null;
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">中国区域热力图</h2>
          <p className="mt-1 text-sm text-slate-400">
            基于省份中心点和观众规模生成热力气泡，点击省份可下钻查看画像详情。
          </p>
        </div>

        <div className="text-xs text-slate-500">气泡越大、颜色越亮，代表观众规模越高</div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="img"
          aria-label="中国区域观众热力图"
          className="h-[520px] w-full"
        >
          <defs>
            <radialGradient id="china-map-bg" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            <filter id="heat-glow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={mapWidth} height={mapHeight} fill="url(#china-map-bg)" />

          {graticulePath ? (
            <path
              d={graticulePath}
              fill="none"
              stroke="#1e293b"
              strokeWidth={1}
              strokeDasharray="4 8"
              opacity={0.7}
            />
          ) : null}

          <text x={32} y={42} fill="#64748b" fontSize={12}>
            中国区重点省市观众分布
          </text>

          {heatPoints.map((point) => {
            const selected = point.id === selectedRegionId;
            const hovered = point.id === hoveredRegionId;

            return (
              <g
                key={point.id}
                transform={`translate(${point.x}, ${point.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredRegionId(point.id)}
                onMouseLeave={() => setHoveredRegionId(null)}
                onClick={() => onRegionSelect(point.id)}
              >
                <circle
                  r={point.radius * 1.9}
                  fill={point.color}
                  opacity={selected || hovered ? 0.28 : 0.14}
                  filter="url(#heat-glow)"
                />

                <circle
                  r={point.radius}
                  fill={point.color}
                  opacity={selected || hovered ? 0.95 : 0.72}
                  stroke={selected ? '#f8fafc' : '#0f172a'}
                  strokeWidth={selected ? 2.5 : 1}
                />

                <text
                  y={point.radius + 18}
                  textAnchor="middle"
                  fill={selected || hovered ? '#f8fafc' : '#cbd5e1'}
                  fontSize={selected || hovered ? 13 : 11}
                  fontWeight={selected || hovered ? 700 : 500}
                >
                  {point.name}
                </text>
              </g>
            );
          })}
        </svg>

        {activePoint ? (
          <div
            style={{
              left: `${(activePoint.x / mapWidth) * 100}%`,
              top: `${(activePoint.y / mapHeight) * 100}%`,
            }}
            className="pointer-events-none absolute z-10 w-[190px] -translate-x-1/2 translate-y-5 rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-slate-100">{activePoint.name}</div>
              <div className="rounded-full bg-pink-500/20 px-2 py-0.5 text-xs text-pink-300">
                TOP {activePoint.rank}
              </div>
            </div>

            <div className="mt-2 space-y-1 text-xs text-slate-400">
              <div>
                观众规模：
                <span className="text-slate-100">
                  {formatCompactNumber(activePoint.audienceCount)}
                </span>
              </div>
              <div>
                活跃率：
                <span className="text-slate-100">{activePoint.activeRate.toFixed(1)}%</span>
              </div>
              <div>
                热门分类：
                <span className="text-slate-100">{activePoint.topCategory}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {regions.slice(0, 5).map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => onRegionSelect(region.id)}
            className={cn(
              'rounded-xl border p-3 text-left transition-colors',
              selectedRegionId === region.id
                ? 'border-pink-500/60 bg-pink-500/10'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700',
            )}
          >
            <div className="text-xs text-slate-500">TOP {region.rank}</div>
            <div className="mt-1 font-semibold text-slate-100">{region.name}</div>
            <div className="mt-1 text-xs text-slate-400">
              {formatCompactNumber(region.audienceCount)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
