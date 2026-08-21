# 部署说明文档

## 一、部署目标

本项目是一个基于 **Next.js + React + TypeScript** 的前端中后台项目，当前没有接入真实后端服务，接口数据由 **MSW Mock API** 提供。

本文档说明以下几种运行和部署方式：

```txt
1. 本地开发环境运行
2. 本地生产模式运行
3. Vercel 线上部署
4. 部署前检查项
5. 常见问题排查
```

当前项目主要用于：

```txt
项目结项展示
本地演示
Lighthouse 性能测试
前端工程能力展示
Mock API 联调
```

---

## 二、环境要求

推荐环境：

| 环境     | 版本说明          |
| -------- | ----------------- |
| Node.js  | 建议使用 LTS 版本 |
| 包管理器 | pnpm              |
| 浏览器   | Chrome / Edge     |
| Git      | 用于代码版本管理  |
| 部署平台 | Vercel            |

确认环境：

```bash
node -v
pnpm -v
git --version
```

---

## 三、本地开发环境运行

### 3.1 安装依赖

在项目根目录执行：

```bash
pnpm install
```

---

### 3.2 生成 Mock 数据

首次运行项目前，建议依次执行数据生成命令：

```bash
pnpm data:build
pnpm data:content
pnpm data:audience
pnpm data:assistant
```

对应说明：

| 命令                  | 作用                   |
| --------------------- | ---------------------- |
| `pnpm data:build`     | 生成 Dashboard 数据    |
| `pnpm data:content`   | 生成十万级内容管理数据 |
| `pnpm data:audience`  | 生成中国区观众画像数据 |
| `pnpm data:assistant` | 生成创作助手分析数据   |

生成后的数据主要位于：

```txt
data/processed/
```

内容管理大数据文件还需要保证存在于：

```txt
public/mock/content-list.json
```

该文件用于避免十万级 JSON 被直接打入业务 JS bundle。

---

### 3.3 启动开发服务

```bash
pnpm dev
```

访问：

```txt
http://localhost:3000
```

项目默认会跳转到：

```txt
/dashboard
```

---

## 四、本地生产模式运行

本地生产模式用于模拟真实构建结果，也用于 Lighthouse 测试和结项演示。

### 4.1 配置环境变量

在项目根目录创建 `.env.local`：

```env
NEXT_PUBLIC_API_MOCKING=enabled
```

说明：

当前项目没有真实后端接口，因此生产模式下仍然需要 MSW 拦截 `/api/*` 请求。
`NEXT_PUBLIC_API_MOCKING=enabled` 用于显式开启生产模式下的 Mock API。

---

### 4.2 确认 MSW Service Worker 文件

确认以下文件存在：

```txt
public/mockServiceWorker.js
```

如果不存在，执行：

```bash
pnpm exec msw init public/ --save
```

---

### 4.3 构建项目

```bash
pnpm build
```

构建成功后，Next.js 会生成生产构建产物。

---

### 4.4 启动生产服务

```bash
pnpm start
```

访问：

```txt
http://localhost:3000
```

建议依次检查以下页面：

```txt
/dashboard
/content
/audience
/assistant
/settings
```

---

## 五、Vercel 部署流程

### 5.1 推送代码到 GitHub

部署前确认本地代码已经提交并推送：

```bash
git status
git add .
git commit -m "chore(project): prepare final deployment"
git push
```

如果没有新的改动，只需要执行：

```bash
git status
git push
```

---

### 5.2 在 Vercel 导入项目

操作流程：

```txt
1. 登录 Vercel
2. 选择 Add New Project
3. 选择当前 GitHub 仓库
4. 导入项目
5. 确认 Framework Preset 为 Next.js
6. 配置环境变量
7. 点击 Deploy
```

---

### 5.3 Vercel 环境变量配置

需要配置：

```env
NEXT_PUBLIC_API_MOCKING=enabled
```

说明：

因为当前项目线上演示仍然依赖 MSW Mock API，所以 Vercel 部署时也需要该环境变量。

如果后续接入真实后端，则可以移除该环境变量，并将请求地址切换到真实 API。

---

### 5.4 Vercel 构建命令

默认可以使用：

```bash
pnpm build
```

如果 Vercel 自动识别失败，可以手动配置：

| 配置项           | 值             |
| ---------------- | -------------- |
| Install Command  | `pnpm install` |
| Build Command    | `pnpm build`   |
| Output Directory | `.next`        |
| Framework        | Next.js        |

---

## 六、部署前检查清单

部署前建议完整检查以下内容。

### 6.1 必要文件检查

项目根目录应包含：

```txt
README.md
package.json
pnpm-lock.yaml
next.config.ts
tsconfig.json
vitest.config.ts
eslint.config.mjs
tailwind.config.js
postcss.config.js
components.json
```

源码目录应包含：

```txt
src/app
src/components
src/features
src/lib
src/mocks
src/services
src/test
src/types
```

文档目录应包含：

```txt
docs/api-reference.md
docs/architecture.md
docs/deployment-guide.md
docs/testing-report.md
docs/performance-report.md
docs/final-report.md
docs/demo-script.md
docs/reports/
```

静态资源应包含：

```txt
public/mockServiceWorker.js
public/maps/china.geo.json
public/mock/content-list.json
```

处理后数据应包含：

```txt
data/processed/dashboard-*.json
data/processed/content-*.json
data/processed/audience-*.json
data/processed/assistant-*.json
```

---

### 6.2 不应该提交的文件

以下内容不应该提交到 GitHub：

```txt
node_modules/
.next/
coverage/
.env.local
.env.*.local
tsconfig.tsbuildinfo
*.log
data/raw/
```

确认 `.gitignore` 中包含：

```gitignore
node_modules/
.next/
coverage/
.env.local
.env.*.local
tsconfig.tsbuildinfo
*.log

data/raw/
```

---

### 6.3 代码质量检查

部署前执行：

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

推荐全部通过后再部署。

---

## 七、功能验收检查

部署完成后，建议按照以下顺序检查页面。

### 7.1 Dashboard 页面

路径：

```txt
/dashboard
```

检查项：

```txt
核心指标卡片是否正常展示
播放 / 点赞 / 评论趋势图是否正常展示
内容分类占比图是否正常展示
发布趋势图是否正常展示
时间范围切换是否正常
图表 tooltip 是否正常
页面响应式布局是否正常
```

---

### 7.2 Content 页面

路径：

```txt
/content
```

检查项：

```txt
十万级内容列表是否正常加载
虚拟滚动是否正常
搜索是否正常
分类筛选是否正常
状态筛选是否正常
排序是否正常
批量选择是否正常
批量发布 / 下架 / 删除是否正常
详情抽屉是否正常打开
骨架屏和空状态是否正常
```

---

### 7.3 Audience 页面

路径：

```txt
/audience
```

检查项：

```txt
画像概览是否正常展示
性别 / 年龄 / 终端图表是否正常
中国地图是否正常渲染
区域 hover tooltip 是否正常
省份 / 城市下钻是否正常
关键词云是否正常
深色模式下图表是否可读
```

---

### 7.4 Assistant 页面

路径：

```txt
/assistant
```

检查项：

```txt
热点内容榜单是否正常
分类趋势是否正常
发布时间推荐是否正常
标题关键词分析是否正常
点击关键词后详情是否更新
创作建议清单是否正常
点击建议后详情是否更新
Framer Motion 动效是否自然
空状态和错误状态是否正常
```

---

## 八、Lighthouse 测试建议

部署完成后，可以使用 Chrome Lighthouse 对以下页面进行测试：

```txt
/dashboard
/content
/audience
/assistant
```

建议测试模式：

```txt
Chrome DevTools
  -> Lighthouse
  -> Navigation
  -> Desktop
  -> Performance / Accessibility / Best Practices / SEO
```

当前本地生产模式测试结果摘要：

| 页面         | Performance | Accessibility | Best Practices | SEO |
| ------------ | ----------: | ------------: | -------------: | --: |
| `/dashboard` |         100 |            95 |            100 | 100 |
| `/content`   |          85 |            92 |            100 | 100 |
| `/audience`  |          99 |            95 |            100 | 100 |
| `/assistant` |         100 |            95 |            100 | 100 |

说明：

`/content` 页面保留十万级数据压力测试场景，因此 TBT 高于其他页面。该页面主要瓶颈来自大 JSON 加载、解析、筛选和排序，而不是 DOM 渲染。

---

## 九、Bundle Analyzer

项目已接入 Bundle Analyzer。

运行：

```bash
pnpm build:analyze
```

用于检查：

```txt
ECharts 是否只影响相关页面
D3 是否已按需拆分
Framer Motion 是否主要限制在 Assistant 页面
content-list.json 是否没有进入业务 JS bundle
MSW 对客户端 bundle 的影响
```

说明：

当前项目使用 Analyzer 时采用 webpack 构建模式：

```bash
cross-env ANALYZE=true next build --webpack
```

---

## 十、生产模式 MSW 说明

当前项目生产模式仍然启用 MSW，主要原因是：

```txt
1. 项目没有真实后端服务
2. 需要保证线上演示时 API 可用
3. 需要完整展示 Dashboard / Content / Audience / Assistant 全流程
4. 便于结项答辩和代码走读
```

需要注意：

```txt
1. MSW 会增加一定客户端初始化成本
2. Mock 请求链路不是最终真实生产架构
3. 真实上线时应替换为真实后端 API 或 Next.js Route Handlers
4. Vercel 部署时必须配置 NEXT_PUBLIC_API_MOCKING=enabled
```

---

## 十一、常见问题排查

### 11.1 页面一直显示加载中

可能原因：

```txt
MSW 没有启动
NEXT_PUBLIC_API_MOCKING 没有配置
public/mockServiceWorker.js 不存在
接口路径和 handler 不匹配
```

解决方式：

```bash
pnpm exec msw init public/ --save
```

确认 `.env.local`：

```env
NEXT_PUBLIC_API_MOCKING=enabled
```

重新构建：

```bash
pnpm build
pnpm start
```

---

### 11.2 生产模式接口 404

可能原因：

```txt
MSW 没有在生产模式启用
环境变量没有在 build 前配置
Vercel 没有配置环境变量
mockServiceWorker.js 缺失
```

解决方式：

```txt
1. 检查 .env.local
2. 检查 Vercel Environment Variables
3. 检查 public/mockServiceWorker.js
4. 重新 pnpm build
```

---

### 11.3 Content 页面加载慢

原因：

```txt
Content 页面一次性读取十万级 Mock 数据
大 JSON 加载和解析会占用主线程
筛选和排序会触发大量数据计算
```

当前已优化：

```txt
react-window 虚拟滚动
大 JSON 从 bundle 中剥离
useTransition
useDeferredValue
列表行 memo
```

后续可优化：

```txt
服务端分页
服务端排序
Web Worker
IndexedDB 分块缓存
普通模式和压力测试模式拆分
```

---

### 11.4 中国地图不显示

检查文件：

```txt
public/maps/china.geo.json
```

检查内容：

```txt
必须是合法 GeoJSON FeatureCollection
features 不能为空
省份名称需要和 audience region 数据可以匹配
```

---

### 11.5 缩略图不显示

检查 `next.config.ts` 中是否配置远程图片域名：

```txt
i.ytimg.com
img.youtube.com
```

如果远程图片加载失败，页面应展示默认占位图，不能影响内容详情展示。

---

## 十二、部署后的维护建议

后续如果项目继续迭代，建议按以下方向调整：

```txt
1. 将 MSW 替换为真实后端 API
2. 将 public/mock/content-list.json 改为后端分页接口
3. 接入 Sentry 或其他错误监控
4. 接入 Web Vitals 上报
5. 增加 Playwright E2E 测试
6. 使用 CI 在 push 时自动运行 lint / type-check / test / build
7. 对生产环境开启真实缓存和 CDN 策略
```

---

## 十三、总结

当前项目可以通过以下方式完成本地生产演示：

```bash
pnpm install
pnpm data:build
pnpm data:content
pnpm data:audience
pnpm data:assistant
pnpm build
pnpm start
```

访问：

```txt
http://localhost:3000
```

部署到 Vercel 时，需要重点确认：

```txt
1. GitHub 代码已经推送
2. Vercel 已配置 NEXT_PUBLIC_API_MOCKING=enabled
3. public/mockServiceWorker.js 存在
4. public/mock/content-list.json 存在
5. public/maps/china.geo.json 存在
6. pnpm build 可以成功
```

本项目当前部署方式适合结项展示和前端 Mock 演示。真实生产环境中，建议将 Mock API 替换为真实后端服务，并将十万级内容数据改为分页、筛选和排序接口。
