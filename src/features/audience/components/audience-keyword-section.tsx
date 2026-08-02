'use client';

import { useMemo, useState } from 'react';

import type { AudienceKeyword } from '@/types/audience';

import { AudienceKeywordCloud } from './audience-keyword-cloud';

type AudienceKeywordSectionProps = {
  keywords: AudienceKeyword[];
};

const typeTextMap: Record<AudienceKeyword['type'], string> = {
  category: '内容分类',
  interest: '兴趣标签',
};

function KeywordDetailPanel({
  keyword,
  keywords,
}: {
  keyword: AudienceKeyword | null;
  keywords: AudienceKeyword[];
}) {
  const relatedKeywords = useMemo(() => {
    if (!keyword) {
      return [];
    }

    return keywords
      .filter((item) => item.word !== keyword.word && item.type === keyword.type)
      .slice(0, 6);
  }, [keyword, keywords]);

  if (!keyword) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <div className="text-sm text-slate-400">点击关键词云中的任意标签，查看兴趣下钻详情。</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs text-slate-500">当前下钻关键词</div>
          <h3 className="mt-1 text-xl font-semibold text-slate-100">{keyword.word}</h3>
        </div>

        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
          {typeTextMap[keyword.type]}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-xs text-slate-500">兴趣热度</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">{keyword.value}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-xs text-slate-500">标签类型</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">
            {typeTextMap[keyword.type]}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-xs text-slate-500">推荐运营动作</div>
          <div className="mt-1 text-sm font-medium text-slate-100">
            {keyword.type === 'category' ? '优化分类内容供给' : '提升兴趣内容触达'}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-sm font-semibold text-slate-100">相关兴趣标签</h4>

        <div className="mt-3 flex flex-wrap gap-2">
          {relatedKeywords.map((item) => (
            <span
              key={item.word}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300"
            >
              {item.word} · {item.value}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="text-sm font-semibold text-slate-100">运营解读</h4>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          “{keyword.word}”在当前中国区观众兴趣中热度较高，可以用于后续内容选题、
          创作者运营分层和热点内容推荐。若该关键词属于内容分类，说明该类型内容供给和消费表现较强；
          若属于兴趣标签，则说明该兴趣方向具备较高的用户触达价值。
        </p>
      </div>
    </div>
  );
}

export function AudienceKeywordSection({ keywords }: AudienceKeywordSectionProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<AudienceKeyword | null>(
    keywords[0] ?? null,
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">中国区兴趣关键词云</h2>
          <p className="mt-1 text-sm text-slate-400">
            基于内容分类和兴趣标签生成关键词云，支持点击关键词查看下钻分析。
          </p>
        </div>

        <div className="text-xs text-slate-500">D3.js 自定义 SVG 关键词云</div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.8fr)]">
        <AudienceKeywordCloud
          keywords={keywords}
          selectedKeyword={selectedKeyword}
          onKeywordSelect={setSelectedKeyword}
        />

        <KeywordDetailPanel keyword={selectedKeyword} keywords={keywords} />
      </div>
    </section>
  );
}
