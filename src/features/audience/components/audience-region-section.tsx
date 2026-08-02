'use client';

import { useEffect, useMemo, useState } from 'react';

import { getAudienceRegionDetail } from '@/services/audience';
import { formatCompactNumber } from '@/lib/format';
import type { AudienceMetricItem, AudienceRegion, AudienceRegionDetail } from '@/types/audience';

import { ChinaAudienceHeatmap } from './china-audience-heatmap';

type AudienceRegionSectionProps = {
  regions: AudienceRegion[];
};

type MetricBoxProps = {
  label: string;
  value: string;
};

function MetricBox({ label, value }: MetricBoxProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function DistributionList({ title, items }: { title: string; items: AudienceMetricItem[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-slate-200">{item.value.toFixed(1)}%</span>
            </div>

            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                style={{
                  width: `${item.value}%`,
                }}
                className="h-full rounded-full bg-cyan-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionDetailPanel({
  detail,
  selectedRegion,
}: {
  detail: AudienceRegionDetail | null;
  selectedRegion: AudienceRegion | undefined;
}) {
  if (!selectedRegion) {
    return null;
  }

  if (!detail) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="text-sm text-slate-400">省份详情加载中...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{detail.regionName}观众画像</h3>
          <p className="mt-1 text-sm text-slate-400">
            重点城市：{detail.city}，热门内容分类：{detail.topCategory}
          </p>
        </div>

        <div className="rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs text-pink-300">
          区域下钻详情
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <MetricBox label="观众规模" value={formatCompactNumber(detail.audienceCount)} />
        <MetricBox label="活跃率" value={`${detail.activeRate.toFixed(1)}%`} />
        <MetricBox label="互动率" value={`${detail.interactionRate.toFixed(1)}%`} />
        <MetricBox label="热门分类" value={detail.topCategory} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <DistributionList title="性别分布" items={detail.gender} />
        <DistributionList title="年龄分布" items={detail.age} />
        <DistributionList title="终端分布" items={detail.device} />
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-sm font-semibold text-slate-100">区域兴趣关键词</h4>

        <div className="mt-3 flex flex-wrap gap-2">
          {detail.keywords.map((keyword) => (
            <span
              key={keyword.word}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200"
            >
              {keyword.word} · {keyword.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AudienceRegionSection({ regions }: AudienceRegionSectionProps) {
  const initialRegionId = regions[0]?.id ?? '';
  const [selectedRegionId, setSelectedRegionId] = useState(initialRegionId);
  const [regionDetail, setRegionDetail] = useState<AudienceRegionDetail | null>(null);

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === selectedRegionId),
    [regions, selectedRegionId],
  );

  useEffect(() => {
    if (!selectedRegionId) {
      return;
    }

    let ignore = false;

    getAudienceRegionDetail(selectedRegionId)
      .then((response) => {
        if (ignore) {
          return;
        }

        setRegionDetail(response);
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);
        setRegionDetail(null);
      });

    return () => {
      ignore = true;
    };
  }, [selectedRegionId]);

  return (
    <section className="space-y-4">
      <ChinaAudienceHeatmap
        regions={regions}
        selectedRegionId={selectedRegionId}
        onRegionSelect={setSelectedRegionId}
      />

      <RegionDetailPanel detail={regionDetail} selectedRegion={selectedRegion} />
    </section>
  );
}
