'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { EmptyState } from '@/components/common/empty-state';
import {
  getAssistantCategoryTrends,
  getAssistantHotContents,
  getAssistantOverview,
  getAssistantPublishTimes,
  getAssistantTitleKeywords,
  getAssistantSuggestions,
} from '@/services/creator-assistant';
import type {
  AssistantCategoryTrend,
  AssistantHotContent,
  AssistantOverview,
  AssistantPublishTime,
  AssistantTitleKeyword,
  AssistantSuggestion,
} from '@/types/creator-assistant';

import { FadeInSection } from '@/components/motion/fade-in-section';
import { CreatorAssistantCategoryTrendSection } from './creator-assistant-category-trend-section';
import { CreatorAssistantHotContentList } from './creator-assistant-hot-content-list';
import { CreatorAssistantOverviewSection } from './creator-assistant-overview-section';
import { CreatorAssistantPageSkeleton } from './creator-assistant-page-skeleton';
import { CreatorAssistantPublishTimeSection } from './creator-assistant-publish-time-section';

function AssistantSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-800" />
      <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-800" />
      <div className="mt-5 flex h-[260px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-sm text-slate-500">
        {title}
      </div>
    </section>
  );
}

const CreatorAssistantTitleKeywordSection = dynamic(
  () =>
    import('./creator-assistant-title-keyword-section').then(
      (module) => module.CreatorAssistantTitleKeywordSection,
    ),
  {
    ssr: false,
    loading: () => <AssistantSectionSkeleton title="标题词频分析加载中..." />,
  },
);

const CreatorAssistantSuggestionSection = dynamic(
  () =>
    import('./creator-assistant-suggestion-section').then(
      (module) => module.CreatorAssistantSuggestionSection,
    ),
  {
    ssr: false,
    loading: () => <AssistantSectionSkeleton title="创作建议清单加载中..." />,
  },
);

export function CreatorAssistantPageContent() {
  const [overview, setOverview] = useState<AssistantOverview | null>(null);
  const [hotContents, setHotContents] = useState<AssistantHotContent[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<AssistantCategoryTrend[]>([]);
  const [publishTimes, setPublishTimes] = useState<AssistantPublishTime[]>([]);
  const [titleKeywords, setTitleKeywords] = useState<AssistantTitleKeyword[]>([]);
  const [suggestions, setSuggestions] = useState<AssistantSuggestion[]>([]);
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
      getAssistantSuggestions(),
    ])
      .then(
        ([
          overviewResponse,
          hotContentsResponse,
          categoryTrendsResponse,
          publishTimesResponse,
          titleKeywordsResponse,
          suggestionsResponse,
        ]) => {
          if (ignore) {
            return;
          }

          setOverview(overviewResponse);
          setHotContents(hotContentsResponse);
          setCategoryTrends(categoryTrendsResponse);
          setPublishTimes(publishTimesResponse);
          setTitleKeywords(titleKeywordsResponse);
          setSuggestions(suggestionsResponse);
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
    titleKeywords.length === 0 ||
    suggestions.length === 0
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
      <FadeInSection delay={0}>
        <CreatorAssistantOverviewSection overview={overview} />
      </FadeInSection>

      <FadeInSection delay={0.04}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
          <CreatorAssistantHotContentList hotContents={hotContents} />
          <CreatorAssistantCategoryTrendSection trends={categoryTrends} />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.08}>
        <CreatorAssistantPublishTimeSection publishTimes={publishTimes} />
      </FadeInSection>

      <FadeInSection delay={0.12}>
        <CreatorAssistantTitleKeywordSection keywords={titleKeywords} />
      </FadeInSection>

      <FadeInSection delay={0.16}>
        <CreatorAssistantSuggestionSection suggestions={suggestions} />
      </FadeInSection>
    </div>
  );
}
