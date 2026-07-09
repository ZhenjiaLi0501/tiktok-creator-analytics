import { PageHeader } from '@/components/business/page-header';

export default function SettingsPage() {
  return (
    <section>
      <PageHeader
        badge="Settings"
        title="系统设置"
        description="当前为低优先级模块，后续可扩展基础配置。"
      />
    </section>
  );
}
