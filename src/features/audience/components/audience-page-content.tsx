'use client';

import { useEffect, useState } from 'react';

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
import { AudienceRegionSection } from './audience-region-section';
import { AudienceDemographicsSection } from './audience-demographics-section';
import { AudienceOverviewSection } from './audience-overview-section';
import { AudienceKeywordSection } from './audience-keyword-section';

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
