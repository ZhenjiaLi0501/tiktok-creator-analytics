import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const rawDir = path.join(rootDir, 'data', 'raw');
const processedDir = path.join(rootDir, 'data', 'processed');

const targetCount = 100000;

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

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function toNumber(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return 0;
  }
  return numberValue;
}

function toBoolean(value) {
  return String(value).toLowerCase() === 'true';
}

function parsePublishTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function getRegionFromFileName(fileName) {
  return fileName.replace('videos.csv', '');
}

function createCategoryMap(region) {
  const categoryFilePath = path.join(rawDir, `${region}_category_id.json`);
  if (!fs.existsSync(categoryFilePath)) {
    return new Map();
  }
  const categoryJson = JSON.parse(fs.readFileSync(categoryFilePath, 'utf-8'));
  const categoryMap = new Map();
  categoryJson.items.forEach((item) => {
    const rawTitle = item?.snippet?.title ?? '其他';
    const zhTitle = categoryNameMap[rawTitle] ?? rawTitle;
    categoryMap.set(String(item.id), zhTitle);
  });
  return categoryMap;
}

function readCsvFile(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  return parse(csvContent, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });
}

function createStatus(record, index) {
  if (toBoolean(record.video_error_or_removed)) {
    return 'offline';
  }
  if (toBoolean(record.comments_disabled) || toBoolean(record.ratings_disabled)) {
    return 'reviewing';
  }
  if (index % 17 === 0) {
    return 'offline';
  }
  if (index % 11 === 0) {
    return 'reviewing';
  }
  return 'published';
}

function normalizeRecord(record, region, categoryMap, index) {
  const videoId = String(record.video_id ?? '').trim();
  const title = String(record.title ?? '').trim();
  const creatorName = String(record.channel_title ?? '').trim();
  const categoryId = String(record.category_id ?? '').trim();
  const publishTime = parsePublishTime(record.publish_time);

  const playCount = toNumber(record.views);
  const likeCount = toNumber(record.likes);
  const commentCount = toNumber(record.comment_count);
  const shareCount = Math.round((likeCount + commentCount) * 0.15);

  if (!videoId || !title || !creatorName || !publishTime || playCount <= 0) {
    return null;
  }

  const engagmentRate =
    playCount > 0
      ? Number((((likeCount + commentCount + shareCount) / playCount) * 100).toFixed(2))
      : 0;

  return {
    id: `${region}_${index}_${videoId}`,
    sourceVideoId: videoId,
    title,
    creatorName,
    category: categoryMap.get(categoryId) ?? '其他',
    region,
    coverUrl: String(record.thumbnail_link ?? '').trim(),
    publishTime,
    duration: 15 + (index % 240),
    playCount,
    likeCount,
    commentCount,
    shareCount,
    engagmentRate,
    status: createStatus(record, index),
  };
}

function buildContentList() {
  const videoFiles = fs
    .readdirSync(rawDir)
    .filter((fileName) => fileName.endsWith('videos.csv'))
    .sort();
  const rows = [];

  videoFiles.forEach((fileName) => {
    const region = getRegionFromFileName(fileName);
    const categoryMap = createCategoryMap(region);
    const filePath = path.join(rawDir, fileName);
    const records = readCsvFile(filePath);

    console.log('region', region);
    console.log('categoryMap Size', categoryMap.size);
    console.log('categoryMap sample', Array.from(categoryMap.entries()).slice(0, 5));
    console.log('csv category sample:', records[0].category_id);

    records.forEach((record, index) => {
      const normalizedRecord = normalizeRecord(record, region, categoryMap, index);
      if (normalizedRecord) {
        rows.push(normalizedRecord);
      }
    });
  });
  if (rows.length === 0) {
    throw new Error('No valid content rows generated from raw dataset.');
  }

  const contentList = Array.from({ length: targetCount }, (_, index) => {
    const source = rows[index % rows.length];
    const loop = Math.floor(index / rows.length);
    return {
      ...source,
      id: `content_${String(index + 1).padStart(6, '0')}`,
      title: loop === 0 ? source.title : `${source.title} · ${loop + 1}`,
      playCount: Math.round(source.playCount * (1 + loop * 0.03)),
      likeCount: Math.round(source.likeCount * (1 + loop * 0.02)),
      commentCount: Math.round(source.commentCount * (1 + loop * 0.015)),
      shareCount: Math.round(source.shareCount * (1 + loop * 0.015)),
    };
  });
  return {
    contentList,
    meta: {
      source: 'Kaggle Youyubr Trending Video Statistics',
      generatedAt: new Date().toISOString(),
      rawRows: rows.length,
      outputRows: contentList.length,
      note: 'Raw public video dataset is transformed and expanded into mock data for a Douyin content management list.',
    },
  };
}

function writeJson(fileName, data) {
  const filePath = path.join(processedDir, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function main() {
  ensureDir(processedDir);
  const { contentList, meta } = buildContentList();
  writeJson('content-list.json', contentList);
  writeJson('content-list-meta.json', meta);
  console.log('Content management data generated successfully.');
  console.log(`Raw usable rows: ${meta.rawRows}`);
  console.log(`Output rows: ${meta.outputRows}`);
  console.log(`Output directory: ${processedDir}`);
}

main();
