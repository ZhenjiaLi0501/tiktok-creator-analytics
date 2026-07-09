import type { ReactNode } from 'react';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { PageContainer } from '@/components/layout/page-container';
import { AppTopbar } from '@/components/layout/app-topbar';

type WorkspaceLayoutProps = {
  children: ReactNode;
};

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-douyin-dark text-slate-100">
      <AppSidebar />

      <div className="min-h-screen lg:pl-64">
        <AppTopbar />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
