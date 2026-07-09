import { DashboardMockTest } from '@/features/dashboard/components/dashboard-mock-test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/business/page-header';

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        badge="Dashboard"
        title="平台数据大盘"
        description="展示全平台创作者数量、活跃创作者、视频发布量、播放量和互动率等核心指标。"
      />
      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle>核心指标概览</CardTitle>
          <CardDescription>通过MSW Mock 接口获取平台运营指标</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardMockTest />
        </CardContent>
      </Card>
    </section>
  );
}
