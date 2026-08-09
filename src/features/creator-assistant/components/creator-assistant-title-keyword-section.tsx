'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { formatCompactNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AssistantTitleKeyword } from '@/types/creator-assistant';

type CreatorAssistantTitleKeywordSectionProps = {
  keywords: AssistantTitleKeyword[];
};

const keywordTypeClassNameMap: Record<string, string> = {
  structure: 'border-pink-400/30 bg-pink-400/10 text-pink-300',
  interest: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  category: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  hot_word: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
};

const keywordTypeDotClassNameMap: Record<string, string> = {
  structure: 'bg-pink-400',
  interest: 'bg-cyan-300',
  category: 'bg-violet-400',
  hot_word: 'bg-amber-300',
};

const keywordTypeTextMap: Record<string, string> = {
  structure: '标题结构词',
  interest: '兴趣词',
  category: '分类词',
  hot_word: '高频热词',
};

function getKeywordClassName(type: string) {
  return keywordTypeClassNameMap[type] ?? 'border-slate-700 bg-slate-900 text-slate-300';
}

function getKeywordDotClassName(type: string) {
  return keywordTypeDotClassNameMap[type] ?? 'bg-slate-400';
}

function getKeywordTypeText(type: string) {
  return keywordTypeTextMap[type] ?? '关键词';
}

function getSafeNumber(value: number | undefined) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function getKeywordFontSize(keyword: AssistantTitleKeyword, topScore: number) {
  const score = getSafeNumber(keyword.score);
  const ratio = topScore > 0 ? score / topScore : 0;

  return 14 + ratio * 14;
}

function getKeywordSuggestionTitle(keyword: AssistantTitleKeyword) {
  if (keyword.type === 'structure') {
    return '适合放在标题前半段，强化点击预期';
  }

  if (keyword.type === 'category') {
    return '适合和垂类内容绑定，强化内容定位';
  }

  if (keyword.type === 'interest') {
    return '适合结合用户兴趣场景，提高推荐触达';
  }

  return '适合做话题词或热词参考，需要本地化改写';
}

export function CreatorAssistantTitleKeywordSection({
  keywords,
}: CreatorAssistantTitleKeywordSectionProps) {
  const topKeywords = useMemo(() => keywords.slice(0, 20), [keywords]);
  const detailKeywords = useMemo(() => keywords.slice(0, 8), [keywords]);
  const topScore = Math.max(...topKeywords.map((keyword) => getSafeNumber(keyword.score)), 1);

  const [selectedKeywordWord, setSelectedKeywordWord] = useState(topKeywords[0]?.word ?? '');

  const selectedKeyword =
    topKeywords.find((keyword) => keyword.word === selectedKeywordWord) ?? topKeywords[0];

  if (topKeywords.length === 0 || !selectedKeyword) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
        <h2 className="text-lg font-semibold text-slate-100">标题词频分析</h2>
        <p className="mt-2 text-sm text-slate-400">暂无标题关键词数据。</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">标题词频分析</h2>
          <p className="mt-1 text-sm text-slate-400">
            从历史高表现内容标题中提取高频词，辅助创作者优化标题表达。
          </p>
        </div>

        <div className="text-xs text-slate-500">点击关键词可查看标题优化建议</div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">高频标题词云</h3>
                <p className="mt-1 text-xs text-slate-500">
                  字体越大代表标题价值分越高，颜色表示关键词类型。
                </p>
              </div>

              <div className="hidden items-center gap-3 text-xs text-slate-500 md:flex">
                {Object.entries(keywordTypeTextMap).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-full', getKeywordDotClassName(type))} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex min-h-[260px] flex-wrap content-start items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              {topKeywords.map((keyword, index) => {
                const selected = selectedKeyword.word === keyword.word;
                const fontSize = getKeywordFontSize(keyword, topScore);

                return (
                  <motion.button
                    key={`${keyword.type}-${keyword.word}`}
                    type="button"
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.18,
                      delay: index * 0.025,
                    }}
                    whileHover={{
                      y: -2,
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={() => setSelectedKeywordWord(keyword.word)}
                    style={{
                      fontSize,
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1.5 font-semibold leading-none shadow-sm transition-colors',
                      getKeywordClassName(keyword.type),
                      selected && 'ring-2 ring-cyan-300/60',
                    )}
                  >
                    {keyword.word}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedKeyword.word}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.18,
              }}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs text-slate-500">当前选中关键词</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xl font-semibold text-slate-100">
                      {selectedKeyword.word}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-1 text-xs',
                        getKeywordClassName(selectedKeyword.type),
                      )}
                    >
                      {getKeywordTypeText(selectedKeyword.type)}
                    </span>
                  </div>
                </div>

                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  标题价值分 {selectedKeyword.score}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-xs text-slate-500">出现次数</div>
                  <div className="mt-1 text-lg font-semibold text-slate-100">
                    {selectedKeyword.count}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-xs text-slate-500">平均播放</div>
                  <div className="mt-1 text-lg font-semibold text-slate-100">
                    {formatCompactNumber(selectedKeyword.avgPlayCount)}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-xs text-slate-500">推荐用法</div>
                  <div className="mt-1 text-sm font-medium text-slate-100">
                    {getKeywordSuggestionTitle(selectedKeyword)}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="text-sm font-semibold text-cyan-100">标题优化建议</div>
                <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                  {selectedKeyword.suggestion}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">TOP 关键词明细</h3>
            <span className="text-xs text-slate-500">按标题价值分排序</span>
          </div>

          <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto pr-1">
            {detailKeywords.map((keyword, index) => {
              const selected = selectedKeyword.word === keyword.word;
              const progress = Math.min(100, (keyword.score / topScore) * 100);

              return (
                <button
                  key={`${keyword.type}-${keyword.word}`}
                  type="button"
                  onClick={() => setSelectedKeywordWord(keyword.word)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? 'border-cyan-400/50 bg-cyan-400/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-100">
                        #{index + 1} {keyword.word}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        出现 {keyword.count} 次 · 平均播放{' '}
                        {formatCompactNumber(keyword.avgPlayCount)}
                      </div>
                    </div>

                    <span
                      className={cn(
                        'shrink-0 rounded-full border px-2 py-1 text-xs',
                        getKeywordClassName(keyword.type),
                      )}
                    >
                      {getKeywordTypeText(keyword.type)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">标题价值分</span>
                      <span className="text-slate-100">{keyword.score}</span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        style={{
                          width: `${progress}%`,
                        }}
                        className="h-full rounded-full bg-cyan-300"
                      />
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                    {keyword.suggestion}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
