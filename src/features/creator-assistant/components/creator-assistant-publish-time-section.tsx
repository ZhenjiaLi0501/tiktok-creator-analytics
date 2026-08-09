import { formatCompactNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AssistantCompetitionLevel, AssistantPublishTime } from '@/types/creator-assistant';

type CreatorAssistantPublishTimeSectionProps = {
  publishTimes: AssistantPublishTime[];
};

const competitionClassNameMap: Record<AssistantCompetitionLevel, string> = {
  high: 'border-red-400/30 bg-red-400/10 text-red-300',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  low: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

export function CreatorAssistantPublishTimeSection({
  publishTimes,
}: CreatorAssistantPublishTimeSectionProps) {
  const topPublishTimes = publishTimes.slice(0, 6);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">发布时间推荐</h2>
        <p className="mt-1 text-sm text-slate-400">
          基于历史内容发布时间、平均播放量、互动率和竞争程度计算推荐发布时段。
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topPublishTimes.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'rounded-2xl border bg-slate-950/60 p-4 transition-colors hover:border-slate-700',
              index === 0 ? 'border-pink-500/50' : 'border-slate-800',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500">推荐时段</div>
                <div className="mt-1 text-xl font-semibold text-slate-100">{item.label}</div>
              </div>

              <div className="rounded-full bg-pink-500/15 px-2 py-1 text-xs font-medium text-pink-300">
                TOP {index + 1}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">推荐分</span>
                <span className="font-medium text-slate-100">{item.score.toFixed(1)}</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  style={{
                    width: `${Math.min(100, item.score)}%`,
                  }}
                  className="h-full rounded-full bg-pink-500"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-xs text-slate-400">
              <div>
                平均播放：
                <span className="text-slate-100">{formatCompactNumber(item.avgPlayCount)}</span>
              </div>

              <div>
                平均互动率：
                <span className="text-slate-100">{item.avgEngagementRate.toFixed(2)}%</span>
              </div>

              <div>
                样本数量：
                <span className="text-slate-100">{item.sampleCount.toLocaleString()}</span>
              </div>

              <div>
                预计播放提升：
                <span className="text-slate-100">{item.expectedPlayLift.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={cn(
                  'rounded-full border px-2 py-1 text-xs',
                  competitionClassNameMap[item.competitionLevel],
                )}
              >
                {item.competitionText}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">{item.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
