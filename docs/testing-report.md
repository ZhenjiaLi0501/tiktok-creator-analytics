# 测试文档

## 一、测试目标

本项目在第七周接入单元测试和组件测试，用于提升项目质量保障能力。

测试目标主要包括：

1. 验证核心工具函数行为稳定。
2. 验证通用组件在基础场景下可以正确渲染。
3. 验证创作助手核心交互组件可以正常展示和切换状态。
4. 验证页面边缘状态组件具备基本可用性。
5. 建立测试覆盖率统计机制。
6. 保证核心组件和工具函数测试覆盖率达到 70% 以上。

本项目当前测试重点不是覆盖所有页面和所有业务逻辑，而是优先覆盖稳定的核心工具函数和高复用核心组件。

---

## 二、测试技术栈

项目使用以下测试工具：

| 工具                        | 作用           |
| --------------------------- | -------------- |
| Vitest                      | 单元测试运行器 |
| React Testing Library       | React 组件测试 |
| @testing-library/jest-dom   | DOM 断言扩展   |
| @testing-library/user-event | 用户交互模拟   |
| @vitest/coverage-v8         | 覆盖率统计     |
| jsdom                       | 浏览器环境模拟 |

---

## 三、测试相关命令

### 3.1 运行全部测试

```bash
pnpm test
```

### 3.2 监听模式运行测试

```bash
pnpm test:watch
```

### 3.3 生成测试覆盖率报告

```bash
pnpm test:coverage
```

### 3.4 查看 HTML 覆盖率报告

Windows：

```powershell
start coverage/index.html
```

macOS：

```bash
open coverage/index.html
```

---

## 四、测试配置

测试配置文件：

```txt
vitest.config.ts
```

测试环境配置文件：

```txt
src/test/setup.ts
```

### 4.1 Vitest 配置说明

项目使用 `jsdom` 作为测试环境，用于模拟浏览器 DOM。

核心配置包括：

```txt
environment: jsdom
globals: true
setupFiles: ./src/test/setup.ts
coverage provider: v8
coverage reporter: text / html / json-summary
```

### 4.2 测试环境 Mock

由于 jsdom 不完整支持所有浏览器 API，因此在 `src/test/setup.ts` 中补充了部分 mock：

```txt
matchMedia
ResizeObserver
```

这些 mock 主要用于避免组件测试时因为浏览器 API 不存在而报错。

---

## 五、覆盖率统计范围

当前覆盖率统计范围聚焦于核心工具函数和核心组件，而不是整个 `src` 目录。

原因是：

1. 当前项目包含大量页面、Mock 数据、Service、图表和可视化模块。
2. 部分页面组件依赖 ECharts、D3、MSW、Framer Motion 等复杂运行环境。
3. 第七周验收重点是核心组件和工具函数测试覆盖率，而不是全项目 100% 覆盖。
4. 将整个 `src` 都纳入覆盖率统计，会导致大量暂未测试的页面和 Mock 文件拉低统计结果，不能准确反映核心组件测试质量。

当前主要统计范围包括：

```txt
src/lib/format.ts
src/lib/utils.ts
src/components/common/empty-state.tsx
src/features/creator-assistant/components/creator-assistant-category-trend-section.tsx
src/features/creator-assistant/components/creator-assistant-publish-time-section.tsx
src/features/creator-assistant/components/creator-assistant-suggestion-section.tsx
src/features/creator-assistant/components/creator-assistant-title-keyword-section.tsx
```

覆盖率阈值：

```txt
statements: 70
branches: 60
functions: 70
lines: 70
```

---

## 六、测试文件清单

当前已补充的测试文件包括：

```txt
src/lib/format.test.ts
src/lib/utils.test.ts
src/components/common/empty-state.test.tsx
src/features/creator-assistant/components/creator-assistant-title-keyword-section.test.tsx
src/features/creator-assistant/components/creator-assistant-suggestion-section.test.tsx
src/features/creator-assistant/components/creator-assistant-publish-time-section.test.tsx
src/features/creator-assistant/components/creator-assistant-category-trend-section.test.tsx
```

---

## 七、工具函数测试

## 7.1 `format.ts`

测试文件：

```txt
src/lib/format.test.ts
```

测试目标：

验证数字格式化函数在不同输入下返回正确结果。

主要测试函数：

```txt
formatInteger
formatDecimal
formatCompactNumber
formatPercent
formatSignedPercent
```

测试场景：

| 测试函数              | 测试内容                |
| --------------------- | ----------------------- |
| `formatInteger`       | 整数千分位格式化        |
| `formatDecimal`       | 小数位数保留            |
| `formatCompactNumber` | 中文单位“万 / 亿”格式化 |
| `formatPercent`       | 百分比格式化            |
| `formatSignedPercent` | 正负百分比格式化        |

示例：

```txt
1234567 -> 1,234,567
12000 -> 1.2万
230000000 -> 2.3亿
5.2 -> +5.2%
```

---

## 7.2 `utils.ts`

测试文件：

```txt
src/lib/utils.test.ts
```

测试目标：

验证 `cn` 工具函数可以正确合并 className，并处理 Tailwind class 冲突。

测试场景：

| 场景           | 说明                                         |
| -------------- | -------------------------------------------- |
| 合并普通 class | 多个 className 可以正确拼接                  |
| 条件 class     | false 条件不会进入最终 class                 |
| Tailwind 冲突  | 后出现的 Tailwind class 覆盖前一个冲突 class |

示例：

```txt
cn('p-2', 'p-4') -> p-4
```

---

## 八、通用组件测试

## 8.1 EmptyState

测试文件：

```txt
src/components/common/empty-state.test.tsx
```

测试目标：

验证空状态组件能够正常展示标题和描述文案。

测试场景：

1. 渲染空状态标题。
2. 渲染空状态描述。
3. 页面可以通过文本查询到对应 DOM。

示例断言：

```txt
暂无内容数据
当前筛选条件下没有匹配的视频内容。
```

---

## 九、创作助手组件测试

创作助手模块是第六周核心业务模块，也是当前测试覆盖的重点模块。

---

## 9.1 标题词频分析组件测试

测试文件：

```txt
src/features/creator-assistant/components/creator-assistant-title-keyword-section.test.tsx
```

被测组件：

```txt
CreatorAssistantTitleKeywordSection
```

测试目标：

验证标题词频分析模块能够正常展示标题关键词、默认选中关键词详情，并在点击其他关键词后更新详情面板。

测试场景：

| 场景     | 说明                                             |
| -------- | ------------------------------------------------ |
| 模块渲染 | 展示“标题词频分析”“高频标题词云”“TOP 关键词明细” |
| 默认详情 | 默认展示第一条关键词的详情                       |
| 点击切换 | 点击其他关键词后，详情面板同步变化               |
| 空数据   | keywords 为空时展示“暂无标题关键词数据”          |

测试注意点：

该组件中同一句文案可能同时出现在：

```txt
关键词云
TOP 关键词明细
当前选中关键词详情
```

因此测试时对于可能重复出现的文案，需要使用：

```txt
getAllByText
findAllByText
```

而不是只使用 `getByText`。

---

## 9.2 创作建议清单组件测试

测试文件：

```txt
src/features/creator-assistant/components/creator-assistant-suggestion-section.test.tsx
```

被测组件：

```txt
CreatorAssistantSuggestionSection
```

测试目标：

验证创作建议清单可以正确展示建议卡片，并支持点击切换右侧建议详情。

测试场景：

| 场景     | 说明                           |
| -------- | ------------------------------ |
| 模块渲染 | 展示“创作建议清单”             |
| 建议卡片 | 展示多个建议标题               |
| 默认详情 | 默认展示第一条建议详情         |
| 点击切换 | 点击第二条建议后，右侧详情更新 |

测试注意点：

由于默认选中第一条建议，同一个建议标题可能同时出现在左侧卡片和右侧详情中。因此测试时使用：

```txt
getAllByText
```

避免 `MultipleElementsFoundError`。

---

## 9.3 发布时间推荐组件测试

测试文件：

```txt
src/features/creator-assistant/components/creator-assistant-publish-time-section.test.tsx
```

被测组件：

```txt
CreatorAssistantPublishTimeSection
```

测试目标：

验证发布时间推荐模块可以正确展示推荐时段、推荐分、竞争程度和预计播放提升等信息。

测试场景：

| 场景     | 说明                                   |
| -------- | -------------------------------------- |
| 模块渲染 | 展示“发布时间推荐”                     |
| 时段展示 | 展示“周五 20:00”“周六 21:00”等推荐时段 |
| 推荐分   | 展示推荐分数                           |
| 竞争程度 | 展示“竞争适中”“竞争较低”等状态         |
| 预计提升 | 展示预计播放提升百分比                 |

测试注意点：

多个推荐卡片中都会出现“推荐分”文案，因此断言时使用：

```txt
getAllByText('推荐分')
```

---

## 9.4 分类趋势组件测试

测试文件：

```txt
src/features/creator-assistant/components/creator-assistant-category-trend-section.test.tsx
```

被测组件：

```txt
CreatorAssistantCategoryTrendSection
```

测试目标：

验证分类趋势模块可以正确展示分类名称、趋势状态、趋势分和运营建议。

测试场景：

| 场景     | 说明                           |
| -------- | ------------------------------ |
| 模块渲染 | 展示“分类趋势分析”             |
| 分类展示 | 展示“娱乐”“生活”等分类         |
| 趋势状态 | 展示“快速上升”“稳定表现”等状态 |
| 运营建议 | 展示对应分类的运营建议         |
| 趋势分   | 展示分类趋势分                 |

---

## 十、测试过程中遇到的问题

## 10.1 `getByText` 匹配到多个元素

问题表现：

部分测试报错：

```txt
MultipleElementsFoundError
```

原因：

组件中同一句文案可能同时存在于多个位置，例如：

```txt
卡片标题
摘要内容
详情面板
```

解决方式：

将 `getByText` 调整为：

```txt
getAllByText
findAllByText
```

对于只需要判断文案存在的场景，使用：

```ts
expect(screen.getAllByText('xxx').length).toBeGreaterThan(0);
```

---

## 10.2 Framer Motion 组件状态切换存在异步更新

问题表现：

点击卡片后立即使用 `getByText` 查询新内容，偶尔无法找到。

原因：

部分组件使用 Framer Motion 的 `AnimatePresence` 和 `motion.div`，点击后 DOM 更新可能不是完全同步完成。

解决方式：

对点击后的断言使用：

```txt
findByText
waitFor
```

例如：

```ts
expect(await screen.findByText('建议将重点内容安排在晚间高活跃时间段发布。')).toBeInTheDocument();
```

---

## 10.3 覆盖率统计范围过大

问题表现：

首次运行覆盖率时，整体覆盖率很低。

原因：

最初覆盖率统计范围包括整个 `src` 目录，导致大量页面、service、mock、图表组件和复杂业务文件都被统计为未覆盖。

解决方式：

将覆盖率统计范围调整为核心组件和工具函数，符合第七周“核心组件测试覆盖率”的验收目标。

---

## 十一、当前测试结果记录

当前测试命令：

```bash
pnpm test
```

预期结果：

```txt
所有测试用例通过
```

当前覆盖率命令：

```bash
pnpm test:coverage
```

预期结果：

```txt
核心组件和工具函数覆盖率达到配置阈值
```

覆盖率阈值：

| 指标       | 阈值 |
| ---------- | ---: |
| statements |  70% |
| branches   |  60% |
| functions  |  70% |
| lines      |  70% |

实际覆盖率结果以本地 `pnpm test:coverage` 输出为准。

---

## 十二、后续测试扩展方向

后续可以继续扩展以下测试：

### 12.1 Content 模块测试

可补充：

```txt
ContentVirtualList
ContentDetailDrawer
ContentListSkeleton
批量操作逻辑
筛选和排序状态更新
```

### 12.2 Dashboard 模块测试

可补充：

```txt
DashboardOverviewSection
DashboardPageContent
图表数据格式化逻辑
时间范围切换逻辑
```

### 12.3 Audience 模块测试

可补充：

```txt
AudienceOverviewSection
AudienceDemographicsSection
AudienceRegionSection
AudienceKeywordSection
```

D3 地图和关键词云测试需要额外处理 SVG 和 D3 相关逻辑，可以优先测试数据映射和交互状态，而不是完整测试图形渲染。

### 12.4 Service 层测试

可补充：

```txt
request 封装
API 错误处理
query 参数拼接
业务 code 异常处理
```

### 12.5 E2E 测试

后续可以引入 Playwright，覆盖完整用户流程：

```txt
/dashboard 时间筛选
/content 搜索筛选和批量操作
/audience 区域下钻
/assistant 建议切换
```

---

## 十三、总结

本项目已完成基础测试体系建设，接入了 Vitest、Testing Library 和覆盖率统计工具，并为核心工具函数、通用组件和创作助手核心交互组件补充了测试用例。

当前测试重点是保证核心组件和工具函数的稳定性，覆盖项目中最容易复用、最有代表性的逻辑。虽然尚未覆盖所有页面和复杂可视化组件，但已经建立了可持续扩展的测试结构。后续可以继续围绕 Content、Dashboard、Audience 和 Service 层逐步补充测试，进一步提升项目质量保障能力。
