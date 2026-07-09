export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export const workspaceNavItems: NavItem[] = [
  {
    label: '平台总览',
    href: '/dashboard',
    description: '平台核心数据指数',
  },
  {
    label: '创作者分析',
    href: '/creators',
    description: '分析创作者相关数据',
  },
  {
    label: '内容管理',
    href: '/content',
    description: '视频内容管理',
  },
  {
    label: '观众画像',
    href: '/audience',
    description: '用户画像分析',
  },
  {
    label: '创作助手',
    href: '/assistant',
    description: '热点趋势与创作建议',
  },
  {
    label: '系统设置',
    href: '/settings',
    description: '基础配置',
  },
];

export const routeTitleMap: Record<string, string> = {
  '/dashboard': '平台总览',
  '/creators': '创作者分析',
  '/content': '内容管理',
  '/audience': '观众画像',
  '/assistant': '创作助手',
  '/settings': '系统设置',
};
