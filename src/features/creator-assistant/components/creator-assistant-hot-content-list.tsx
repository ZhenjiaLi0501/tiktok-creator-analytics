import { formatCompactNumber } from '@/lib/format';
import type { AssistantHotContent } from '@/types/creator-assistant';

type CreatorAssistantHotContentListProps = {
  hotContents: AssistantHotContent[];
};

function formatScore(score: number | undefined) {
  const numberValue = Number(score);

  if (!Number.isFinite(numberValue)) {
    return '-';
  }

  return numberValue.toFixed(1);
}

function formatPercent(value: number | undefined) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return '-';
  }

  return `${numberValue.toFixed(2)}%`;
}

export function CreatorAssistantHotContentList({
  hotContents,
}: CreatorAssistantHotContentListProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">热点内容榜单</h2>
        <p className="mt-1 text-sm text-slate-400">
          按播放、互动和内容表现综合计算热度分，辅助创作者选题参考。
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {hotContents.slice(0, 10).map((content) => (
          <div
            key={content.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-sm font-semibold text-pink-300">
                #{content.rank}
              </div>

              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 font-medium text-slate-100">{content.title}</div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{content.creatorName}</span>
                  <span>·</span>
                  <span>{content.category}</span>
                  <span>·</span>
                  <span>{content.publishSlot}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {content.reasonTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-xs text-slate-500">热度分</div>
                <div className="mt-1 text-xl font-semibold text-pink-300">
                  {formatScore(content.hotScore)}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-xs text-slate-400 md:grid-cols-4">
              <div>
                播放量：
                <span className="text-slate-100">{formatCompactNumber(content.playCount)}</span>
              </div>
              <div>
                点赞量：
                <span className="text-slate-100">{formatCompactNumber(content.likeCount)}</span>
              </div>
              <div>
                评论量：
                <span className="text-slate-100">{formatCompactNumber(content.commentCount)}</span>
              </div>
              <div>
                互动率：
                <span className="text-slate-100">{formatPercent(content.engagementRate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
