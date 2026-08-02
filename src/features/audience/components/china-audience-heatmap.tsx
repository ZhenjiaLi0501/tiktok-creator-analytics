'use client';

import * as d3 from 'd3';
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { useEffect, useMemo, useState } from 'react';

import { formatCompactNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
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

type ChinaGeoJson = FeatureCollection<Geometry, GeoJsonProperties>;
type ChinaGeoFeature = Feature<Geometry, GeoJsonProperties>;

const mapWidth = 760;
const mapHeight = 520;

const excludedFeatureKeywords = [
  '南海诸岛',
  '南海岛礁',
  '南沙群岛',
  '西沙群岛',
  '中沙群岛',
  'South China Sea',
];

function normalizeRegionName(name: string) {
  return name
    .replace('省', '')
    .replace('市', '')
    .replace('壮族自治区', '')
    .replace('回族自治区', '')
    .replace('维吾尔自治区', '')
    .replace('自治区', '')
    .replace('特别行政区', '')
    .trim();
}

function getFeatureName(feature: ChinaGeoFeature) {
  return String(feature.properties?.name ?? '');
}

function shouldRenderChinaFeature(feature: ChinaGeoFeature) {
  const featureName = getFeatureName(feature);

  return (
    featureName.length > 0 &&
    !excludedFeatureKeywords.some((keyword) => featureName.includes(keyword))
  );
}

// This dataset uses RFC 7946 ring winding (outer rings counter-clockwise), while
// d3-geo's spherical renderer expects the opposite winding for polygons smaller
// than a hemisphere. Reverse every ring so provinces are rendered as land rather
// than as the complement of the land on the globe.
function rewindFeatureForD3(feature: ChinaGeoFeature): ChinaGeoFeature {
  if (feature.geometry.type === 'Polygon') {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: feature.geometry.coordinates.map((ring) => [...ring].reverse()),
      },
    };
  }

  if (feature.geometry.type === 'MultiPolygon') {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: feature.geometry.coordinates.map((polygon) =>
          polygon.map((ring) => [...ring].reverse()),
        ),
      },
    };
  }

  return feature;
}

function getMatchedRegion(feature: ChinaGeoFeature, regions: AudienceRegion[]) {
  const featureName = normalizeRegionName(getFeatureName(feature));

  return regions.find((region) => normalizeRegionName(region.name) === featureName);
}

export function ChinaAudienceHeatmap({
  regions,
  selectedRegionId,
  onRegionSelect,
}: ChinaAudienceHeatmapProps) {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [chinaGeoJson, setChinaGeoJson] = useState<ChinaGeoJson | null>(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    let ignore = false;

    fetch('/maps/china.geo.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`China map load failed: ${response.status}`);
        }

        return response.json() as Promise<ChinaGeoJson>;
      })
      .then((data) => {
        if (ignore) {
          return;
        }

        setChinaGeoJson(data);
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);
        setMapLoadFailed(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const visibleChinaGeoJson = useMemo<ChinaGeoJson | null>(() => {
    if (!chinaGeoJson) {
      return null;
    }

    return {
      ...chinaGeoJson,
      features: chinaGeoJson.features.filter(shouldRenderChinaFeature).map(rewindFeatureForD3),
    };
  }, [chinaGeoJson]);

  const projection = useMemo(() => {
    const currentProjection = d3.geoMercator();

    if (visibleChinaGeoJson) {
      currentProjection.fitExtent(
        [
          [40, 32],
          [mapWidth - 40, mapHeight - 34],
        ],
        visibleChinaGeoJson,
      );

      return currentProjection;
    }

    return currentProjection
      .center([104, 36])
      .scale(560)
      .translate([mapWidth / 2, mapHeight / 2 + 24]);
  }, [visibleChinaGeoJson]);

  const geoPath = useMemo(() => d3.geoPath(projection), [projection]);

  const heatPoints = useMemo<HeatPoint[]>(() => {
    if (regions.length === 0) {
      return [];
    }

    const maxAudience = d3.max(regions, (region) => region.audienceCount) ?? 1;

    const radiusScale = d3.scaleSqrt().domain([0, maxAudience]).range([7, 27]);

    const colorScale = d3
      .scaleSequential()
      .domain([0, maxAudience])
      .interpolator(d3.interpolateRgb('#22d3ee', '#ff3b70'));

    return regions
      .map((region) => {
        const projectedPoint = projection([region.lng, region.lat]);

        if (!projectedPoint) {
          return null;
        }

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
  }, [projection, regions]);

  const activePoint =
    heatPoints.find((point) => point.id === hoveredRegionId) ??
    heatPoints.find((point) => point.id === selectedRegionId) ??
    null;

  const zoomFocus = heatPoints.find((point) => point.id === selectedRegionId) ?? {
    x: mapWidth / 2,
    y: mapHeight / 2,
  };
  const mapTransform = `translate(${mapWidth / 2} ${mapHeight / 2}) scale(${zoomScale}) translate(${-zoomFocus.x} ${-zoomFocus.y})`;
  const activePointScreenPosition = activePoint
    ? {
        x: mapWidth / 2 + (activePoint.x - zoomFocus.x) * zoomScale,
        y: mapHeight / 2 + (activePoint.y - zoomFocus.y) * zoomScale,
      }
    : null;

  const tooltipStyle = activePointScreenPosition
    ? {
        left: `${(activePointScreenPosition.x / mapWidth) * 100}%`,
        top: `${(activePointScreenPosition.y / mapHeight) * 100}%`,
        transform:
          activePointScreenPosition.y > mapHeight - 145
            ? 'translate(-50%, -115%)'
            : 'translate(-50%, 18px)',
      }
    : undefined;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">中国区域热力图</h2>
          <p className="mt-1 text-sm text-slate-400">
            基于中国地图省级边界和重点城市观众规模生成热力气泡，点击区域可下钻查看画像详情。
          </p>
        </div>

        <div className="text-xs text-slate-500">气泡越大、颜色越亮，代表观众规模越高</div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="img"
          aria-label="中国区域观众热力图"
          className="h-[540px] w-full"
          onClick={() => {
            setHoveredRegionId(null);
            setZoomScale(1);
            onRegionSelect('');
          }}
        >
          <defs>
            <radialGradient id="china-map-bg" cx="50%" cy="45%" r="68%">
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

            <filter id="map-glow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="2.5"
                floodColor="#38bdf8"
                floodOpacity="0.2"
              />
            </filter>
          </defs>

          <rect width={mapWidth} height={mapHeight} fill="url(#china-map-bg)" />

          {visibleChinaGeoJson ? (
            <g transform={mapTransform}>
              <path
                d={geoPath(visibleChinaGeoJson) ?? undefined}
                fill="#08111f"
                stroke="#60a5fa"
                strokeWidth={1.1}
                opacity={0.86}
                filter="url(#map-glow)"
                pointerEvents="none"
              />

              {visibleChinaGeoJson.features.map((feature, index) => {
                const rawFeatureName = getFeatureName(feature);
                const matchedRegion = getMatchedRegion(feature, regions);
                const selected = matchedRegion?.id === selectedRegionId;
                const hovered = matchedRegion?.id === hoveredRegionId;

                return (
                  <path
                    key={feature.id ?? rawFeatureName ?? index}
                    d={geoPath(feature) ?? undefined}
                    fill={selected || hovered ? '#1e3a8a' : '#101827'}
                    stroke={selected || hovered ? '#38bdf8' : '#475569'}
                    strokeWidth={selected || hovered ? 1.5 : 0.72}
                    opacity={selected || hovered ? 1 : 0.92}
                    className={cn(
                      'transition-colors',
                      matchedRegion ? 'cursor-pointer' : 'cursor-default',
                    )}
                    onMouseEnter={() => {
                      if (matchedRegion) {
                        setHoveredRegionId(matchedRegion.id);
                      }
                    }}
                    onMouseLeave={() => {
                      if (matchedRegion) {
                        setHoveredRegionId(null);
                      }
                    }}
                    onClick={(event) => {
                      if (!matchedRegion) {
                        return;
                      }

                      event.stopPropagation();

                      if (selectedRegionId === matchedRegion.id) {
                        setHoveredRegionId(null);
                        setZoomScale(1);
                        onRegionSelect('');
                        return;
                      }

                      setHoveredRegionId(matchedRegion.id);
                      setZoomScale(1.8);
                      onRegionSelect(matchedRegion.id);
                    }}
                  />
                );
              })}
            </g>
          ) : null}

          {mapLoadFailed ? (
            <text x={mapWidth / 2} y={44} textAnchor="middle" fill="#fca5a5" fontSize={12}>
              中国地图底图加载失败，当前仅展示热点气泡
            </text>
          ) : null}

          <text x={32} y={42} fill="#64748b" fontSize={12} pointerEvents="none">
            中国区重点城市观众分布
          </text>

          <g transform={mapTransform}>
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
                  onClick={(event) => {
                    event.stopPropagation();

                    if (selectedRegionId === point.id) {
                      setHoveredRegionId(null);
                      setZoomScale(1);
                      onRegionSelect('');
                      return;
                    }

                    setHoveredRegionId(point.id);
                    setZoomScale(1.8);
                    onRegionSelect(point.id);
                  }}
                >
                  <circle
                    r={point.radius * 1.9}
                    fill={point.color}
                    opacity={selected || hovered ? 0.34 : 0.13}
                    filter="url(#heat-glow)"
                    pointerEvents="none"
                  />

                  <circle
                    r={point.radius}
                    fill={point.color}
                    opacity={selected || hovered ? 0.98 : 0.82}
                    stroke={selected ? '#f8fafc' : '#0f172a'}
                    strokeWidth={selected ? 2.5 : 1}
                  />

                  <text
                    y={point.radius + 16}
                    textAnchor="middle"
                    fill={selected || hovered ? '#f8fafc' : '#cbd5e1'}
                    fontSize={selected || hovered ? 12 : 10}
                    fontWeight={selected || hovered ? 700 : 500}
                    className="pointer-events-none select-none"
                  >
                    {point.city}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950/90 p-1 shadow-lg">
          <button
            type="button"
            aria-label="缩小地图"
            className="grid size-8 place-items-center rounded-md text-lg text-slate-200 hover:bg-slate-800 disabled:opacity-40"
            disabled={zoomScale <= 1}
            onClick={() => setZoomScale((scale) => Math.max(1, scale - 0.4))}
          >
            −
          </button>
          <button
            type="button"
            className="h-8 rounded-md px-2 text-xs text-slate-300 hover:bg-slate-800"
            onClick={() => setZoomScale(1)}
          >
            {Math.round(zoomScale * 100)}%
          </button>
          <button
            type="button"
            aria-label="放大地图"
            className="grid size-8 place-items-center rounded-md text-lg text-slate-200 hover:bg-slate-800 disabled:opacity-40"
            disabled={zoomScale >= 3}
            onClick={() => setZoomScale((scale) => Math.min(3, scale + 0.4))}
          >
            +
          </button>
        </div>

        {activePoint ? (
          <div
            style={tooltipStyle}
            className="pointer-events-none absolute z-10 w-[220px] rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-slate-100">
                {activePoint.name} · {activePoint.city}
              </div>

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
                互动率：
                <span className="text-slate-100">{activePoint.interactionRate.toFixed(1)}%</span>
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
            onClick={() => {
              if (selectedRegionId === region.id) {
                setHoveredRegionId(null);
                setZoomScale(1);
                onRegionSelect('');
                return;
              }

              setHoveredRegionId(region.id);
              setZoomScale(1.8);
              onRegionSelect(region.id);
            }}
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
              {region.city} · {formatCompactNumber(region.audienceCount)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
