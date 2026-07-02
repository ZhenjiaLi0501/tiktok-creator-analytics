This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 短视频创作者运营分析与内容管理系统技术设计方案

## 1. 项目定位

本项目是一个面向短视频内容生态的平台级创作者运营分析与内容管理系统。

系统以平台运营和数据分析视角为核心，面向平台内大量内容创作者及其发布的视频内容，提供创作者数据总览、内容管理、观众画像分析、热点趋势分析和创作辅助建议等能力。

项目目标不是为某一个创作者提供个人后台，而是模拟内容平台侧创作者服务系统的前端产品形态，帮助运营人员从全局维度观察创作者生态、内容表现、用户画像和内容趋势。

系统默认展示全平台数据，同时支持按照时间范围、内容分类、创作者类型、地区、终端、单个创作者、单个视频等维度进行筛选和下钻分析。

---

## 2. 项目背景理解

短视频平台通常会服务大量内容创作者。平台侧需要持续观察创作者生态，包括创作者增长、活跃度、内容发布趋势、热门内容分布、观众画像变化以及不同内容分类的表现。

因此，本项目更接近“平台运营分析后台”，而不是“某个创作者自己的个人数据后台”。

核心业务对象包括：

- 创作者
- 视频内容
- 观众画像
- 热点趋势
- 内容分类
- 平台运营指标

---

## 3. 用户角色

### 3.1 平台运营人员

负责观察平台整体创作者生态，关注创作者增长、活跃创作者数量、内容发布量、热门内容趋势等数据。

### 3.2 数据分析人员

负责分析不同内容分类、不同地区、不同创作者类型下的数据表现，并通过图表和数据下钻发现问题。

### 3.3 内容管理人员

负责查看和管理平台内的视频内容列表，支持筛选、排序、详情查看和批量操作。

---

## 4. 核心业务模块

### 4.1 平台数据大盘

#### 模块目标

展示平台内创作者生态和内容表现的整体数据，是系统首页和核心入口。

#### 核心功能

- 视频发布总量
- 总播放量
- 总点赞量
- 总评论量
- 总分享量
- 视频发布趋势
- 播放、点赞、评论、分享趋势
- 内容分类占比
- 热门内容榜单摘要

#### 典型筛选条件

- 时间范围：今日、近 7 日、近 30 日、自定义
- 内容分类：美食、旅行、科技、娱乐、教育、游戏等
- 地区：全国、省份、城市

---

### 4.2 创作者分析

#### 模块目标

分析平台内创作者的整体分布、增长情况和头部创作者表现。

#### 创作者列表字段

- 创作者名称
- 创作者类型
- 所属地区
- 主营内容分类
- 粉丝数
- 视频数
- 总播放量
- 总点赞量
- 状态

---

### 4.3 内容管理

#### 模块目标

展示和管理平台内所有创作者发布的视频内容，并体现大规模数据列表渲染能力。

#### 核心功能

- 视频内容列表
- 多条件筛选
- 多字段排序
- 十万级虚拟滚动列表
- 视频详情侧边抽屉
- 批量选中
- 批量上下架
- 批量删除
- 列表首屏骨架屏

#### 内容列表字段

- 视频标题
- 创作者名称
- 内容分类
- 发布时间
- 播放量
- 点赞量
- 评论量
- 分享量
- 视频状态

---

### 4.4 观众画像

#### 模块目标

分析平台用户整体画像，并支持按照内容分类、创作者类型、地区等维度下钻。

#### 核心功能

- 性别分布
- 年龄分布
- 终端分布
- 地域分布热力图
- 兴趣标签词云
- 活跃时间分布
- 画像维度下钻
- 深色模式下的图表适配

#### 技术重点

- ECharts 用于常规图表
- D3.js 用于地域热力图和兴趣词云
- Faker.js 用于生成模拟用户画像数据

---

### 4.5 创作助手

#### 模块目标

从平台侧分析热点内容趋势、发布时间规律和标题词频，为运营人员提供内容方向判断。

#### 核心功能

- 热点内容榜单
- 内容分类趋势
- 发布时间推荐
- 标题词频分析
- 热门关键词分析
- 不同内容分类的创作建议
- 空状态、错误状态和交互动效

#### 说明

这里的“创作助手”不是单独服务某一个创作者，而是从平台整体数据中分析趋势，为平台运营和创作者扶持提供参考。

---

## 5. 技术栈

| 分类       | 技术选型                                             | 说明                               |
| ---------- | ---------------------------------------------------- | ---------------------------------- |
| 核心框架   | Next.js 15 + React 18 + TypeScript 5.5               | 构建现代 React 中后台应用          |
| 路由       | Next.js App Router                                   | 使用文件路由和布局嵌套管理页面     |
| 样式       | TailwindCSS v3                                       | 原子化 CSS 和响应式布局            |
| UI 组件    | shadcn/ui                                            | 可定制的高质量基础组件             |
| 动效       | Framer Motion                                        | 页面转场、抽屉、卡片交互动效       |
| 服务端状态 | TanStack Query v5                                    | 接口请求、缓存、刷新、错误状态管理 |
| 客户端状态 | Zustand                                              | 登录态、筛选条件、UI 状态管理      |
| Mock 接口  | MSW 2.0                                              | 模拟后端接口，支持无后端开发       |
| 图表       | Apache ECharts 5 + D3.js v7                          | 常规图表和复杂自定义可视化         |
| 高性能列表 | react-window                                         | 十万级数据虚拟滚动                 |
| 工程规范   | ESLint + Prettier + Husky + commitlint + lint-staged | 代码规范和提交门禁                 |
| 测试       | Vitest + React Testing Library                       | 核心组件和工具函数测试             |
| 性能审计   | Lighthouse + Web Vitals                              | 首屏、交互和资源性能分析           |
| 部署       | GitHub + Vercel                                      | 代码托管和线上部署                 |

---

## 6. 路由设计

### 6.1 路由总览

| 路由         | 页面         | 说明                             |
| ------------ | ------------ | -------------------------------- |
| `/dashboard` | 平台数据大盘 | 展示平台核心指标和趋势           |
| `/content`   | 内容管理     | 管理和分析平台视频内容           |
| `/audience`  | 观众画像     | 展示用户画像和下钻分析           |
| `/assistant` | 创作助手     | 分析热点内容、发布时间和标题词频 |
| `/settings`  | 系统设置     | 基础设置页，低优先级             |
| `/`          | 首页重定向   | 默认跳转到 `/dashboard`          |

### 6.2 App Router 目录结构

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css


    (workspace)/
      layout.tsx
      dashboard/
        page.tsx
      content/
        page.tsx
      audience/
        page.tsx
      assistant/
        page.tsx
      settings/
        page.tsx
```

---

## 7. 布局设计

### 7.1 桌面端布局

桌面端采用中后台布局：

```txt
┌────────────────────────────────────────────┐
│ TopBar                                     │
├──────────────┬─────────────────────────────┤
│ Sidebar      │ Main Content                │
│ Navigation   │ Page Header                 │
│              │ Filter Bar                  │
│              │ Cards / Charts / Tables     │
└──────────────┴─────────────────────────────┘
```

### 7.2 移动端布局

移动端采用轻量化布局：

```txt
┌──────────────────────────┐
│ Mobile Header            │
├──────────────────────────┤
│ Page Content             │
│ Cards                    │
│ Charts                   │
│ Lists                    │
├──────────────────────────┤
│ Bottom Tab Navigation    │
└──────────────────────────┘
```

### 7.3 响应式策略

| 屏幕宽度       | 布局策略                         |
| -------------- | -------------------------------- |
| >= 1024px      | 左侧导航 + 顶部栏 + 多列内容区   |
| 768px - 1023px | 折叠侧边栏 + 两列卡片布局        |
| < 768px        | 顶部标题栏 + 底部 Tab + 单列布局 |

---

## 8. 项目目录结构

```txt
src/
  app/
    (workspace)/
    layout.tsx
    page.tsx
    globals.css

  components/
    layout/
      app-sidebar.tsx
      app-topbar.tsx
      mobile-tabbar.tsx
      page-container.tsx

    common/
      loading.tsx
      empty-state.tsx
      error-state.tsx
      status-badge.tsx

    business/
      metric-card.tsx
      filter-bar.tsx
      data-table.tsx
      drawer-panel.tsx
      batch-action-bar.tsx

    charts/
      line-chart.tsx
      pie-chart.tsx
      bar-chart.tsx
      region-map.tsx
      word-cloud.tsx

  features/
    dashboard/
    content/
    audience/
    assistant/

  services/
    dashboard.ts
    content.ts
    audience.ts
    assistant.ts

  stores/
    filter-store.ts
    ui-store.ts

  hooks/
    use-mobile.ts
    use-debounce.ts

  lib/
    request.ts
    format.ts
    constants.ts

  mocks/
    browser.ts
    handlers.ts
    data/
      dashboard.ts
      content.ts
      audience.ts
      assistant.ts
    handlers/
      dashboard.ts
      content.ts
      audience.ts
      assistant.ts

  types/
    api.ts
    dashboard.ts
    content.ts
    audience.ts
    assistant.ts
```

---

## 9. 状态管理设计

### 9.1 服务端状态

使用 TanStack Query 管理接口数据，包括：

- 数据大盘指标
- 趋势图数据
- 视频内容列表
- 视频详情
- 观众画像数据
- 热点榜单数据

### 9.2 客户端状态

使用 Zustand 管理本地 UI 状态，包括：

- 全局筛选条件
- 侧边栏展开收起
- 移动端底部导航
- 主题模式

---

## 10. 数据模型设计

```ts
export type VideoStatus = 'published' | 'reviewing' | 'offline' | 'deleted';

export type Video = {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  coverUrl: string;
  category: string;
  platform: 'douyin';
  status: VideoStatus;
  duration: number;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  engagementRate: number;
  publishTime: string;
};
```

### 10.3 平台总览模型

```ts
export type PlatformOverview = {
  totalCreators: number;
  activeCreators: number;
  newCreators: number;
  totalVideos: number;
  totalPlayCount: number;
  totalLikeCount: number;
  totalCommentCount: number;
  totalShareCount: number;
  avgEngagementRate: number;
};
```

### 10.4 趋势数据模型

```ts
export type TrendPoint = {
  date: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  activeCreators: number;
  publishedVideos: number;
};
```

### 10.5 观众画像模型

```ts
export type AudienceProfile = {
  gender: {
    male: number;
    female: number;
    unknown: number;
  };
  ageGroups: {
    label: string;
    value: number;
  }[];
  devices: {
    device: 'iOS' | 'Android' | 'Web';
    value: number;
  }[];
  regions: {
    province: string;
    value: number;
  }[];
  interests: {
    label: string;
    value: number;
  }[];
};
```

---

## 11. API 设计

### 11.1 数据大盘接口

| 方法 | 接口                        | 说明             |
| ---- | --------------------------- | ---------------- |
| GET  | `/api/dashboard/overview`   | 获取平台核心指标 |
| GET  | `/api/dashboard/trend`      | 获取平台趋势数据 |
| GET  | `/api/dashboard/categories` | 获取内容分类分布 |
| GET  | `/api/dashboard/top-rank`   | 获取榜单摘要     |

示例：

```txt
GET /api/dashboard/overview?dateRange=7d&platform=douyin&category=all
```

### 11.2 创作者接口

| 方法 | 接口                       | 说明                     |
| ---- | -------------------------- | ------------------------ |
| GET  | `/api/creators/list`       | 获取创作者列表           |
| GET  | `/api/creators/ranking`    | 获取创作者排行榜         |
| GET  | `/api/creators/:id`        | 获取创作者详情           |
| GET  | `/api/creators/:id/videos` | 获取某个创作者的视频列表 |

### 11.3 内容管理接口

| 方法   | 接口                        | 说明             |
| ------ | --------------------------- | ---------------- |
| GET    | `/api/content/list`         | 获取视频内容列表 |
| GET    | `/api/content/:id`          | 获取视频详情     |
| PATCH  | `/api/content/batch-status` | 批量修改视频状态 |
| DELETE | `/api/content/batch-delete` | 批量删除视频     |

### 11.4 观众画像接口

| 方法 | 接口                      | 说明               |
| ---- | ------------------------- | ------------------ |
| GET  | `/api/audience/profile`   | 获取基础画像数据   |
| GET  | `/api/audience/region`    | 获取地域热力图数据 |
| GET  | `/api/audience/interests` | 获取兴趣标签数据   |

### 11.5 创作助手接口

| 方法 | 接口                                | 说明             |
| ---- | ----------------------------------- | ---------------- |
| GET  | `/api/assistant/hot-rank`           | 获取热点内容榜单 |
| GET  | `/api/assistant/category-trend`     | 获取分类趋势     |
| GET  | `/api/assistant/publish-suggestion` | 获取发布时间推荐 |
| POST | `/api/assistant/title-analysis`     | 标题词频分析     |

---

## 12. Mock 数据设计

### 12.1 Mock 数据来源

本项目使用两类数据：

1. 公开视频数据集  
   用于模拟热门视频、发布时间、分类、播放量、点赞数、评论数等内容数据。

2. Faker.js 生成数据  
   用于生成创作者、用户画像、兴趣标签、地域分布等模拟数据。

### 12.2 Mock 数据规模

| 数据类型     | 模拟规模                    |
| ------------ | --------------------------- |
| 创作者数据   | 1,000 - 10,000 条           |
| 视频内容数据 | 100,000 条                  |
| 观众画像数据 | 10,000 - 100,000 条聚合模拟 |
| 热点榜单数据 | 100 - 1,000 条              |

---

## 13. 数据请求流程

页面数据统一通过以下链路获取：

```txt
Page / Component
  -> feature hooks
  -> TanStack Query
  -> services/*
  -> fetch request
  -> MSW handlers
  -> mock data
```

示例：

```txt
DashboardPage
  -> useDashboardOverviewQuery
  -> getDashboardOverview
  -> GET /api/dashboard/overview
  -> dashboardHandler
  -> dashboardMockData
```

---

## 14. 工程规范

### 14.1 代码规范

项目使用：

- ESLint
- Prettier
- TypeScript strict mode
- lint-staged
- Husky
- commitlint

### 14.2 代码要求

- 禁止未使用变量
- 尽量避免 `any`
- 组件 Props 必须声明类型
- API 返回值必须声明类型
- 通用逻辑抽离到 hooks 或 lib
- 页面组件不直接写复杂数据处理逻辑
- Mock 数据和业务组件解耦

---

## 15. 移动端适配方案

虽然项目主要是中后台系统，但仍需要适配移动端查看体验。

### 15.1 移动端原则

- 移动端不完整复刻桌面端复杂表格
- 核心指标改为卡片纵向排列
- 图表自适应容器宽度
- 内容列表改为卡片列表
- 复杂筛选收纳到抽屉
- 底部导航替代桌面端侧边栏

### 15.2 各模块移动端表现

| 模块       | 移动端适配方式                  |
| ---------- | ------------------------------- |
| 数据大盘   | 指标卡单列 / 双列，图表纵向排列 |
| 创作者分析 | 创作者表格改为创作者卡片        |
| 内容管理   | 视频表格改为视频卡片列表        |
| 观众画像   | 图表缩放，地图支持横向滚动      |
| 创作助手   | 榜单和建议卡片纵向排列          |

---

## 16. 性能优化方案

### 16.1 首屏优化

- 路由级代码分割
- 图表组件动态加载
- 非首屏模块懒加载
- 骨架屏提升加载体验
- 图片资源压缩和懒加载

### 16.2 大列表优化

- 使用 `react-window` 虚拟滚动
- 避免十万条数据一次性渲染
- 筛选和搜索使用防抖
- 列表项组件使用 memo 降低重复渲染
- 大量数据处理可以作为后续 Web Worker 扩展方向

### 16.3 图表优化

- 图表按需加载
- 大数据图表使用采样或聚合数据
- 监听容器 resize，避免频繁重绘
- tooltip 和交互事件节流
- 深色模式下保持图表可读性

---

## 17. 测试方案

### 17.1 测试范围

优先测试：

- 通用组件
- 工具函数
- API 数据处理函数
- 筛选逻辑
- 标题词频分析逻辑
- 发布时间推荐逻辑

### 17.2 测试工具

- Vitest
- React Testing Library

### 17.3 测试目标

核心组件测试覆盖率达到 70% 以上。

---
