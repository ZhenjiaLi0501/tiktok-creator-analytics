'use client';

import { EmptyState } from '@/components/common/empty-state';

export function ContentEmptyState() {
  return (
    <EmptyState
      title="暂无视频内容"
      description="当前筛选条件下没有匹配的视频内容。你可以调整筛选条件，或等待后续接入内容管理 Mock 数据。"
      actionText="重置筛选"
      onAction={() => {
        console.log('reset filters');
      }}
    />
  );
}
