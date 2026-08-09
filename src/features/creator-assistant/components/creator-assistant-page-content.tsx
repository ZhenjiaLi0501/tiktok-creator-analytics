'use client';

import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import {
  getAssistantCategoryTrends,
  getAssistantHotContents,
  getAssistantOverview,
  getAssistantPublishTimes,
  getAssistantTitleKeywords,
} from '@/services/creator-assistant';
import type {
  AssistantCategoryTrend,
  AssistantHotContent,
  AssistantOverview,
  AssistantPublishTime,
  AssistantTitleKeyword,
} from '@/types/creator-assistant';

import { CreatorAssistantCategoryTrendSection } from './creator-assistant-category-trend-section';
import { CreatorAssistantHotContentList } from './creator-assistant-hot-content-list';
import { CreatorAssistantOverviewSection } from './creator-assistant-overview-section';
import { CreatorAssistantPageSkeleton } from './creator-assistant-page-skeleton';
import { CreatorAssistantPublishTimeSection } from './creator-assistant-publish-time-section';
import { CreatorAssistantTitleKeywordSection } from './creator-assistant-title-keyword-section';

export function CreatorAssistantPageContent() {
  const [overview, setOverview] = useState<AssistantOverview | null>(null);
  const [hotContents, setHotContents] = useState<AssistantHotContent[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<AssistantCategoryTrend[]>([]);
  const [publishTimes, setPublishTimes] = useState<AssistantPublishTime[]>([]);
  const [titleKeywords, setTitleKeywords] = useState<AssistantTitleKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getAssistantOverview(),
      getAssistantHotContents(),
      getAssistantCategoryTrends(),
      getAssistantPublishTimes(),
      getAssistantTitleKeywords(),
    ])
      .then(
        ([
          overviewResponse,
          hotContentsResponse,
          categoryTrendsResponse,
          publishTimesResponse,
          titleKeywordsResponse,
        ]) => {
          if (ignore) {
            return;
          }

          setOverview(overviewResponse);
          setHotContents(hotContentsResponse);
          setCategoryTrends(categoryTrendsResponse);
          setPublishTimes(publishTimesResponse);
          setTitleKeywords(titleKeywordsResponse);
        },
      )
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);
        setErrorMessage('创作助手数据加载失败，请检查 MSW 接口或 assistant 数据文件。');
      })
      .finally(() => {
        if (ignore) {
          return;
        }

        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <CreatorAssistantPageSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <div className="text-lg font-semibold text-red-100">创作助手加载失败</div>
        <div className="mt-2 text-sm text-red-200">{errorMessage}</div>
      </div>
    );
  }

  if (
    !overview ||
    hotContents.length === 0 ||
    categoryTrends.length === 0 ||
    publishTimes.length === 0 ||
    titleKeywords.length === 0
  ) {
    return (
      <EmptyState
        title="暂无创作助手数据"
        description="当前 assistant mock 数据为空，请先执行 pnpm data:assistant 生成创作助手数据。"
      />
    );
  }

  return (
    <div className="space-y-6">
      <CreatorAssistantOverviewSection overview={overview} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <CreatorAssistantHotContentList hotContents={hotContents} />
        <CreatorAssistantCategoryTrendSection trends={categoryTrends} />
      </div>

      <CreatorAssistantPublishTimeSection publishTimes={publishTimes} />
      <CreatorAssistantTitleKeywordSection keywords={titleKeywords} />
    </div>
  );
}
