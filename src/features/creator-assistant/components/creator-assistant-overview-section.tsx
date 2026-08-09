import type { AssistantOverview } from '@/types/creator-assistant';

type CreatorAssistantOverviewSectionProps = {
  overview: AssistantOverview;
};

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
};

function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-100">{value}</div>
      <div className="mt-2 text-xs text-slate-500">{description}</div>
    </div>
  );
}

export function CreatorAssistantOverviewSection({
  overview,
}: CreatorAssistantOverviewSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">创作助手概览</h2>
        <p className="mt-1 text-sm text-slate-400">
          基于历史内容表现生成热点内容、分类趋势、发布时间和标题优化建议。
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="热点内容样本"
          value={`${overview.hotContentCount}`}
          description="综合播放、点赞、评论和互动率筛选"
        />

        <MetricCard
          label="趋势分类"
          value={overview.topCategory}
          description={`${overview.categoryTrendCount} 个分类参与趋势分析`}
        />

        <MetricCard
          label="推荐发布时间"
          value={overview.bestPublishTime}
          description={`${overview.recommendedSlotCount} 个优选时段`}
        />

        <MetricCard
          label="高频标题词"
          value={overview.topKeyword}
          description={`${overview.titleKeywordCount} 个标题关键词样本`}
        />
      </div>
    </section>
  );
}
