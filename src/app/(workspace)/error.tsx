'use client';
import { useEffect } from 'react';
import { ErrorState } from '@/components/common/error-state';

type WorkspaceErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function WorkspaceError({ error, reset }: WorkspaceErrorProps) {
  useEffect(() => {
    console.error('Workspace error:', error);
  }, [error]);
  return (
    <section className="space-y-8">
      <ErrorState
        title="页面加载失败"
        description="当前页面加载出现异常，请稍后重试"
        errorMessage={error.message}
        actionText="重新加载"
        onAction={reset}
      />
    </section>
  );
}
