import { PageHeader } from '@/components/business/page-header';
import { CreatorAssistantPageContent } from '@/features/creator-assistant/components/creator-assistant-page-content';

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="创作助手"
        description="基于历史内容表现分析热点榜单、分类趋势和创作优化方向，辅助创作者制定内容策略。"
      />

      <CreatorAssistantPageContent />
    </div>
  );
}
