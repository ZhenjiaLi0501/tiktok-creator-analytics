import { PageHeader } from '@/components/business/page-header';
import { AudiencePageContent } from '@/features/audience/components/audience-page-content';

export default function AudiencePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Audience"
        title="观众画像"
        description="分析中国区观众的基础属性、地域分布、终端偏好和内容兴趣。"
      />
      <AudiencePageContent />
    </div>
  );
}
