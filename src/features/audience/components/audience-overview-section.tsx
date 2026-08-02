import { formatCompactNumber } from '@/lib/format';
import type { AudienceOverview } from '@/types/audience';

type AudienceOverviewSectionProps = {
  overview: AudienceOverview;
};

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
};

function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-100">{value}</div>
      <div className="mt-2 text-xs text-slate-500">{description}</div>
    </div>
  );
}

export function AudienceOverviewSection({ overview }: AudienceOverviewSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">中国区画像概览</h2>
        <p className="mt-1 text-sm text-slate-400">
          展示中国区用户规模、活跃情况、留存和互动表现。
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="总观众规模"
          value={formatCompactNumber(overview.totalAudience)}
          description={`覆盖 ${overview.regionCount} 个重点省市`}
        />

        <MetricCard
          label="活跃观众"
          value={formatCompactNumber(overview.activeAudience)}
          description="近周期内有观看、点赞、评论等行为的用户"
        />

        <MetricCard
          label="新增观众"
          value={formatCompactNumber(overview.newAudience)}
          description="本周期新增触达用户规模"
        />

        <MetricCard
          label="平均观看时长"
          value={`${overview.avgWatchDuration}s`}
          description="用户单次观看内容的平均时长"
        />

        <MetricCard
          label="互动率"
          value={`${overview.interactionRate.toFixed(2)}%`}
          description="点赞、评论、分享等互动行为占比"
        />

        <MetricCard
          label="留存率"
          value={`${overview.retentionRate.toFixed(1)}%`}
          description={`当前热度最高区域：${overview.topRegion}`}
        />
      </div>
    </section>
  );
}
