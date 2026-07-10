import { LoadingState } from '@/components/common/loading-state';
export default function WorkspaceLoading() {
  return (
    <section className="space-y-8">
      <LoadingState title="页面加载中" description="请稍候，内容正在加载中..." rows={4} />
    </section>
  );
}
