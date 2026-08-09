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

const keywordTypeTextMap: Record<string, string> = {
  structure: '标题结构词',
  interest: '兴趣词',
  category: '分类词',
  hot_word: '高频热词',
};

function getKeywordClassName(type: string) {
  return keywordTypeClassNameMap[type] ?? 'border-slate-700 bg-slate-900 text-slate-300';
}

function getKeywordTypeText(type: string) {
  return keywordTypeTextMap[type] ?? '关键词';
}

export function CreatorAssistantTitleKeywordSection({
  keywords,
}: CreatorAssistantTitleKeywordSectionProps) {
  const topKeywords = keywords.slice(0, 18);
  const topScore = Math.max(...topKeywords.map((keyword) => keyword.score), 1);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">标题词频分析</h2>
        <p className="mt-1 text-sm text-slate-400">
          从历史高表现内容标题中提取高频词，辅助创作者优化标题表达。
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-100">高频标题词</h3>

          <div className="mt-4 flex flex-wrap gap-3">
            {topKeywords.map((keyword) => {
              const scale = 0.85 + (keyword.score / topScore) * 0.55;

              return (
                <div
                  key={`${keyword.type}-${keyword.word}`}
                  style={{
                    transform: `scale(${scale})`,
                  }}
                  className={cn(
                    'origin-center rounded-full border px-3 py-1.5 text-sm transition-transform hover:scale-110',
                    getKeywordClassName(keyword.type),
                  )}
                >
                  {keyword.word}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-100">TOP 关键词明细</h3>

          <div className="mt-4 space-y-3">
            {topKeywords.slice(0, 8).map((keyword, index) => (
              <div
                key={`${keyword.type}-${keyword.word}`}
                className="rounded-xl bg-slate-900/70 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-100">
                      #{index + 1} {keyword.word}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      出现 {keyword.count} 次 · 平均播放 {formatCompactNumber(keyword.avgPlayCount)}
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
                        width: `${Math.min(100, (keyword.score / topScore) * 100)}%`,
                      }}
                      className="h-full rounded-full bg-cyan-300"
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">{keyword.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
