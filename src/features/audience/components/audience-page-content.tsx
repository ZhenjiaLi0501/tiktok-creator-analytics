'use client';

import { useEffect, useState } from 'react';

import {
  getAudienceDemographics,
  getAudienceOverview,
  getAudienceRegions,
} from '@/services/audience';

import type { AudienceDemographics, AudienceOverview, AudienceRegion } from '@/types/audience';
import { AudienceRegionSection } from './audience-region-section';
import { AudienceDemographicsSection } from './audience-demographics-section';
import { AudienceOverviewSection } from './audience-overview-section';

export function AudiencePageContent() {
  const [overview, setOverview] = useState<AudienceOverview | null>(null);
  const [demographics, setDemographics] = useState<AudienceDemographics | null>(null);
  const [regions, setRegions] = useState<AudienceRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    Promise.all([getAudienceOverview(), getAudienceDemographics(), getAudienceRegions()])
      .then(([overviewResponse, demographicsResponse, regionsResponse]) => {
        if (ignore) return;
        setOverview(overviewResponse);
        setDemographics(demographicsResponse);
        setRegions(regionsResponse);
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
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        观众画像数据加载中...
      </div>
    );
  }
  if (errorMessage || !overview || !demographics || regions.length === 0) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <div className="text-lg font-semibold text-red-100">画像数据加载失败</div>
        <div className="mt-2 text-sm text-red-200">
          {errorMessage || '当前观众画像数据为空，请重新生成audience mock数据'}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <AudienceOverviewSection overview={overview} />
      <AudienceDemographicsSection demographics={demographics} />
      <AudienceRegionSection regions={regions} />
    </div>
  );
}
