# API 接口定义文档

## 一、接口说明

本项目当前使用 **MSW** 提供 Mock API，用于模拟平台数据大盘、内容管理、观众画像和创作助手模块的数据请求。

开发环境下，请求会被浏览器端 MSW Service Worker 拦截。
本地生产模式下，项目仍然可以通过 MSW 提供 Mock API，需要确保：

```txt
NEXT_PUBLIC_API_MOCKING=enabled
public/mockServiceWorker.js 存在
```

本项目接口主要服务以下页面：

```txt
/dashboard   平台数据大盘
/content     内容管理
/audience    观众画像
/assistant   创作助手
```

---

## 二、统一响应结构

所有接口统一返回以下结构：

```ts
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  requestId: string;
  timestamp: number;
};
```

成功响应示例：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "requestId": "mock-request-id",
  "timestamp": 1720000000000
}
```

错误响应示例：

```json
{
  "code": 404,
  "message": "content not found",
  "data": null,
  "requestId": "mock-request-id",
  "timestamp": 1720000000000
}
```

---

## 三、Dashboard 数据大盘接口

### 3.1 获取核心指标概览

```txt
GET /api/dashboard/overview
```

#### Query 参数

| 参数      | 类型                           | 必填 | 默认值 | 说明     |
| --------- | ------------------------------ | ---: | ------ | -------- |
| dateRange | `today \| 7d \| 30d \| custom` |   否 | `7d`   | 时间范围 |

#### 返回说明

返回平台核心运营指标，包括创作者数量、活跃创作者数量、视频数量、播放量、点赞量、评论量、分享量和互动率等。

#### 示例请求

```txt
GET /api/dashboard/overview?dateRange=7d
```

---

### 3.2 获取核心趋势数据

```txt
GET /api/dashboard/trend
```

#### Query 参数

| 参数      | 类型                           | 必填 | 默认值 | 说明     |
| --------- | ------------------------------ | ---: | ------ | -------- |
| dateRange | `today \| 7d \| 30d \| custom` |   否 | `7d`   | 时间范围 |

#### 返回说明

返回播放量、点赞量、评论量、分享量、活跃创作者数量等趋势数据。

#### 示例请求

```txt
GET /api/dashboard/trend?dateRange=30d
```

---

### 3.3 获取内容分类占比

```txt
GET /api/dashboard/categories
```

#### Query 参数

| 参数      | 类型                           | 必填 | 默认值 | 说明     |
| --------- | ------------------------------ | ---: | ------ | -------- |
| dateRange | `today \| 7d \| 30d \| custom` |   否 | `7d`   | 时间范围 |

#### 返回说明

返回不同内容分类的视频数量、播放量和占比数据。

#### 示例请求

```txt
GET /api/dashboard/categories?dateRange=7d
```

---

### 3.4 获取视频发布趋势

```txt
GET /api/dashboard/publish-trend
```

#### Query 参数

| 参数      | 类型                           | 必填 | 默认值 | 说明     |
| --------- | ------------------------------ | ---: | ------ | -------- |
| dateRange | `today \| 7d \| 30d \| custom` |   否 | `7d`   | 时间范围 |

#### 返回说明

返回视频发布数量和活跃创作者数量的趋势数据。

#### 示例请求

```txt
GET /api/dashboard/publish-trend?dateRange=today
```

---

## 四、Content 内容管理接口

### 4.1 获取内容列表

```txt
GET /api/content/list
```

#### Query 参数

| 参数      | 类型                                       | 必填 | 默认值        | 说明                                 |
| --------- | ------------------------------------------ | ---: | ------------- | ------------------------------------ |
| page      | number                                     |   否 | `1`           | 页码                                 |
| pageSize  | number                                     |   否 | `50`          | 每页数量                             |
| keyword   | string                                     |   否 | -             | 搜索关键词，匹配视频标题或创作者名称 |
| category  | string                                     |   否 | `all`         | 内容分类，`all` 表示全部             |
| status    | `published \| reviewing \| offline \| all` |   否 | `all`         | 内容状态                             |
| sortBy    | string                                     |   否 | `publishTime` | 排序字段                             |
| sortOrder | `asc \| desc`                              |   否 | `desc`        | 排序方向                             |

#### 支持的排序字段

```txt
publishTime
playCount
likeCount
commentCount
shareCount
engagementRate
```

#### 返回结构

```ts
export type ContentListResponse = {
  list: ContentVideo[];
  total: number;
  page: number;
  pageSize: number;
};
```

#### `ContentVideo` 字段

```ts
export type ContentVideo = {
  id: string;
  sourceVideoId: string;
  title: string;
  creatorName: string;
  category: string;
  region: string;
  coverUrl: string;
  publishTime: string;
  duration: number;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  engagementRate: number;
  status: 'published' | 'reviewing' | 'offline';
};
```

#### 示例请求

```txt
GET /api/content/list?page=1&pageSize=100000&sortBy=playCount&sortOrder=desc
```

```txt
GET /api/content/list?page=1&pageSize=50&keyword=music&category=娱乐&status=published
```

---

### 4.2 获取内容分类列表

```txt
GET /api/content/categories
```

#### 返回结构

```ts
string[]
```

#### 返回说明

返回所有内容分类字符串数组，用于内容管理页面的分类筛选。

---

### 4.3 获取内容详情

```txt
GET /api/content/:id
```

#### Path 参数

| 参数 | 类型   | 说明    |
| ---- | ------ | ------- |
| id   | string | 内容 ID |

#### 返回结构

```ts
ContentVideo;
```

#### 示例请求

```txt
GET /api/content/content_001
```

#### 错误情况

当内容不存在时返回：

```json
{
  "code": 404,
  "message": "content not found",
  "data": null,
  "requestId": "mock-request-id",
  "timestamp": 1720000000000
}
```

---

### 4.4 批量修改内容状态

```txt
POST /api/content/batch-status
```

#### Request Body

```ts
export type BatchUpdateContentStatusPayload = {
  ids: string[];
  status: 'published' | 'reviewing' | 'offline';
};
```

#### 请求示例

```json
{
  "ids": ["content_001", "content_002"],
  "status": "offline"
}
```

#### 返回结构

```ts
{
  updatedIds: string[];
}
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "updatedIds": ["content_001", "content_002"]
  },
  "requestId": "mock-request-id",
  "timestamp": 1720000000000
}
```

---

### 4.5 批量删除内容

```txt
POST /api/content/batch-delete
```

#### Request Body

```ts
export type BatchDeleteContentPayload = {
  ids: string[];
};
```

#### 请求示例

```json
{
  "ids": ["content_001", "content_002"]
}
```

#### 返回结构

```ts
{
  deletedIds: string[];
}
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "deletedIds": ["content_001", "content_002"]
  },
  "requestId": "mock-request-id",
  "timestamp": 1720000000000
}
```

---

## 五、Audience 观众画像接口

### 5.1 获取观众画像概览

```txt
GET /api/audience/overview
```

#### 返回结构

```ts
export type AudienceOverview = {
  totalAudience: number;
  activeAudience: number;
  newAudience: number;
  avgWatchDuration: number;
  interactionRate: number;
  retentionRate: number;
  topRegion: string;
  regionCount: number;
};
```

#### 返回说明

返回中国区观众规模、活跃观众、新增观众、平均观看时长、互动率、留存率和最高热度区域等数据。

---

### 5.2 获取基础画像分布

```txt
GET /api/audience/demographics
```

#### 返回结构

```ts
export type AudienceMetricItem = {
  label: string;
  value: number;
};

export type AudienceDemographics = {
  gender: AudienceMetricItem[];
  age: AudienceMetricItem[];
  device: AudienceMetricItem[];
};
```

#### 返回说明

返回性别、年龄和终端设备分布数据。

---

### 5.3 获取中国区域热力图数据

```txt
GET /api/audience/regions
```

#### 返回结构

```ts
export type AudienceRegion = {
  id: string;
  name: string;
  city: string;
  lng: number;
  lat: number;
  audienceCount: number;
  activeRate: number;
  interactionRate: number;
  heat: number;
  topCategory: string;
  rank: number;
};
```

#### 返回说明

返回中国重点省份 / 城市的观众规模、经纬度、活跃率、互动率、热力值和热门分类等数据。

---

### 5.4 获取区域下钻详情

```txt
GET /api/audience/regions/:regionId
```

#### Path 参数

| 参数     | 类型   | 说明                           |
| -------- | ------ | ------------------------------ |
| regionId | string | 区域 ID，例如 `GD`、`BJ`、`SH` |

#### 返回结构

```ts
export type AudienceRegionKeyword = {
  word: string;
  value: number;
};

export type AudienceRegionDetail = {
  regionId: string;
  regionName: string;
  city: string;
  audienceCount: number;
  activeRate: number;
  interactionRate: number;
  topCategory: string;
  gender: AudienceMetricItem[];
  age: AudienceMetricItem[];
  device: AudienceMetricItem[];
  keywords: AudienceRegionKeyword[];
};
```

#### 示例请求

```txt
GET /api/audience/regions/GD
```

#### 返回说明

返回指定区域的观众画像详情，包括区域核心指标、性别分布、年龄分布、终端分布和兴趣关键词。

---

### 5.5 获取兴趣关键词云数据

```txt
GET /api/audience/keywords
```

#### 返回结构

```ts
export type AudienceKeyword = {
  word: string;
  value: number;
  type: 'category' | 'interest';
};
```

#### 返回说明

返回兴趣关键词列表，包括关键词、热度值和关键词类型。

---

## 六、Creator Assistant 创作助手接口

### 6.1 获取创作助手概览

```txt
GET /api/creator-assistant/overview
```

#### 返回结构

```ts
export type AssistantOverview = {
  hotContentCount: number;
  categoryTrendCount: number;
  recommendedSlotCount: number;
  titleKeywordCount: number;
  suggestionCount: number;
  topCategory: string;
  bestPublishTime: string;
  topKeyword: string;
  generatedAt: string;
};
```

#### 返回说明

返回热点内容数量、趋势分类数量、推荐发布时间数量、高频标题词数量、建议数量和核心推荐摘要。

---

### 6.2 获取热点内容榜单

```txt
GET /api/creator-assistant/hot-contents
```

#### 返回结构

```ts
export type AssistantHotContent = {
  id: string;
  title: string;
  creatorName: string;
  category: string;
  publishTime: string;
  publishSlot: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  engagementRate: number;
  hotScore: number;
  reasonTags: string[];
  rank: number;
};
```

#### 返回说明

返回历史高表现内容榜单，包括标题、创作者、分类、发布时间、播放量、点赞量、评论量、互动率、热度分和推荐标签。

---

### 6.3 获取分类趋势

```txt
GET /api/creator-assistant/category-trends
```

#### 返回结构

```ts
export type AssistantTrendStatus = 'rising' | 'stable' | 'potential';

export type AssistantCategoryTrend = {
  category: string;
  videoCount: number;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  avgEngagementRate: number;
  trendScore: number;
  trendStatus: AssistantTrendStatus;
  suggestion: string;
};
```

#### 返回说明

返回分类维度的内容趋势分析，包括视频数量、播放量、点赞量、平均互动率、趋势分、趋势状态和运营建议。

---

### 6.4 获取发布时间推荐

```txt
GET /api/creator-assistant/publish-times
```

#### 返回结构

```ts
export type AssistantCompetitionLevel = 'high' | 'medium' | 'low';

export type AssistantPublishTime = {
  id: string;
  weekday: number;
  weekdayText: string;
  hour: number;
  label: string;
  score: number;
  avgPlayCount: number;
  avgEngagementRate: number;
  sampleCount: number;
  competitionLevel: AssistantCompetitionLevel;
  competitionText: string;
  expectedPlayLift: number;
  reason: string;
};
```

#### 返回说明

返回基于历史数据统计的推荐发布时间段，包括推荐分、平均播放、平均互动率、样本数量、竞争程度、预计播放提升和推荐理由。

---

### 6.5 获取标题关键词分析

```txt
GET /api/creator-assistant/title-keywords
```

#### 返回结构

```ts
export type AssistantTitleKeyword = {
  word: string;
  count: number;
  avgPlayCount: number;
  score: number;
  type: string;
  suggestion: string;
};
```

#### 返回说明

返回标题高频词和中文运营关键词，包括出现次数、平均播放、标题价值分、关键词类型和优化建议。

---

### 6.6 获取创作建议清单

```txt
GET /api/creator-assistant/suggestions
```

#### 返回结构

```ts
export type AssistantPriority = 'high' | 'medium' | 'low';

export type AssistantSuggestion = {
  id: string;
  title: string;
  type: string;
  priority: AssistantPriority;
  reason: string;
  action: string;
};
```

#### 返回说明

返回基于热点内容、分类趋势、发布时间和标题关键词生成的创作建议，包括建议标题、类型、优先级、推荐理由和执行动作。

---

## 七、接口错误处理

前端请求封装会统一处理 HTTP 状态码和业务状态码。

### 7.1 HTTP 错误

当接口返回非 `2xx` 状态码时，请求层会抛出错误。

示例：

```txt
Request failed with status 404
```

### 7.2 业务错误

当响应中的 `code !== 0` 时，前端也会视为业务错误。

错误结构：

```ts
{
  code: number;
  message: string;
  data: null;
  requestId: string;
  timestamp: number;
}
```

### 7.3 页面处理策略

页面应根据错误状态展示对应 UI：

```txt
loading === true
  -> 显示骨架屏

errorMessage 有值
  -> 显示错误状态

data 为空
  -> 显示空状态

data 正常
  -> 显示业务内容
```

---

## 八、数据来源说明

本项目 API 数据来自 `data/processed` 下的处理后 Mock 数据：

```txt
dashboard-*.json
content-*.json
audience-*.json
assistant-*.json
```

数据生成脚本如下：

```txt
scripts/build-dashboard-data.mjs
scripts/build-content-data.mjs
scripts/build-audience-data.mjs
scripts/build-assistant-data.mjs
```

对应命令：

```bash
pnpm data:build
pnpm data:content
pnpm data:audience
pnpm data:assistant
```

---

## 九、大数据文件说明

内容管理模块使用十万级内容数据：

```txt
data/processed/content-list.json
```

为了避免该大 JSON 被直接打入业务 JS bundle，项目会将其复制到：

```txt
public/mock/content-list.json
```

页面通过接口或静态路径读取该文件，而不是在业务组件中直接 import。

这样可以避免十万级数据进入前端 bundle，降低构建产物体积。

---

## 十、生产模式 Mock 说明

本项目当前本地生产模式仍然依赖 MSW 提供 Mock API。

需要确保：

```txt
NEXT_PUBLIC_API_MOCKING=enabled
public/mockServiceWorker.js 存在
```

生产模式启动流程：

```bash
pnpm build
pnpm start
```

说明：

当前生产模式使用 MSW 主要用于本地演示和前端 Mock 测试。真实线上环境中，可以将 MSW 替换为真实后端 API 或 Next.js Route Handlers。
