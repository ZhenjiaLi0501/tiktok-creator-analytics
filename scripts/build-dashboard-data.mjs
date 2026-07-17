import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawDir = path.join(rootDir, 'data', 'raw');
const processedDir = path.join(rootDir, 'data', 'processed');

const csvFilePath = path.join(rawDir, 'USvideos.csv');
const categoryFilePath = path.join(rawDir, 'US_category_id.json');

const dateRangeConfig = {
  today: 1,
  '7d': 7,
  '30d': 30,
  custom: 14,
};

const categoryNameMap = {
  'Film & Animation': '影视动漫',
  'Autos & Vehicles': '汽车',
  Music: '音乐',
  'Pets & Animals': '萌宠',
  Sports: '体育',
  'Travel & Events': '旅行',
  Gaming: '游戏',
  'People & Blogs': '生活',
  Comedy: '喜剧',
  Entertainment: '娱乐',
  'News & Politics': '新闻',
  'Howto & Style': '教程时尚',
  Education: '教育',
  'Science & Technology': '科技',
  'Nonprofits & Activism': '公益',
};

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
  }
}

function toNumber(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 0;
  }

  return numberValue;
}

function parseTrendingDate(value) {
  const [year, day, month] = String(value).split('.');

  if (!year || !month || !day) {
    return null;
  }

  return `20${year.padStart(2, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parsePublishDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}
function parsePublishHour(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getUTCHours();
}

function createCategoryMap() {
  const categoryJson = JSON.parse(fs.readFileSync(categoryFilePath, 'utf-8'));
  const categoryMap = new Map();

  categoryJson.items.forEach((item) => {
    const rawTitle = item?.snippet?.title ?? '其他';
    const zhTitle = categoryNameMap[rawTitle] ?? rawTitle;

    categoryMap.set(String(item.id), zhTitle);
  });

  return categoryMap;
}

function readCsvRecords() {
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

  return parse(csvContent, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });
}

function normalizeRows(records, categoryMap) {
  return records
    .map((record) => {
      const videoId = String(record.video_id ?? '').trim();
      const channelTitle = String(record.channel_title ?? '').trim();
      const categoryId = String(record.category_id ?? '').trim();
      const trendingDate = parseTrendingDate(record.trending_date);
      const publishDate = parsePublishDate(record.publish_time);
      const publishHour = parsePublishHour(record.publish_time);

      const views = toNumber(record.views);
      const likes = toNumber(record.likes);
      const commentCount = toNumber(record.comment_count);

      if (
        !videoId ||
        !channelTitle ||
        !trendingDate ||
        !publishDate ||
        publishHour === null ||
        views <= 0
      ) {
        return null;
      }

      return {
        videoId,
        title: String(record.title ?? '').trim(),
        channelTitle,
        categoryId,
        category: categoryMap.get(categoryId) ?? '其他',
        trendingDate,
        publishDate,
        publishHour,
        views,
        likes,
        commentCount,
        shareCount: Math.round((likes + commentCount) * 0.15),
      };
    })
    .filter(Boolean);
}

function dedupeByVideo(rows) {
  const videoMap = new Map();

  rows.forEach((row) => {
    const current = videoMap.get(row.videoId);

    if (!current || row.views >= current.views) {
      videoMap.set(row.videoId, row);
    }
  });

  return Array.from(videoMap.values());
}

function sumBy(rows, key) {
  return rows.reduce((total, row) => total + row[key], 0);
}

function getSortedDates(rows) {
  return Array.from(new Set(rows.map((row) => row.trendingDate))).sort();
}
function getDensestDate(rows, allDates) {
  const dateCountMap = new Map();

  rows.forEach((row) => {
    const currentCount = dateCountMap.get(row.trendingDate) ?? 0;

    dateCountMap.set(row.trendingDate, currentCount + 1);
  });

  const maxWindowSize = Math.max(...Object.values(dateRangeConfig));

  let selectedDate = '';
  let selectedCount = 0;

  allDates.forEach((date, index) => {
    const count = dateCountMap.get(date) ?? 0;
    const hasEnoughHistory = index >= maxWindowSize - 1;

    if (!hasEnoughHistory) {
      return;
    }

    if (count > selectedCount || (count === selectedCount && date > selectedDate)) {
      selectedDate = date;
      selectedCount = count;
    }
  });

  if (!selectedDate) {
    const fallbackDate = allDates.at(-1);

    if (!fallbackDate) {
      throw new Error('Cannot find demo today date from dataset.');
    }

    return fallbackDate;
  }

  return selectedDate;
}

function getRangeDatesByBaseDate(allDates, rangeKey, baseDate) {
  const size = dateRangeConfig[rangeKey];
  const baseIndex = allDates.indexOf(baseDate);

  if (baseIndex === -1) {
    return allDates.slice(Math.max(0, allDates.length - size));
  }

  const startIndex = Math.max(0, baseIndex - size + 1);

  return allDates.slice(startIndex, baseIndex + 1);
}

function getRowsByDates(rows, dates) {
  const dateSet = new Set(dates);

  return rows.filter((row) => dateSet.has(row.trendingDate));
}

function createFirstCreatorDateMap(rows) {
  const firstDateMap = new Map();

  rows.forEach((row) => {
    const currentDate = firstDateMap.get(row.channelTitle);

    if (!currentDate || row.trendingDate < currentDate) {
      firstDateMap.set(row.channelTitle, row.trendingDate);
    }
  });

  return firstDateMap;
}

function buildOverview(rangeRows, allRows, rangeDates) {
  const uniqueVideos = dedupeByVideo(rangeRows);
  const allCreators = new Set(allRows.map((row) => row.channelTitle));
  const activeCreators = new Set(rangeRows.map((row) => row.channelTitle));

  const rangeDateSet = new Set(rangeDates);
  const firstCreatorDateMap = createFirstCreatorDateMap(allRows);

  const newCreators = Array.from(activeCreators).filter((creatorName) => {
    const firstDate = firstCreatorDateMap.get(creatorName);

    return firstDate ? rangeDateSet.has(firstDate) : false;
  });

  const totalPlayCount = sumBy(uniqueVideos, 'views');
  const totalLikeCount = sumBy(uniqueVideos, 'likes');
  const totalCommentCount = sumBy(uniqueVideos, 'commentCount');
  const totalShareCount = sumBy(uniqueVideos, 'shareCount');

  const avgEngagementRate =
    totalPlayCount > 0
      ? Number(
          (((totalLikeCount + totalCommentCount + totalShareCount) / totalPlayCount) * 100).toFixed(
            2,
          ),
        )
      : 0;

  return {
    totalCreators: allCreators.size,
    activeCreators: activeCreators.size,
    newCreators: newCreators.length,
    totalVideos: uniqueVideos.length,
    totalPlayCount,
    totalLikeCount,
    totalCommentCount,
    totalShareCount,
    avgEngagementRate,
  };
}

function formatHourLabel(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

function buildHourlyTrend(rangeRows) {
  return Array.from({ length: 24 }, (_, hour) => {
    const hourRows = rangeRows.filter((row) => row.publishHour === hour);
    const uniqueVideos = dedupeByVideo(hourRows);
    const activeCreators = new Set(hourRows.map((row) => row.channelTitle));

    return {
      date: formatHourLabel(hour),
      playCount: sumBy(uniqueVideos, 'views'),
      likeCount: sumBy(uniqueVideos, 'likes'),
      commentCount: sumBy(uniqueVideos, 'commentCount'),
      shareCount: sumBy(uniqueVideos, 'shareCount'),
      activeCreators: activeCreators.size,
      publishedVideos: uniqueVideos.length,
    };
  });
}

function buildTrend(rangeRows, rangeDates, rangeKey) {
  if (rangeKey === 'today') {
    return buildHourlyTrend(rangeRows);
  }

  return rangeDates.map((date) => {
    const dayRows = rangeRows.filter((row) => row.trendingDate === date);
    const uniqueVideos = dedupeByVideo(dayRows);
    const activeCreators = new Set(dayRows.map((row) => row.channelTitle));

    return {
      date: date.slice(5),
      playCount: sumBy(uniqueVideos, 'views'),
      likeCount: sumBy(uniqueVideos, 'likes'),
      commentCount: sumBy(uniqueVideos, 'commentCount'),
      shareCount: sumBy(uniqueVideos, 'shareCount'),
      activeCreators: activeCreators.size,
      publishedVideos: uniqueVideos.length,
    };
  });
}

function buildCategories(rangeRows) {
  const uniqueVideos = dedupeByVideo(rangeRows);
  const totalVideos = uniqueVideos.length;
  const categoryMap = new Map();

  uniqueVideos.forEach((row) => {
    const current = categoryMap.get(row.category) ?? {
      category: row.category,
      videoCount: 0,
      playCount: 0,
    };

    current.videoCount += 1;
    current.playCount += row.views;

    categoryMap.set(row.category, current);
  });

  return Array.from(categoryMap.values())
    .map((item) => ({
      ...item,
      percentage: totalVideos > 0 ? Number(((item.videoCount / totalVideos) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.videoCount - a.videoCount)
    .slice(0, 8);
}
function getPublishDatesFromRows(rows) {
  return Array.from(new Set(rows.map((row) => row.publishDate))).sort();
}

function getRecentPublishDatesFromRows(rows, size) {
  const publishDates = getPublishDatesFromRows(rows);

  return publishDates.slice(Math.max(0, publishDates.length - size));
}

function buildPublishTrend(rangeRows, rangeDates, rangeKey) {
  if (rangeKey === 'today') {
    return Array.from({ length: 24 }, (_, hour) => {
      const hourRows = rangeRows.filter((row) => row.publishHour === hour);
      const uniqueVideos = dedupeByVideo(hourRows);
      const activeCreators = new Set(uniqueVideos.map((row) => row.channelTitle));

      return {
        date: formatHourLabel(hour),
        publishedVideos: uniqueVideos.length,
        activeCreators: activeCreators.size,
      };
    });
  }

  const publishDates = getRecentPublishDatesFromRows(rangeRows, dateRangeConfig[rangeKey]);

  return publishDates.map((date) => {
    const dayRows = rangeRows.filter((row) => row.publishDate === date);
    const uniqueVideos = dedupeByVideo(dayRows);
    const activeCreators = new Set(uniqueVideos.map((row) => row.channelTitle));

    return {
      date: date.slice(5),
      publishedVideos: uniqueVideos.length,
      activeCreators: activeCreators.size,
    };
  });
}

function buildDashboardData(rows) {
  const allDates = getSortedDates(rows);
  const demoTodayDate = getDensestDate(rows, allDates);

  const overview = {};
  const trend = {};
  const categories = {};
  const publishTrend = {};

  Object.keys(dateRangeConfig).forEach((rangeKey) => {
    const rangeDates = getRangeDatesByBaseDate(allDates, rangeKey, demoTodayDate);
    const rangeRows = getRowsByDates(rows, rangeDates);

    overview[rangeKey] = buildOverview(rangeRows, rows, rangeDates);
    trend[rangeKey] = buildTrend(rangeRows, rangeDates, rangeKey);
    categories[rangeKey] = buildCategories(rangeRows);
    publishTrend[rangeKey] = buildPublishTrend(rangeRows, rangeDates, rangeKey);
  });

  return {
    overview,
    trend,
    categories,
    publishTrend,
    meta: {
      source: 'Kaggle YouTube Trending Video Statistics',
      region: 'US',
      demoTodayDate,
      generatedAt: new Date().toISOString(),
      note: 'This dataset is transformed into mock data for a Douyin creator analytics dashboard. The today range uses a dense sample date with enough historical window and aggregates trend data by publish hour.',
    },
  };
}
function writeJson(fileName, data) {
  const filePath = path.join(processedDir, fileName);

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function main() {
  ensureFileExists(csvFilePath);
  ensureFileExists(categoryFilePath);
  ensureDir(processedDir);

  const categoryMap = createCategoryMap();
  const records = readCsvRecords();
  const rows = normalizeRows(records, categoryMap);
  const dashboardData = buildDashboardData(rows);

  writeJson('dashboard-overview.json', dashboardData.overview);
  writeJson('dashboard-trend.json', dashboardData.trend);
  writeJson('dashboard-categories.json', dashboardData.categories);
  writeJson('dashboard-publish-trend.json', dashboardData.publishTrend);
  writeJson('dashboard-meta.json', dashboardData.meta);

  console.log('Dashboard data generated successfully.');
  console.log(`Source rows: ${records.length}`);
  console.log(`Valid rows: ${rows.length}`);
  console.log(`Output directory: ${processedDir}`);
}

main();
