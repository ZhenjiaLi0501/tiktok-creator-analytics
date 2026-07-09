import { PageHeader } from '@/components/business/page-header';

export default function ContentPage() {
  return (
    <section>
      <PageHeader
        badge="Content"
        title="内容管理"
        description="管理和分析平台内所有创作者发布的视频内容，后续会接入十万级虚拟滚动列表。"
      />
    </section>
  );
}
