# 性能优化报告

## 一、优化目标

本项目第七周主要围绕前端性能和工程质量进行专项优化。

优化目标包括：

1. 降低首屏 JavaScript 加载压力。
2. 避免重型图表库和动画库污染无关页面。
3. 优化十万级内容列表的渲染性能。
4. 减少大体积 Mock JSON 对业务 bundle 的影响。
5. 优化图片、地图、Mock 静态资源加载策略。
6. 使用 Bundle Analyzer 分析客户端依赖体积。
7. 使用 Lighthouse 对核心页面进行性能审计。
8. 保证核心页面在本地生产模式下具备较好的加载和交互体验。

---

## 二、测试环境

本次性能测试基于本地生产模式进行。

### 2.1 运行方式

```bash id="jmlj6t"
pnpm build
pnpm start
```

访问地址：

```txt id="qp94jr"
http://localhost:3000
```

### 2.2 Mock API 环境

由于项目当前没有真实后端，本地生产模式仍然使用 MSW 提供 Mock API。

需要确保 `.env.local` 中存在：

```env id="j1fwmp"
NEXT_PUBLIC_API_MOCKING=enabled
```

同时需要确保文件存在：

```txt id="buj3ot"
public/mockServiceWorker.js
```

说明：

生产模式下继续使用 MSW 是为了支持本地演示、Lighthouse 测试和前端 Mock 数据联调。真实线上环境中，建议将 MSW 替换为真实后端 API 或 Next.js Route Handlers。

---

## 三、Lighthouse 测试结果

测试页面包括：

```txt id="zsecuq"
/dashboard
/content
/audience
/assistant
```

### 3.1 总体结果

| 页面         | Performance | Accessibility | Best Practices | SEO |
| ------------ | ----------: | ------------: | -------------: | --: |
| `/dashboard` |         100 |            95 |            100 | 100 |
| `/content`   |          85 |            92 |            100 | 100 |
| `/audience`  |          99 |            95 |            100 | 100 |
| `/assistant` |         100 |            95 |            100 | 100 |

---

## 四、各页面性能结果分析

## 4.1 Dashboard 页面

路径：

```txt id="h966je"
/dashboard
```

Lighthouse 结果：

| 指标           |  结果 |
| -------------- | ----: |
| Performance    |   100 |
| Accessibility  |    95 |
| Best Practices |   100 |
| SEO            |   100 |
| FCP            |  0.2s |
| LCP            |  0.8s |
| TBT            |   0ms |
| CLS            | 0.003 |
| Speed Index    |  0.5s |

分析：

Dashboard 页面主要由指标卡片和 ECharts 图表组成。优化后，首屏核心指标模块优先渲染，趋势图、分类图、发布趋势图等较重模块使用动态加载，避免所有图表逻辑一次性进入首屏主路径。

优化效果：

1. 首屏 FCP 和 LCP 均较低。
2. TBT 为 0ms，说明主线程阻塞较少。
3. 图表模块没有明显拖慢 Dashboard 首屏。
4. 页面布局稳定，CLS 接近 0。

---

## 4.2 Content 页面

路径：

```txt id="rplu2q"
/content
```

Lighthouse 结果：

| 指标           |  结果 |
| -------------- | ----: |
| Performance    |    85 |
| Accessibility  |    92 |
| Best Practices |   100 |
| SEO            |   100 |
| FCP            |  0.2s |
| LCP            |  0.7s |
| TBT            | 340ms |
| CLS            |     0 |
| Speed Index    |  0.5s |

分析：

Content 页面是项目中压力最大的页面。该页面保留了十万级内容管理数据场景，一次性加载并处理 100000 条 Mock 视频内容数据。虽然列表渲染已经通过 `react-window` 控制 DOM 数量，但浏览器仍然需要处理大 JSON 加载、解析、筛选、排序和状态更新。

当前 Performance 为 85，主要受 TBT 影响。

TBT 来源主要包括：

1. 十万级 JSON 文件加载和解析。
2. 首次数据过滤和排序。
3. 搜索、筛选、排序时的数据计算。
4. 批量操作后列表状态更新。
5. MSW 在本地生产模式下的请求拦截成本。

需要强调：

`react-window` 解决的是 DOM 渲染问题，不会自动消除十万条数据本身的解析和计算成本。当前页面实际 DOM 行数已经被控制在可视区域附近，主要瓶颈来自数据处理，而不是 DOM 节点数量。

后续可优化方向：

1. 将十万条数据改为服务端分页。
2. 排序和筛选逻辑放到后端接口处理。
3. 使用 Web Worker 处理大数据筛选和排序。
4. 首屏只加载第一页或前 1000 条数据。
5. 将 `/content` 普通演示模式和压力测试模式拆分。
6. 移除生产模式 MSW，改用真实 API 或 Route Handlers。

本项目为了保留“十万级内容管理列表”验收和演示场景，当前没有将 `/content` 改成普通分页模式，因此该页面 Lighthouse Performance 低于其他页面。

---

## 4.3 Audience 页面

路径：

```txt id="je5hfi"
/audience
```

Lighthouse 结果：

| 指标           | 结果 |
| -------------- | ---: |
| Performance    |   99 |
| Accessibility  |   95 |
| Best Practices |  100 |
| SEO            |  100 |
| FCP            | 0.2s |
| LCP            | 0.8s |
| TBT            |  0ms |
| CLS            |    0 |
| Speed Index    | 0.9s |

分析：

Audience 页面包含 ECharts 基础画像图表、D3 中国地图热力图和 D3 关键词云。优化前，D3 全量导入会导致客户端 bundle 偏大。优化后，项目将 D3 全量导入改为子包按需导入，并将地图和关键词云模块进行动态加载。

优化效果：

1. D3 不再全量进入页面主 bundle。
2. Audience 页面首屏只加载必要模块。
3. 地图和关键词云作为较重可视化模块延迟加载。
4. TBT 为 0ms，说明 D3 模块没有造成明显主线程阻塞。
5. Performance 达到 99，说明优化效果较好。

---

## 4.4 Assistant 页面

路径：

```txt id="mkmomq"
/assistant
```

Lighthouse 结果：

| 指标           | 结果 |
| -------------- | ---: |
| Performance    |  100 |
| Accessibility  |   95 |
| Best Practices |  100 |
| SEO            |  100 |
| FCP            | 0.2s |
| LCP            | 0.7s |
| TBT            |  0ms |
| CLS            |    0 |
| Speed Index    | 0.5s |

分析：

Assistant 页面包含热点内容榜单、分类趋势、发布时间推荐、标题关键词分析和创作建议清单。其中标题关键词和建议清单使用 Framer Motion 提供交互动效。

优化后，Framer Motion 相关重型交互模块被限制在 Assistant 页面，不会影响 Dashboard、Content 和 Audience 页面。同时，Assistant 页面内部分动效组件采用动态加载，保证首屏内容不会被动画库明显拖慢。

优化效果：

1. Performance 达到 100。
2. TBT 为 0ms。
3. Framer Motion 没有明显增加首屏阻塞。
4. 页面动效和性能之间保持了较好平衡。

---

## 五、核心优化措施

## 5.1 路由级代码分割

项目使用 Next.js App Router。不同页面天然具备路由级代码分割能力。

页面路由包括：

```txt id="e3atne"
/dashboard
/content
/audience
/assistant
/settings
```

不同路由只加载当前页面所需的业务代码，避免所有模块一次性进入首屏。

---

## 5.2 图表模块动态加载

Dashboard 页面中，图表模块使用 `next/dynamic` 进行动态加载。

优化对象包括：

```txt id="jwqnnt"
DashboardTrendSection
DashboardCategorySection
DashboardPublishTrendSection
```

优化目标：

1. 让核心指标卡片优先渲染。
2. 降低 ECharts 对首屏 JS 的影响。
3. 将图表加载放到页面首屏之后。
4. 使用 skeleton 保持加载体验稳定。

---

## 5.3 Audience D3 模块懒加载

Audience 页面中，D3 地图和关键词云属于重型可视化模块。

优化对象包括：

```txt id="yz36we"
AudienceRegionSection
AudienceKeywordSection
ChinaAudienceHeatmap
AudienceKeywordCloud
```

优化方式：

1. 使用 `next/dynamic` 延迟加载区域热力图模块。
2. 使用 `next/dynamic` 延迟加载关键词云模块。
3. 图表加载前展示 skeleton。
4. 避免 D3 模块阻塞 Audience 页面基础画像首屏。

---

## 5.4 D3 子包按需导入

优化前：

```ts id="ok45vr"
import * as d3 from 'd3';
```

优化后：

```ts id="try3wf"
import { max } from 'd3-array';
import { geoMercator, geoPath } from 'd3-geo';
import { interpolateRgb } from 'd3-interpolate';
import { scaleSequential, scaleSqrt } from 'd3-scale';
```

关键词云模块中也改为只引入实际使用的 D3 子包：

```ts id="bhzw41"
import { extent } from 'd3-array';
import { scaleOrdinal, scaleSqrt } from 'd3-scale';
```

优化效果：

1. 避免完整 D3 包进入客户端 bundle。
2. 减少不必要的 D3 模块依赖。
3. 提高 bundle analyzer 中依赖结构可读性。
4. 降低 Audience 页面可视化模块体积。

---

## 5.5 Assistant 动效模块动态加载

Assistant 页面中，标题关键词分析和创作建议清单包含较多 Framer Motion 动效。

优化对象包括：

```txt id="eycwl9"
CreatorAssistantTitleKeywordSection
CreatorAssistantSuggestionSection
```

优化方式：

1. 使用动态加载拆分动效组件。
2. 保留概览、热点榜单、分类趋势和发布时间推荐的优先展示。
3. 动效模块加载期间展示 skeleton。
4. 避免 Framer Motion 对其他页面造成影响。

---

## 5.6 Content 十万级虚拟滚动优化

Content 页面使用 `react-window` 实现虚拟滚动。

优化目标：

1. 避免一次性渲染 100000 行 DOM。
2. 只渲染当前视口附近的列表项。
3. 保证滚动过程流畅。
4. 降低 DOM 节点数量和布局计算压力。

验证方式：

在浏览器控制台执行：

```js id="zu5nj7"
document.querySelectorAll('[data-content-row="true"]').length;
```

预期结果：

```txt id="bfwuol"
实际渲染行数约为十几到几十行，而不是 100000 行
```

说明：

虚拟滚动只优化 DOM 渲染，不会消除大数据本身的加载、解析、筛选和排序成本。因此 `/content` 页面 TBT 仍然高于其他页面。

---

## 5.7 React 18 并发更新优化

Content 页面接入：

```txt id="qjufyd"
useTransition
useDeferredValue
```

优化目标：

1. 筛选和排序时保留旧列表，避免页面瞬间白屏。
2. 将部分列表更新标记为非紧急更新。
3. 降低用户输入和筛选操作的阻塞感。
4. 在数据更新过程中展示轻量状态提示。

优化效果：

筛选条件变化时，页面不会立即清空旧列表，而是保留旧数据并显示“列表更新中”状态，交互体验更平滑。

---

## 5.8 大型 Mock JSON 从业务 bundle 中剥离

最初如果直接在业务代码中 import 十万级 `content-list.json`，该 JSON 会进入客户端 JS bundle，并导致开发环境 HMR payload 过大。

优化后：

```txt id="r41jia"
data/processed/content-list.json
  -> public/mock/content-list.json
  -> fetch('/mock/content-list.json')
```

优化效果：

1. 大 JSON 不再直接进入业务 JS bundle。
2. 降低客户端 chunk 体积。
3. 避免开发环境 HMR 因大 JSON 变慢。
4. 生产模式下大 JSON 作为静态资源单独加载。

---

## 5.9 图片与静态资源优化

在 `next.config.ts` 中配置图片和静态资源策略。

优化内容：

```txt id="o63voh"
1. 配置图片格式 avif / webp
2. 配置远程图片域名 i.ytimg.com 和 img.youtube.com
3. 为地图 GeoJSON 设置长期缓存
4. 为 public/mock 静态数据设置缓存
```

示例策略：

```txt id="u1df36"
/maps/:path*       public, max-age=31536000, immutable
/mock/:path*       public, max-age=3600
```

优化效果：

1. 减少重复加载地图资源。
2. 提升缩略图加载体验。
3. 降低静态 Mock 文件的重复请求成本。
4. 保持内容数据有一定缓存，同时避免长期缓存导致调试困难。

---

## 六、Bundle Analyzer 分析

项目接入 `@next/bundle-analyzer`。

运行命令：

```bash id="ycnf1g"
pnpm build:analyze
```

说明：

当前项目使用 Next.js 新版本时，Analyzer 使用 webpack 构建模式：

```bash id="ald8uc"
cross-env ANALYZE=true next build --webpack
```

分析结论：

1. ECharts 是 Dashboard 相关页面中较大的业务依赖。
2. Framer Motion 主要影响 Assistant 动效模块。
3. D3 已从全量导入优化为子包导入。
4. `content-list.json` 没有直接进入业务 JS bundle。
5. MSW 在当前生产 Mock 模式下仍会进入客户端逻辑，对 bundle 和运行时有一定影响。
6. 不同页面的重型依赖已经通过路由分割和动态加载进行隔离。

---

## 七、生产模式 MSW 的性能影响

当前项目本地生产模式仍然启用 MSW。

优点：

1. 无需真实后端即可完整演示。
2. 保证所有页面 API 请求可用。
3. 便于本地 Lighthouse 测试。
4. 方便结项展示和代码走读。

缺点：

1. MSW Service Worker 会带来额外初始化成本。
2. Mock 请求链路比直接静态数据或真实接口多一层拦截。
3. 生产 bundle 中会包含 Mock 相关逻辑。
4. 对 Lighthouse 指标可能有轻微影响。

结论：

当前保留生产模式 MSW 是为了演示完整性。真实线上部署时，建议替换为真实 API 或 Next.js Route Handlers。

---

## 八、仍存在的性能问题

## 8.1 Content 页面 TBT 偏高

当前最主要的性能问题是 `/content` 页面 TBT 偏高。

原因：

```txt id="dyj6op"
1. 页面一次性加载 100000 条内容数据。
2. 大 JSON 解析占用主线程。
3. 首次排序和筛选占用主线程。
4. MSW Mock 拦截和数据处理有额外成本。
5. 当前为了保留压力测试效果，没有使用服务端分页。
```

当前已解决的问题：

```txt id="f0uxl1"
1. DOM 不再一次性渲染 100000 行。
2. 可视区域实际 DOM 行数已大幅减少。
3. 大 JSON 已从业务 bundle 中剥离。
4. 筛选和排序更新接入 React 18 并发优化。
```

后续建议：

```txt id="g8quyg"
1. 服务端分页
2. 服务端排序
3. 服务端筛选
4. Web Worker 本地数据处理
5. IndexedDB 分块缓存
6. 拆分普通演示模式和压力测试模式
```

---

## 8.2 可视化组件测试和性能监控仍可增强

目前项目主要通过 Lighthouse 和 Bundle Analyzer 进行性能评估。

后续可以继续补充：

```txt id="y80dah"
1. Web Vitals 上报
2. Sentry Performance
3. React Profiler 分析
4. Playwright 性能回归测试
5. 大列表交互耗时埋点
6. 图表渲染耗时统计
```

---

## 九、优化前后总结

| 优化点                 | 优化前问题                   | 优化后结果                               |
| ---------------------- | ---------------------------- | ---------------------------------------- |
| Dashboard 图表动态加载 | 图表逻辑可能影响首屏         | Dashboard Performance 达到 100           |
| Audience D3 动态加载   | D3 地图和词云较重            | Audience Performance 达到 99             |
| D3 子包导入            | 全量 D3 进入 bundle          | 仅导入使用到的子模块                     |
| Assistant 动效模块拆分 | Framer Motion 可能污染主路径 | Assistant Performance 达到 100           |
| Content 虚拟滚动       | 十万行 DOM 无法接受          | 实际 DOM 行数控制在可视区域附近          |
| 大 JSON 剥离           | JSON 进入业务 bundle         | 改为 public 静态资源读取                 |
| React 18 并发更新      | 筛选排序时容易阻塞           | 保留旧列表并显示更新状态                 |
| 静态资源缓存           | 地图和 Mock 文件重复加载     | 配置缓存策略                             |
| Bundle Analyzer        | 依赖体积不可见               | 可定位 ECharts / D3 / Framer Motion 影响 |

---

## 十、最终结论

本项目完成了第七周性能优化目标。Dashboard、Audience 和 Assistant 页面在 Lighthouse 中均取得较高性能分数，说明图表、地图、词云和动画模块经过动态加载与依赖拆分后，没有明显拖慢首屏。

Content 页面保留了十万级内容管理压力测试场景，因此 Performance 为 85，低于其他页面。该结果主要受 TBT 影响，瓶颈来自十万级数据的加载、解析、筛选和排序，而不是 DOM 渲染。由于该页面承担大规模数据列表能力验证的任务，本项目选择保留该压力测试口径，并在报告中明确说明优化边界和后续改进方向。

整体来看，项目已经完成以下性能建设：

1. 首屏优化。
2. 重型依赖拆分。
3. 大列表虚拟滚动。
4. React 18 并发更新。
5. 大 JSON bundle 剥离。
6. 静态资源缓存。
7. Bundle Analyzer 分析。
8. Lighthouse 性能审计。

当前性能表现能够支撑项目结项演示和前端工程能力展示。
