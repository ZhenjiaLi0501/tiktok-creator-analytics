'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import {
  getAudienceDemographics,
  getAudienceOverview,
  getAudienceRegions,
  getAudienceKeywords,
} from '@/services/audience';

import type {
  AudienceDemographics,
  AudienceOverview,
  AudienceRegion,
  AudienceKeyword,
} from '@/types/audience';
import { EmptyState } from '@/components/common/empty-state';
import { AudiencePageSkeleton } from './audience-page-skeleton';
import { AudienceDemographicsSection } from './audience-demographics-section';
import { AudienceOverviewSection } from './audience-overview-section';

function VisualizationSkeleton({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-800" />
      <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-800" />
      <div className="mt-5 flex h-[360px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-sm text-slate-500">
        {title}
      </div>
    </section>
  );
}

const AudienceRegionSection = dynamic(
  () => import('./audience-region-section').then((module) => module.AudienceRegionSection),
  {
    ssr: false,
    loading: () => <VisualizationSkeleton title="中国区域热力图加载中..." />,
  },
);

const AudienceKeywordSection = dynamic(
  () => import('./audience-keyword-section').then((module) => module.AudienceKeywordSection),
  {
    ssr: false,
    loading: () => <VisualizationSkeleton title="兴趣关键词云加载中..." />,
  },
);

export function AudiencePageContent() {
  const [overview, setOverview] = useState<AudienceOverview | null>(null);
  const [demographics, setDemographics] = useState<AudienceDemographics | null>(null);
  const [regions, setRegions] = useState<AudienceRegion[]>([]);
  const [keywords, setKeywords] = useState<AudienceKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getAudienceOverview(),
      getAudienceDemographics(),
      getAudienceRegions(),
      getAudienceKeywords(),
    ])
      .then(([overviewResponse, demographicsResponse, regionsResponse, keywordsResponse]) => {
        if (ignore) return;
        setOverview(overviewResponse);
        setDemographics(demographicsResponse);
        setRegions(regionsResponse);
        setKeywords(keywordsResponse);
      })
      .catch((err) => {
        if (ignore) return;
        console.error(err);
        setErrorMessage('观众画像数据加载失败，请检查MSW接口或audience数据文件');
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);
  if (loading) {
    return <AudiencePageSkeleton />;
  }
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <div className="text-lg font-semibold text-red-100">画像数据加载失败</div>
        <div className="mt-2 text-sm text-red-200">{errorMessage}</div>
      </div>
    );
  }
  if (!overview || !demographics || regions.length === 0 || keywords.length === 0) {
    return (
      <EmptyState
        title="暂无观众画像数据"
        description="当前audience mock数据为空，请重新执行pnpm data:audience生成中国区画像数据"
      />
    );
  }
  return (
    <div className="space-y-6">
      <AudienceOverviewSection overview={overview} />
      <AudienceDemographicsSection demographics={demographics} />
      <AudienceRegionSection regions={regions} />
      <AudienceKeywordSection keywords={keywords} />
    </div>
  );
}
