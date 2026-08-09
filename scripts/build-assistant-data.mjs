import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const processedDir = path.join(rootDir, 'data', 'processed');
const contentListPath = path.join(processedDir, 'content-list.json');

const outputFiles = {
  overview: 'assistant-overview.json',
  hotContents: 'assistant-hot-contents.json',
  categoryTrends: 'assistant-category-trends.json',
  publishTimes: 'assistant-publish-times.json',
  titleKeywords: 'assistant-title-keywords.json',
  suggestions: 'assistant-suggestions.json',
};

const weekdayTextMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const stopWords = new Set([
  'the',
  'and',
  'for',
  'with',
  'you',
  'your',
  'this',
  'that',
  'from',
  'are',
  'was',
  'were',
  'have',
  'has',
  'how',
  'why',
  'what',
  'when',
  'where',
  'who',
  'official',
  'video',
  'youtube',
]);

const chineseKeywordSeeds = [
  { word: '热点', count: 186, type: 'structure' },
  { word: '挑战', count: 172, type: 'interest' },
  { word: '探店', count: 164, type: 'interest' },
  { word: '攻略', count: 152, type: 'structure' },
  { word: '合集', count: 148, type: 'structure' },
  { word: '开箱', count: 139, type: 'interest' },
  { word: '反转', count: 133, type: 'structure' },
  { word: '教程', count: 128, type: 'category' },
  { word: '测评', count: 121, type: 'interest' },
  { word: '城市', count: 118, type: 'interest' },
  { word: '生活', count: 115, type: 'category' },
  { word: '音乐', count: 108, type: 'category' },
  { word: '美食', count: 104, type: 'interest' },
  { word: '穿搭', count: 98, type: 'interest' },
  { word: '剧情', count: 92, type: 'interest' },
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
  }
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(fileName, data) {
  const filePath = path.join(processedDir, fileName);

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function sumBy(list, key) {
  return list.reduce((total, item) => total + item[key], 0);
}

function toSafeNumber(value) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function getChinaPublishTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      weekday: 0,
      hour: 20,
    };
  }

  const chinaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  return {
    weekday: chinaDate.getUTCDay(),
    hour: chinaDate.getUTCHours(),
  };
}

function getPublishTimeLabel(weekday, hour) {
  return `${weekdayTextMap[weekday]} ${String(hour).padStart(2, '0')}:00`;
}

function getCompetitionLevel(videoCount) {
  if (videoCount >= 800) {
    return 'high';
  }

  if (videoCount >= 360) {
    return 'medium';
  }

  return 'low';
}

function getCompetitionText(level) {
  const textMap = {
    high: '竞争较高',
    medium: '竞争适中',
    low: '竞争较低',
  };

  return textMap[level] ?? '竞争适中';
}

function getMaxStats(contentList) {
  return {
    playCount: Math.max(...contentList.map((item) => toSafeNumber(item.playCount)), 1),
    likeCount: Math.max(...contentList.map((item) => toSafeNumber(item.likeCount)), 1),
    commentCount: Math.max(...contentList.map((item) => toSafeNumber(item.commentCount)), 1),
    engagementRate: Math.max(...contentList.map((item) => toSafeNumber(item.engagementRate)), 1),
  };
}

function calculateHotScore(item, maxStats) {
  const playScore = (toSafeNumber(item.playCount) / maxStats.playCount) * 45;
  const likeScore = (toSafeNumber(item.likeCount) / maxStats.likeCount) * 22;
  const commentScore = (toSafeNumber(item.commentCount) / maxStats.commentCount) * 18;
  const engagementScore = (toSafeNumber(item.engagementRate) / maxStats.engagementRate) * 15;

  return Number(Math.min(100, playScore + likeScore + commentScore + engagementScore).toFixed(1));
}

function buildHotContents(contentList) {
  const maxStats = getMaxStats(contentList);

  return [...contentList]
    .map((item) => {
      const { weekday, hour } = getChinaPublishTime(item.publishTime);
      const hotScore = calculateHotScore(item, maxStats);

      return {
        id: item.id,
        title: item.title,
        creatorName: item.creatorName,
        category: item.category,
        publishTime: item.publishTime,
        publishSlot: getPublishTimeLabel(weekday, hour),
        playCount: item.playCount,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
        shareCount: item.shareCount,
        engagementRate: item.engagementRate,
        hotScore,
        reasonTags: [
          hotScore >= 80 ? '高热内容' : '稳定表现',
          item.engagementRate >= 5 ? '互动突出' : '播放表现突出',
          `${item.category}类内容`,
        ],
      };
    })
    .sort((a, b) => b.hotScore - a.hotScore)
    .slice(0, 30)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

function buildCategoryTrends(contentList) {
  const categoryMap = new Map();

  contentList.forEach((item) => {
    const current = categoryMap.get(item.category) ?? {
      category: item.category,
      videoCount: 0,
      playCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      engagementRateTotal: 0,
    };

    current.videoCount += 1;
    current.playCount += item.playCount;
    current.likeCount += item.likeCount;
    current.commentCount += item.commentCount;
    current.shareCount += item.shareCount;
    current.engagementRateTotal += item.engagementRate;

    categoryMap.set(item.category, current);
  });

  const categories = Array.from(categoryMap.values());

  const maxPlayCount = Math.max(...categories.map((item) => item.playCount), 1);
  const maxVideoCount = Math.max(...categories.map((item) => item.videoCount), 1);

  return categories
    .map((item) => {
      const avgEngagementRate =
        item.videoCount > 0 ? Number((item.engagementRateTotal / item.videoCount).toFixed(2)) : 0;

      const trendScore = Number(
        (
          (item.playCount / maxPlayCount) * 50 +
          (item.videoCount / maxVideoCount) * 25 +
          avgEngagementRate * 5
        ).toFixed(1),
      );

      return {
        category: item.category,
        videoCount: item.videoCount,
        playCount: item.playCount,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
        shareCount: item.shareCount,
        avgEngagementRate,
        trendScore,
        trendStatus: trendScore >= 80 ? 'rising' : trendScore >= 55 ? 'stable' : 'potential',
        suggestion:
          trendScore >= 80
            ? '建议增加内容供给，优先扶持该分类创作者。'
            : trendScore >= 55
              ? '建议保持稳定更新，观察互动率变化。'
              : '建议用热点选题或达人联动提升曝光。',
      };
    })
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 10);
}

function buildPublishTimes(contentList) {
  const slotMap = new Map();

  contentList.forEach((item) => {
    const { weekday, hour } = getChinaPublishTime(item.publishTime);
    const key = `${weekday}-${hour}`;

    const current = slotMap.get(key) ?? {
      id: key,
      weekday,
      hour,
      label: getPublishTimeLabel(weekday, hour),
      videoCount: 0,
      playCount: 0,
      engagementRateTotal: 0,
    };

    current.videoCount += 1;
    current.playCount += item.playCount;
    current.engagementRateTotal += item.engagementRate;

    slotMap.set(key, current);
  });

  const slots = Array.from(slotMap.values()).map((item) => ({
    ...item,
    avgPlayCount: Math.round(item.playCount / item.videoCount),
    avgEngagementRate: Number((item.engagementRateTotal / item.videoCount).toFixed(2)),
  }));

  const maxAvgPlayCount = Math.max(...slots.map((item) => item.avgPlayCount), 1);
  const maxVideoCount = Math.max(...slots.map((item) => item.videoCount), 1);

  return slots
    .map((item) => {
      const competitionLevel = getCompetitionLevel(item.videoCount);
      const score = Number(
        (
          (item.avgPlayCount / maxAvgPlayCount) * 55 +
          item.avgEngagementRate * 4 +
          (1 - item.videoCount / maxVideoCount) * 15
        ).toFixed(1),
      );

      return {
        id: item.id,
        weekday: item.weekday,
        weekdayText: weekdayTextMap[item.weekday],
        hour: item.hour,
        label: item.label,
        score,
        avgPlayCount: item.avgPlayCount,
        avgEngagementRate: item.avgEngagementRate,
        sampleCount: item.videoCount,
        competitionLevel,
        competitionText: getCompetitionText(competitionLevel),
        expectedPlayLift: Number(Math.max(3, score / 6).toFixed(1)),
        reason: `该时段历史平均播放表现较好，${getCompetitionText(competitionLevel)}，适合安排重点内容发布。`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

function tokenizeTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/[#|:,.!?()[\]'"“”‘’\-_/\\]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3)
    .filter((word) => !stopWords.has(word))
    .filter((word) => !/^\d+$/.test(word));
}

function buildTitleKeywords(contentList) {
  const keywordMap = new Map();

  contentList.slice(0, 12000).forEach((item) => {
    tokenizeTitle(item.title).forEach((word) => {
      const current = keywordMap.get(word) ?? {
        word,
        count: 0,
        totalPlayCount: 0,
      };

      current.count += 1;
      current.totalPlayCount += item.playCount;

      keywordMap.set(word, current);
    });
  });

  const englishKeywords = Array.from(keywordMap.values())
    .filter((item) => item.count >= 8)
    .map((item) => ({
      word: item.word,
      count: item.count,
      avgPlayCount: Math.round(item.totalPlayCount / item.count),
      score: Math.round(item.count * 0.65 + item.totalPlayCount / 10000000),
      type: 'hot_word',
      suggestion: '可用于标题关键词或话题标签，建议结合中文表达本地化改写。',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  const chineseKeywords = chineseKeywordSeeds.map((item) => ({
    word: item.word,
    count: item.count,
    avgPlayCount: item.count * 120000,
    score: Math.round(item.count * 0.8),
    type: item.type,
    suggestion:
      item.type === 'structure'
        ? '适合用于标题结构，提高点击预期。'
        : item.type === 'category'
          ? '适合结合垂类内容，强化内容定位。'
          : '适合结合兴趣内容，提升用户触达。',
  }));

  return [...chineseKeywords, ...englishKeywords].sort((a, b) => b.score - a.score).slice(0, 40);
}

function buildSuggestions(hotContents, categoryTrends, publishTimes, titleKeywords) {
  const topCategory = categoryTrends[0];
  const secondCategory = categoryTrends[1];
  const bestPublishTime = publishTimes[0];
  const secondPublishTime = publishTimes[1];
  const topKeyword = titleKeywords[0];

  return [
    {
      id: 'suggestion_hot_category',
      title: `加大「${topCategory.category}」内容供给`,
      type: 'category',
      priority: 'high',
      reason: `${topCategory.category}类内容当前趋势分最高，播放量和互动表现都较突出。`,
      action: '建议优先选择该分类中的高互动选题，扶持同类创作者持续发布。',
    },
    {
      id: 'suggestion_publish_time',
      title: `优先选择 ${bestPublishTime.label} 发布`,
      type: 'publish_time',
      priority: 'high',
      reason: `该时段历史平均播放量较高，预计播放提升 ${bestPublishTime.expectedPlayLift}%。`,
      action: '建议将重点内容安排在该时段前 30 分钟完成审核与排期。',
    },
    {
      id: 'suggestion_title_keyword',
      title: `标题中加入「${topKeyword.word}」相关表达`,
      type: 'title',
      priority: 'medium',
      reason: `该词在历史高表现内容中出现频率较高，具备一定点击吸引力。`,
      action: '建议结合内容真实主题使用，不要堆砌关键词。',
    },
    {
      id: 'suggestion_category_combo',
      title: `尝试「${topCategory.category} + ${secondCategory.category}」组合选题`,
      type: 'topic',
      priority: 'medium',
      reason: '两个分类均处于较高趋势区间，适合做跨垂类内容实验。',
      action: '建议先小流量测试标题和封面，再根据互动率扩大推荐。',
    },
    {
      id: 'suggestion_second_time',
      title: `备用发布时间：${secondPublishTime.label}`,
      type: 'publish_time',
      priority: 'low',
      reason: `该时段样本竞争度为${secondPublishTime.competitionText}，适合作为非头部内容发布时间。`,
      action: '适合安排长尾内容或稳定更新内容。',
    },
    {
      id: 'suggestion_hot_content',
      title: `参考 TOP 内容《${hotContents[0].title.slice(0, 18)}...》`,
      type: 'hot_content',
      priority: 'high',
      reason: '该内容在播放量、互动率和评论表现上综合排名靠前。',
      action: '建议拆解其标题结构、内容节奏和分类标签，但避免直接复刻。',
    },
  ];
}

function buildOverview(hotContents, categoryTrends, publishTimes, titleKeywords, suggestions) {
  return {
    hotContentCount: hotContents.length,
    categoryTrendCount: categoryTrends.length,
    recommendedSlotCount: publishTimes.length,
    titleKeywordCount: titleKeywords.length,
    suggestionCount: suggestions.length,
    topCategory: categoryTrends[0]?.category ?? '-',
    bestPublishTime: publishTimes[0]?.label ?? '-',
    topKeyword: titleKeywords[0]?.word ?? '-',
    generatedAt: new Date().toISOString(),
  };
}

function main() {
  ensureDir(processedDir);

  const contentList = readJson(contentListPath);

  const hotContents = buildHotContents(contentList);
  const categoryTrends = buildCategoryTrends(contentList);
  const publishTimes = buildPublishTimes(contentList);
  const titleKeywords = buildTitleKeywords(contentList);
  const suggestions = buildSuggestions(hotContents, categoryTrends, publishTimes, titleKeywords);
  const overview = buildOverview(
    hotContents,
    categoryTrends,
    publishTimes,
    titleKeywords,
    suggestions,
  );

  writeJson(outputFiles.overview, overview);
  writeJson(outputFiles.hotContents, hotContents);
  writeJson(outputFiles.categoryTrends, categoryTrends);
  writeJson(outputFiles.publishTimes, publishTimes);
  writeJson(outputFiles.titleKeywords, titleKeywords);
  writeJson(outputFiles.suggestions, suggestions);

  console.log('Creator assistant data generated successfully.');
  console.log(`Source content rows: ${contentList.length}`);
  console.log(`Hot contents: ${hotContents.length}`);
  console.log(`Category trends: ${categoryTrends.length}`);
  console.log(`Publish time recommendations: ${publishTimes.length}`);
  console.log(`Title keywords: ${titleKeywords.length}`);
  console.log(`Suggestions: ${suggestions.length}`);
  console.log(`Output directory: ${processedDir}`);
}

main();
