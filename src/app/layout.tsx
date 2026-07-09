import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MswProvider } from '@/mocks/msw-provider';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: '短视频创作者运营分析平台',
  description: '平台侧创作者运营分析与内容管理系统',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN" className={cn('dark', 'font-sans', geist.variable)}>
      <body>
        <MswProvider>{children}</MswProvider>
      </body>
    </html>
  );
}
