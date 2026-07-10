import { PageHeader } from '@/components/business/page-header';
import { SectionCard } from '@/components/business/section-card';
import { CreatorTablePreview } from '@/features/creators/components/creator-table-preview';

export default function CreatorsPage() {
  return (
    <section>
      <PageHeader
        badge="Creators"
        title="创作者分析"
        description="分析平台内创作者列表、排行榜、创作者类型分布和增长趋势。"
      />
      <SectionCard title="创作者列表" description="展示平台内的创作者信息">
        <CreatorTablePreview />
      </SectionCard>
    </section>
  );
}
