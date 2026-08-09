'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { AssistantPriority, AssistantSuggestion } from '@/types/creator-assistant';

type CreatorAssistantSuggestionSectionProps = {
  suggestions: AssistantSuggestion[];
};

const priorityTextMap: Record<AssistantPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

const priorityClassNameMap: Record<AssistantPriority, string> = {
  high: 'border-pink-400/30 bg-pink-400/10 text-pink-300',
  medium: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  low: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
};

const suggestionTypeTextMap: Record<string, string> = {
  category: '分类供给',
  publish_time: '发布时间',
  title: '标题优化',
  topic: '组合选题',
  hot_content: '热点参考',
};

function getSuggestionTypeText(type: string) {
  return suggestionTypeTextMap[type] ?? '创作建议';
}

export function CreatorAssistantSuggestionSection({
  suggestions,
}: CreatorAssistantSuggestionSectionProps) {
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(suggestions[0]?.id ?? '');

  const selectedSuggestion = useMemo(
    () => suggestions.find((item) => item.id === selectedSuggestionId) ?? suggestions[0],
    [selectedSuggestionId, suggestions],
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">创作建议清单</h2>
          <p className="mt-1 text-sm text-slate-400">
            基于热点内容、分类趋势、推荐发布时间和标题关键词生成运营建议。
          </p>
        </div>

        <div className="text-xs text-slate-500">点击建议卡片查看推荐理由和执行动作</div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-3 md:grid-cols-2">
          {suggestions.map((suggestion, index) => {
            const selected = selectedSuggestion?.id === suggestion.id;

            return (
              <motion.button
                key={suggestion.id}
                type="button"
                layout
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.24,
                  delay: index * 0.04,
                }}
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => setSelectedSuggestionId(suggestion.id)}
                className={cn(
                  'rounded-2xl border bg-slate-950/60 p-4 text-left transition-colors',
                  selected
                    ? 'border-pink-500/60 bg-pink-500/10'
                    : 'border-slate-800 hover:border-slate-700',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {getSuggestionTypeText(suggestion.type)}
                    </div>
                    <div className="mt-1 line-clamp-2 font-semibold text-slate-100">
                      {suggestion.title}
                    </div>
                  </div>

                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-1 text-xs',
                      priorityClassNameMap[suggestion.priority],
                    )}
                  >
                    {priorityTextMap[suggestion.priority]}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                  {suggestion.reason}
                </p>
              </motion.button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <AnimatePresence mode="wait">
            {selectedSuggestion ? (
              <motion.div
                key={selectedSuggestion.id}
                initial={{
                  opacity: 0,
                  x: 18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -18,
                }}
                transition={{
                  duration: 0.22,
                }}
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs text-slate-500">当前建议</div>
                    <h3 className="mt-1 text-xl font-semibold leading-7 text-slate-100">
                      {selectedSuggestion.title}
                    </h3>
                  </div>

                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-1 text-xs',
                      priorityClassNameMap[selectedSuggestion.priority],
                    )}
                  >
                    {priorityTextMap[selectedSuggestion.priority]}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="text-sm font-semibold text-slate-100">推荐理由</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {selectedSuggestion.reason}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="text-sm font-semibold text-slate-100">执行动作</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {selectedSuggestion.action}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-sm font-semibold text-cyan-200">落地建议</div>
                    <p className="mt-2 text-sm leading-6 text-cyan-100/80">
                      可以将该建议加入选题排期，用于后续内容策划、发布时间安排、
                      标题优化或创作者运营策略调整。
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
