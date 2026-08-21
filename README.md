# TikTok Creator Analytics

短视频创作者运营分析与内容管理系统。
本项目是一个基于 **Next.js + React + TypeScript** 构建的前端中后台项目，面向平台运营和数据分析场景，模拟抖音平台侧对创作者生态、视频内容、观众画像和内容趋势的统一分析与管理能力。

项目不是单个创作者的个人后台，而是从 **平台运营视角** 出发，展示平台级创作者服务系统的产品形态。

## 在线访问

项目已部署到 Vercel：

````txt
https://tiktok-creator-analytics.vercel.app/

---

## 项目功能

### 1. 平台数据大盘

路径：

```txt
/dashboard
````

功能包括：

- 核心指标概览
- 播放量、点赞量、评论量趋势
- 内容分类占比
- 视频发布趋势
- 时间范围筛选
- ECharts 图表展示
- 图表模块懒加载优化

---

### 2. 内容管理

路径：

```txt
/content
```

功能包括：

- 十万级视频内容 Mock 数据
- `react-window` 虚拟滚动列表
- 关键词搜索
- 分类筛选
- 状态筛选
- 多字段排序
- 批量发布
- 批量下架
- 批量删除
- 视频详情抽屉
- 骨架屏、空状态、错误状态
- React 18 并发更新优化

说明：

`/content` 页面保留了十万级数据压力测试口径。虚拟列表只渲染当前可视区域附近的少量 DOM 节点，但浏览器仍需要处理大 JSON 加载、解析、筛选和排序，因此在 Lighthouse 中可能出现较高 TBT。该设计用于验证大规模内容管理场景下的前端渲染能力。

---

### 3. 观众画像

路径：

```txt
/audience
```

功能包括：

- 中国区观众画像概览
- 性别分布
- 年龄分布
- 终端分布
- 中国区域热力图
- 重点城市热点气泡
- 省份 / 城市下钻详情
- 兴趣关键词云
- 关键词下钻分析
- 深色模式可视化适配
- D3 子包按需导入
- D3 重型模块懒加载

---

### 4. 创作助手

路径：

```txt
/assistant
```

功能包括：

- 热点内容榜单
- 分类趋势分析
- 发布时间推荐
- 标题词频分析
- 标题关键词下钻
- 创作建议清单
- 推荐理由与执行动作展示
- Framer Motion 动画交互
- 卡片 hover / tap 动效
- 页面分区渐入动画
- loading / empty / error 状态

---

## 技术栈

| 分类         | 技术                                                 |
| ------------ | ---------------------------------------------------- |
| 核心框架     | Next.js / React / TypeScript                         |
| 路由         | Next.js App Router                                   |
| 样式         | TailwindCSS                                          |
| UI 组件      | shadcn/ui                                            |
| 图表         | Apache ECharts                                       |
| 自定义可视化 | D3.js                                                |
| 高性能列表   | react-window                                         |
| 动效         | Framer Motion                                        |
| Mock API     | MSW                                                  |
| 测试         | Vitest + React Testing Library                       |
| 代码规范     | ESLint + Prettier + Husky + lint-staged + commitlint |
| 性能分析     | Lighthouse + Bundle Analyzer                         |

---

## 项目目录

```txt
tiktok-creator-analytics
├── data
│   └── processed              # 清洗后的 Mock 数据
├── docs                       # 项目文档
│   ├── reports                # 周报 / 实验报告
│   ├── assets                 # 截图和 Lighthouse 结果
│   ├── api-reference.md       # API 接口文档
│   ├── architecture.md        # 技术架构文档
│   ├── deployment-guide.md    # 部署说明
│   ├── testing-report.md      # 测试文档
│   ├── performance-report.md  # 性能优化报告
│   ├── final-report.md        # 结项报告
│   └── demo-script.md         # 演示脚本
├── public
│   ├── maps
│   │   └── china.geo.json     # 中国地图 GeoJSON
│   ├── mock
│   │   └── content-list.json  # 内容管理大数据 Mock
│   └── mockServiceWorker.js   # MSW Service Worker
├── scripts
│   ├── build-dashboard-data.mjs
│   ├── build-content-data.mjs
│   ├── build-audience-data.mjs
│   └── build-assistant-data.mjs
├── src
│   ├── app                    # Next.js App Router 页面
│   ├── components             # 通用组件
│   ├── features               # 业务模块
│   ├── lib                    # 工具函数
│   ├── mocks                  # MSW Mock
│   ├── services               # 请求封装
│   ├── test                   # 测试环境配置
│   └── types                  # TypeScript 类型
├── README.md
├── package.json
├── next.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 生成 Mock 数据

首次运行前建议依次生成数据：

```bash
pnpm data:build
pnpm data:content
pnpm data:audience
pnpm data:assistant
```

说明：

- `data:build`：生成 Dashboard 数据
- `data:content`：生成内容管理十万级视频数据
- `data:audience`：生成中国区观众画像数据
- `data:assistant`：生成创作助手分析数据

如果内容管理模块依赖 `public/mock/content-list.json`，需要确保该文件存在。可将 `data/processed/content-list.json` 复制到：

```txt
public/mock/content-list.json
```

---

### 3. 启动开发环境

```bash
pnpm dev
```

浏览器访问：

```txt
http://localhost:3000
```

默认会跳转到：

```txt
/dashboard
```

---

## 生产模式本地运行

项目本地生产模式仍然使用 MSW 提供 Mock API，因此需要在 build 前配置环境变量。

### 1. 创建 `.env.local`

```env
NEXT_PUBLIC_API_MOCKING=enabled
```

### 2. 确认 MSW 文件存在

```txt
public/mockServiceWorker.js
```

如果不存在，执行：

```bash
pnpm exec msw init public/ --save
```

### 3. 构建并启动

```bash
pnpm build
pnpm start
```

访问：

```txt
http://localhost:3000
```

说明：

本项目生产模式下使用 MSW 主要是为了本地演示和前端 Mock 测试。真实线上环境中，可以将 MSW 替换为真实后端接口或 Next.js Route Handlers。

---

## 常用命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 启动生产模式
pnpm start

# ESLint 检查
pnpm lint

# TypeScript 检查
pnpm type-check

# 格式化
pnpm format

# 单元测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# Bundle Analyzer
pnpm build:analyze

# 生成 Dashboard 数据
pnpm data:build

# 生成 Content 数据
pnpm data:content

# 生成 Audience 数据
pnpm data:audience

# 生成 Assistant 数据
pnpm data:assistant
```

---

## Mock 数据说明

项目使用公开数据集清洗后的结果作为基础数据来源，并通过脚本生成不同模块所需的 Mock 数据。

数据链路：

```txt
公开视频数据
  -> scripts 数据清洗脚本
  -> data/processed/*.json
  -> MSW Mock API
  -> services/*
  -> 页面组件
```

主要数据文件：

```txt
data/processed/dashboard-*.json
data/processed/content-*.json
data/processed/audience-*.json
data/processed/assistant-*.json
```

其中：

- Dashboard 数据用于平台数据大盘
- Content 数据用于十万级内容管理列表
- Audience 数据用于中国区观众画像
- Assistant 数据用于热点榜单、发布时间推荐和标题词频分析

---

## API 概览

项目接口由 MSW Mock 提供，主要包括以下几组。

### Dashboard

```txt
GET /api/dashboard/overview
GET /api/dashboard/trend
GET /api/dashboard/categories
GET /api/dashboard/publish-trend
```

### Content

```txt
GET  /api/content/list
GET  /api/content/categories
GET  /api/content/:id
POST /api/content/batch-status
POST /api/content/batch-delete
```

### Audience

```txt
GET /api/audience/overview
GET /api/audience/demographics
GET /api/audience/regions
GET /api/audience/regions/:regionId
GET /api/audience/keywords
```

### Creator Assistant

```txt
GET /api/creator-assistant/overview
GET /api/creator-assistant/hot-contents
GET /api/creator-assistant/category-trends
GET /api/creator-assistant/publish-times
GET /api/creator-assistant/title-keywords
GET /api/creator-assistant/suggestions
```

完整接口定义见：

```txt
docs/api-reference.md
```

---

## 测试与质量保障

项目接入：

```txt
Vitest
React Testing Library
@testing-library/jest-dom
@testing-library/user-event
@vitest/coverage-v8
```

当前测试重点包括：

- 工具函数测试
- 通用组件测试
- 创作助手核心组件测试
- 交互状态切换测试
- 空状态和异常状态测试

运行测试：

```bash
pnpm test
```

生成覆盖率报告：

```bash
pnpm test:coverage
```

测试报告见：

```txt
docs/testing-report.md
```

---

## 性能优化

项目已完成以下性能优化：

1. Dashboard 图表模块动态加载。
2. Audience D3 地图和关键词云动态加载。
3. Assistant Framer Motion 交互模块动态加载。
4. D3 全量导入改为子包按需导入。
5. Content 十万级列表使用 `react-window` 虚拟滚动。
6. Content 列表更新接入 React 18 `useTransition` 和 `useDeferredValue`。
7. 大型 Mock JSON 从业务 bundle 中剥离。
8. 图片格式和远程图片域名配置优化。
9. 地图和 Mock 静态资源缓存策略优化。
10. 使用 Bundle Analyzer 分析客户端依赖体积。
11. 使用 Lighthouse 对核心页面进行性能审计。

Lighthouse 最终结果摘要：

| 页面         | Performance | Accessibility | Best Practices | SEO |
| ------------ | ----------: | ------------: | -------------: | --: |
| `/dashboard` |         100 |            95 |            100 | 100 |
| `/content`   |          85 |            92 |            100 | 100 |
| `/audience`  |          99 |            95 |            100 | 100 |
| `/assistant` |         100 |            95 |            100 | 100 |

说明：

`/content` 页面为了保留十万级内容管理压力测试场景，一次性加载和处理 100000 条 Mock 数据，因此 TBT 相对较高。该页面的主要瓶颈来自大数据加载、解析、筛选和排序，而不是 DOM 渲染。真实业务场景中可通过服务端分页、接口排序、Web Worker 或增量加载进一步优化。

完整性能报告见：

```txt
docs/performance-report.md
```

---

## 工程规范

项目使用以下工具保证工程质量：

```txt
ESLint
Prettier
Husky
lint-staged
commitlint
TypeScript strict mode
```

提交信息格式：

```txt
<type>(scope): <subject>
```

示例：

```bash
feat(content): add virtual content list
perf(audience): use granular d3 imports
test(assistant): add core interaction tests
docs(report): add week 7 lab report
```

常用 type：

```txt
feat
fix
docs
style
refactor
perf
test
chore
```

---

## 文档入口

```txt
docs/architecture.md         技术架构文档
docs/api-reference.md        API 接口定义
docs/testing-report.md       测试文档
docs/performance-report.md   性能优化报告
docs/deployment-guide.md     部署说明
docs/final-report.md         结项报告
docs/demo-script.md          演示脚本
docs/reports/                周实验报告
```

---

## 项目亮点

1. **平台级运营视角**
   项目不是个人创作者后台，而是模拟平台侧创作者运营分析系统。

2. **十万级内容管理列表**
   使用 `react-window` 实现大规模数据虚拟滚动，支持筛选、排序、批量操作和详情抽屉。

3. **多维数据可视化**
   使用 ECharts 实现常规图表，使用 D3 实现中国区域热力图和关键词云。

4. **创作辅助决策**
   基于历史内容数据生成热点榜单、分类趋势、发布时间推荐、标题词频分析和创作建议。

5. **完整 Mock 数据链路**
   通过数据清洗脚本生成 Dashboard、Content、Audience、Assistant 多模块 Mock 数据。

6. **性能专项优化**
   完成动态加载、D3 按需导入、虚拟滚动、静态资源缓存、Bundle Analyzer 和 Lighthouse 审计。

7. **质量保障体系**
   接入 Vitest、Testing Library、ESLint、Prettier、Husky、commitlint，覆盖核心组件和工具函数。

---

## 已知说明

- 当前项目以本地演示和前端 Mock 为主，生产模式仍依赖 MSW。
- `data/raw/` 原始数据集不建议提交到 GitHub。
- `data/processed/` 为项目运行所需的处理后 Mock 数据，可以保留。
- `/content` 页面保留十万级全量数据压力测试，因此 Lighthouse TBT 高于其他页面。
- 后续真实上线时，建议将 MSW 替换为真实后端 API 或 Next.js Route Handlers。
