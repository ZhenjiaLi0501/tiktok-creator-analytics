import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <main className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8">{children}</main>;
}
