# 技术架构文档

## 一、项目定位

本项目是一个面向短视频内容生态的平台级创作者运营分析与内容管理系统。

系统以平台运营和数据分析视角为核心，面向平台内大量内容创作者及其发布的视频内容，提供平台数据大盘、内容管理、观众画像分析、热点趋势分析和创作辅助建议等能力。

项目不是为某一个创作者提供个人后台，而是模拟内容平台侧的创作者服务系统，帮助运营人员从全局维度观察创作者生态、内容表现、用户画像和内容趋势。

---

## 二、整体架构

项目采用前端中后台架构，基于 Next.js App Router 构建页面路由，通过业务模块拆分组织代码。

整体架构如下：

```txt
Page / Route
  -> Feature Component
  -> Business Component
  -> Service
  -> Request Wrapper
  -> MSW Mock API
  -> Processed Mock Data
```

核心分层：

```txt
src/app
  页面路由和布局

src/features
  业务模块实现

src/components
  通用组件、布局组件、图表组件

src/services
  API 请求封装

src/mocks
  MSW Mock 接口和 Mock 数据层

src/types
  TypeScript 类型定义

src/lib
  请求、格式化、工具函数

scripts
  Mock 数据生成脚本

data/processed
  处理后的 Mock 数据

public/mock
  生产模式读取的大体积静态 Mock 数据

docs
  项目文档
```

---

## 三、核心模块

## 3.1 Dashboard 平台数据大盘

路径：

```txt
/dashboard
```

模块目标：

展示平台内创作者生态和内容表现的整体数据，是系统首页和核心数据入口。

核心功能：

```txt
1. 核心指标概览
2. 播放量、点赞量、评论量、分享量趋势
3. 内容分类占比
4. 视频发布趋势
5. 时间范围筛选
6. ECharts 图表展示
7. 图表模块懒加载
```

技术要点：

```txt
ECharts 图表组件
图表 tooltip 格式化
图表主题配置
Dashboard 图表模块 dynamic import
清洗后的公开数据集接入
```

---

## 3.2 Content 内容管理

路径：

```txt
/content
```

模块目标：

展示和管理平台内所有创作者发布的视频内容，并验证大规模数据列表的前端渲染能力。

核心功能：

```txt
1. 十万级内容列表
2. 关键词搜索
3. 分类筛选
4. 状态筛选
5. 多字段排序
6. react-window 虚拟滚动
7. 批量发布
8. 批量下架
9. 批量删除
10. 视频详情抽屉
11. 骨架屏、空状态、错误状态
12. React 18 并发更新优化
```

技术要点：

```txt
react-window 虚拟滚动
useTransition
useDeferredValue
大数据 Mock 文件从 bundle 中剥离
列表行 memo 优化
详情抽屉组件拆分
批量操作接口 Mock
```

说明：

Content 页面保留十万级数据压力测试口径。虚拟列表减少的是 DOM 渲染压力，但十万条数据的加载、解析、筛选和排序仍会带来一定主线程压力。

---

## 3.3 Audience 观众画像

路径：

```txt
/audience
```

模块目标：

分析中国区观众画像，包括基础属性、终端偏好、区域分布和兴趣标签。

核心功能：

```txt
1. 中国区画像概览
2. 性别分布
3. 年龄分布
4. 终端分布
5. 中国区域热力图
6. 重点城市热点气泡
7. 省份 / 城市下钻
8. 兴趣关键词云
9. 关键词下钻分析
10. 深色模式可视化适配
```

技术要点：

```txt
ECharts 基础画像图表
D3 中国地图热力图
D3 关键词云
中国地图 GeoJSON
D3 子包按需导入
Audience D3 模块 dynamic import
```

中国地图数据：

```txt
public/maps/china.geo.json
```

为了避免地图被“南海诸岛”等特殊 feature 拉伸，渲染时会过滤特殊 feature，仅使用主体省级边界参与投影适配。

---

## 3.4 Assistant 创作助手

路径：

```txt
/assistant
```

模块目标：

基于历史内容表现，分析热点内容、分类趋势、发布时间规律和标题关键词，为运营人员提供内容策略建议。

核心功能：

```txt
1. 创作助手概览
2. 热点内容榜单
3. 分类趋势分析
4. 发布时间推荐
5. 标题词频分析
6. 创作建议清单
7. Framer Motion 动效
8. loading / empty / error 状态
```

技术要点：

```txt
基于 content-list.json 的历史内容聚合
热点内容热度分计算
分类趋势分计算
发布时间推荐算法
标题词频统计
中文运营关键词种子
创作建议规则生成
Framer Motion 动画交互
Assistant 动效模块 dynamic import
```

---

## 四、路由设计

项目使用 Next.js App Router。

```txt
src/app
  page.tsx
  layout.tsx
  globals.css

  (workspace)
    layout.tsx

    dashboard
      page.tsx

    content
      page.tsx

    audience
      page.tsx

    assistant
      page.tsx

    settings
      page.tsx
```

路由说明：

| 路由         | 页面         | 说明                               |
| ------------ | ------------ | ---------------------------------- |
| `/`          | 首页重定向   | 默认跳转到 `/dashboard`            |
| `/dashboard` | 平台数据大盘 | 展示核心指标和趋势图表             |
| `/content`   | 内容管理     | 管理十万级视频内容列表             |
| `/audience`  | 观众画像     | 展示中国区用户画像和下钻分析       |
| `/assistant` | 创作助手     | 提供热点、标题、发布时间和建议分析 |
| `/settings`  | 系统设置     | 基础设置页面                       |

---

## 五、布局架构

项目采用中后台布局。

桌面端：

```txt
┌────────────────────────────────────────────┐
│ TopBar                                     │
├──────────────┬─────────────────────────────┤
│ Sidebar      │ Main Content                │
│ Navigation   │ Page Header                 │
│              │ Cards / Charts / Tables     │
└──────────────┴─────────────────────────────┘
```

移动端：

```txt
┌──────────────────────────┐
│ Mobile Header            │
├──────────────────────────┤
│ Page Content             │
│ Cards / Charts / Lists   │
├──────────────────────────┤
│ Bottom Tab Navigation    │
└──────────────────────────┘
```

相关组件：

```txt
src/components/layout/app-sidebar.tsx
src/components/layout/app-topbar.tsx
src/components/layout/mobile-tabbar.tsx
src/components/layout/page-container.tsx
src/app/(workspace)/layout.tsx
```

---

## 六、目录结构

```txt
src
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── (workspace)
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── content/page.tsx
│       ├── audience/page.tsx
│       ├── assistant/page.tsx
│       └── settings/page.tsx
│
├── components
│   ├── business
│   ├── charts
│   ├── common
│   ├── layout
│   ├── motion
│   └── ui
│
├── features
│   ├── dashboard
│   ├── content
│   ├── audience
│   └── creator-assistant
│
├── lib
│   ├── request.ts
│   ├── format.ts
│   ├── utils.ts
│   └── performance.ts
│
├── mocks
│   ├── browser.ts
│   ├── handlers.ts
│   ├── data
│   └── handlers
│
├── services
│   ├── dashboard.ts
│   ├── content.ts
│   ├── audience.ts
│   └── creator-assistant.ts
│
├── test
│   └── setup.ts
│
└── types
    ├── api.ts
    ├── dashboard.ts
    ├── content.ts
    ├── audience.ts
    └── creator-assistant.ts
```

---

## 七、数据链路

项目数据链路如下：

```txt
公开数据集 / 种子数据
  -> scripts/*.mjs 数据生成脚本
  -> data/processed/*.json
  -> src/mocks/data/*
  -> src/mocks/handlers/*
  -> MSW Mock API
  -> services/*
  -> feature components
  -> page UI
```

---

## 八、数据生成脚本

### 8.1 Dashboard 数据

```txt
scripts/build-dashboard-data.mjs
```

生成：

```txt
data/processed/dashboard-overview.json
data/processed/dashboard-trend.json
data/processed/dashboard-categories.json
data/processed/dashboard-publish-trend.json
data/processed/dashboard-meta.json
```

命令：

```bash
pnpm data:build
```

---

### 8.2 Content 数据

```txt
scripts/build-content-data.mjs
```

生成：

```txt
data/processed/content-list.json
data/processed/content-meta.json
```

命令：

```bash
pnpm data:content
```

说明：

Content 数据会扩展到十万条，用于验证虚拟滚动和大列表交互性能。

---

### 8.3 Audience 数据

```txt
scripts/build-audience-data.mjs
```

生成：

```txt
data/processed/audience-overview.json
data/processed/audience-demographics.json
data/processed/audience-regions.json
data/processed/audience-keywords.json
data/processed/audience-region-details.json
```

命令：

```bash
pnpm data:audience
```

说明：

Audience 数据以中国省份和重点城市为主，用于中国区观众画像和地图热力图。

---

### 8.4 Assistant 数据

```txt
scripts/build-assistant-data.mjs
```

生成：

```txt
data/processed/assistant-overview.json
data/processed/assistant-hot-contents.json
data/processed/assistant-category-trends.json
data/processed/assistant-publish-times.json
data/processed/assistant-title-keywords.json
data/processed/assistant-suggestions.json
```

命令：

```bash
pnpm data:assistant
```

说明：

Assistant 数据基于 `content-list.json` 进一步聚合生成，不是纯随机 Mock 数据。热点榜单、分类趋势、发布时间推荐和标题词频均来自历史内容数据的规则计算。

---

## 九、API 设计

完整 API 见：

```txt
docs/api-reference.md
```

核心接口分组：

```txt
/api/dashboard/*
/api/content/*
/api/audience/*
/api/creator-assistant/*
```

统一响应结构：

```ts
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  requestId: string;
  timestamp: number;
};
```

---

## 十、Mock API 设计

项目使用 MSW 提供 Mock API。

开发环境：

```txt
pnpm dev
  -> MSW Service Worker 拦截 /api/*
```

本地生产模式：

```txt
NEXT_PUBLIC_API_MOCKING=enabled
pnpm build
pnpm start
  -> MSW Service Worker 拦截 /api/*
```

相关文件：

```txt
src/mocks/browser.ts
src/mocks/handlers.ts
src/mocks/handlers/*
src/mocks/data/*
public/mockServiceWorker.js
```

说明：

生产模式继续依赖 MSW 是为了本地演示和前端 Mock 测试。真实线上环境建议替换为真实后端 API 或 Next.js Route Handlers。

---

## 十一、组件设计

### 11.1 通用组件

```txt
src/components/common
src/components/business
src/components/layout
src/components/ui
```

包括：

```txt
EmptyState
ErrorState
LoadingState
MetricCard
FilterBar
BaseTable
Pagination
DetailDrawer
PageHeader
SectionCard
```

---

### 11.2 图表组件

```txt
src/components/charts
```

包括：

```txt
BaseEChart
chart-theme
chart-tooltip
```

设计原则：

```txt
1. ECharts 初始化统一封装
2. 图表主题配置统一维护
3. tooltip 格式化逻辑统一抽离
4. ResizeObserver 监听容器变化
5. 图表卸载时销毁实例，避免内存泄漏
```

---

### 11.3 业务组件

```txt
src/features/dashboard/components
src/features/content/components
src/features/audience/components
src/features/creator-assistant/components
```

设计原则：

```txt
1. 页面组件负责组合业务模块
2. Section 组件负责局部业务展示
3. 通用逻辑抽离到 lib 或 services
4. 复杂 UI 拆分为独立组件
5. 组件 Props 使用 TypeScript 明确声明
```

---

## 十二、状态管理设计

项目当前主要使用 React 内置状态管理能力：

```txt
useState
useEffect
useMemo
useCallback
useTransition
useDeferredValue
```

数据请求通过 services 封装，不直接在组件中写底层 fetch 细节。

当前没有引入额外全局状态库，原因是：

```txt
1. 当前页面之间共享状态较少
2. 各模块数据相对独立
3. 使用局部状态可以降低复杂度
4. 中后台筛选条件暂时不需要跨页面持久化
```

后续如果需要跨页面共享筛选条件、主题、用户信息等状态，可以再引入 Zustand 或 TanStack Query。

---

## 十三、性能优化架构

项目性能优化主要包括以下几个方向：

### 13.1 路由级代码分割

Next.js App Router 默认支持路由级代码分割，不同页面会生成对应 route chunk。

---

### 13.2 组件级懒加载

使用 `next/dynamic` 对重型组件进行懒加载：

```txt
Dashboard ECharts 图表模块
Audience D3 地图和关键词云
Assistant Framer Motion 交互模块
```

目标：

```txt
1. 降低首屏主路径 JS 压力
2. 避免重型依赖污染无关页面
3. 提升 Lighthouse 首屏指标
```

---

### 13.3 大列表优化

Content 页面使用：

```txt
react-window
useTransition
useDeferredValue
memo
```

优化目标：

```txt
1. 避免十万条数据一次性挂载 DOM
2. 控制实际 DOM 行数在可视区域附近
3. 筛选和排序时保留旧列表，降低交互阻塞感
4. 为大数据处理场景保留后续 Web Worker / 服务端分页优化空间
```

---

### 13.4 D3 按需导入

从：

```ts
import * as d3 from 'd3';
```

优化为：

```ts
import { max } from 'd3-array';
import { geoMercator, geoPath } from 'd3-geo';
import { interpolateRgb } from 'd3-interpolate';
import { scaleSequential, scaleSqrt } from 'd3-scale';
```

目标：

```txt
减少 D3 全量包进入客户端 bundle。
```

---

### 13.5 静态资源优化

在 `next.config.ts` 中配置：

```txt
1. 图片格式 avif / webp
2. 远程图片域名
3. 地图 GeoJSON 缓存
4. public/mock 静态数据缓存
```

---

## 十四、测试架构

项目使用：

```txt
Vitest
React Testing Library
@testing-library/jest-dom
@testing-library/user-event
@vitest/coverage-v8
```

测试类型：

```txt
1. 工具函数测试
2. 通用组件测试
3. 创作助手核心组件测试
4. 交互状态切换测试
5. 空状态测试
```

相关文件：

```txt
vitest.config.ts
src/test/setup.ts
*.test.ts
*.test.tsx
```

测试命令：

```bash
pnpm test
pnpm test:coverage
```

完整测试说明见：

```txt
docs/testing-report.md
```

---

## 十五、工程规范

项目使用：

```txt
ESLint
Prettier
Husky
lint-staged
commitlint
TypeScript
```

提交格式：

```txt
<type>(scope): <subject>
```

示例：

```txt
feat(content): add virtual content list
perf(audience): use granular d3 imports
test(assistant): add core interaction tests
docs(api): add api reference
```

---

## 十六、部署架构

当前本地生产模式：

```txt
pnpm build
pnpm start
```

依赖：

```txt
NEXT_PUBLIC_API_MOCKING=enabled
public/mockServiceWorker.js
data/processed/*
public/mock/content-list.json
public/maps/china.geo.json
```

真实线上部署建议：

```txt
1. 将 MSW 替换为真实 API 或 Next.js Route Handlers
2. 将大 JSON 数据放到对象存储或后端服务
3. 接入真实监控和错误追踪
4. 根据生产环境重新配置缓存策略
```

部署说明见：

```txt
docs/deployment-guide.md
```

---

## 十七、后续扩展方向

后续可以继续扩展：

```txt
1. 接入真实后端 API
2. 引入 TanStack Query 管理服务端状态
3. 引入 Zustand 管理跨页面 UI 状态
4. 使用 Web Worker 处理大数据筛选和排序
5. 将 content-list 改为服务端分页和接口排序
6. 接入真实 Web Vitals 监控
7. 接入 Sentry 或 OpenTelemetry
8. 增加更多组件测试和 E2E 测试
```
