'use client';

import { PageHeader } from '@/components/business/page-header';
import { SectionCard } from '@/components/business/section-card';
import { ContentEmptyState } from '@/features/content/components/content-empty-state';

export default function ContentPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        badge="Content"
        title="内容管理"
        description="管理和分析平台内所有创作者发布的视频内容，后续会接入十万级虚拟滚动列表。"
      />
      <SectionCard
        title="视频内容列表"
        description="前阶段暂未接入内容列表数据，后续将通过 MSW Mock 接入十万级视频数据。"
      >
        <ContentEmptyState />
      </SectionCard>
    </section>
  );
}
