import { formatCompactNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AssistantCategoryTrend, AssistantTrendStatus } from '@/types/creator-assistant';

type CreatorAssistantCategoryTrendSectionProps = {
  trends: AssistantCategoryTrend[];
};

const statusTextMap: Record<AssistantTrendStatus, string> = {
  rising: '快速上升',
  stable: '稳定表现',
  potential: '潜力分类',
};

const statusClassNameMap: Record<AssistantTrendStatus, string> = {
  rising: 'border-pink-400/30 bg-pink-400/10 text-pink-300',
  stable: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  potential: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
};

export function CreatorAssistantCategoryTrendSection({
  trends,
}: CreatorAssistantCategoryTrendSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">分类趋势分析</h2>
        <p className="mt-1 text-sm text-slate-400">结合内容数量、播放量和互动表现评估分类趋势。</p>
      </div>

      <div className="mt-5 space-y-4">
        {trends.slice(0, 8).map((trend) => (
          <div
            key={trend.category}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{trend.category}</div>
                <div className="mt-1 text-xs text-slate-500">
                  样本 {trend.videoCount.toLocaleString()} 条 · 播放{' '}
                  {formatCompactNumber(trend.playCount)}
                </div>
              </div>

              <span
                className={cn(
                  'rounded-full border px-2 py-1 text-xs',
                  statusClassNameMap[trend.trendStatus],
                )}
              >
                {statusTextMap[trend.trendStatus]}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">趋势分</span>
                <span className="font-medium text-slate-100">{trend.trendScore.toFixed(1)}</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  style={{
                    width: `${Math.min(100, trend.trendScore)}%`,
                  }}
                  className="h-full rounded-full bg-pink-500"
                />
              </div>
            </div>

            <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
              <div>
                平均互动率：
                <span className="text-slate-100">{trend.avgEngagementRate.toFixed(2)}%</span>
              </div>
              <div>
                点赞量：
                <span className="text-slate-100">{formatCompactNumber(trend.likeCount)}</span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">{trend.suggestion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
