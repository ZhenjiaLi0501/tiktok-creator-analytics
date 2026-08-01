import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const processedDir = path.join(rootDir, 'data', 'processed');
const contentListPath = path.join(processedDir, 'content-list.json');

const outputFiles = {
  overview: 'audience-overview.json',
  demographics: 'audience-demographics.json',
  regions: 'audience-regions.json',
  keywords: 'audience-keywords.json',
  regionDetails: 'audience-region-details.json',
};

const chinaRegionSeeds = [
  {
    id: 'GD',
    name: '广东',
    city: '广州',
    lng: 113.2644,
    lat: 23.1291,
    baseAudience: 28600000,
    topCategory: '娱乐',
  },
  {
    id: 'JS',
    name: '江苏',
    city: '南京',
    lng: 118.7969,
    lat: 32.0603,
    baseAudience: 23600000,
    topCategory: '生活',
  },
  {
    id: 'ZJ',
    name: '浙江',
    city: '杭州',
    lng: 120.1551,
    lat: 30.2741,
    baseAudience: 22400000,
    topCategory: '美食',
  },
  {
    id: 'SH',
    name: '上海',
    city: '上海',
    lng: 121.4737,
    lat: 31.2304,
    baseAudience: 19800000,
    topCategory: '穿搭',
  },
  {
    id: 'BJ',
    name: '北京',
    city: '北京',
    lng: 116.4074,
    lat: 39.9042,
    baseAudience: 18400000,
    topCategory: '科技',
  },
  {
    id: 'SC',
    name: '四川',
    city: '成都',
    lng: 104.0668,
    lat: 30.5728,
    baseAudience: 17600000,
    topCategory: '美食',
  },
  {
    id: 'SD',
    name: '山东',
    city: '济南',
    lng: 117.1201,
    lat: 36.6512,
    baseAudience: 15800000,
    topCategory: '生活',
  },
  {
    id: 'HA',
    name: '河南',
    city: '郑州',
    lng: 113.6254,
    lat: 34.7466,
    baseAudience: 14900000,
    topCategory: '剧情',
  },
  {
    id: 'HB',
    name: '湖北',
    city: '武汉',
    lng: 114.3054,
    lat: 30.5928,
    baseAudience: 13600000,
    topCategory: '教育',
  },
  {
    id: 'FJ',
    name: '福建',
    city: '福州',
    lng: 119.2965,
    lat: 26.0745,
    baseAudience: 12800000,
    topCategory: '旅行',
  },
  {
    id: 'HN',
    name: '湖南',
    city: '长沙',
    lng: 112.9388,
    lat: 28.2282,
    baseAudience: 12200000,
    topCategory: '娱乐',
  },
  {
    id: 'CQ',
    name: '重庆',
    city: '重庆',
    lng: 106.5516,
    lat: 29.563,
    baseAudience: 11600000,
    topCategory: '美食',
  },
  {
    id: 'SX',
    name: '陕西',
    city: '西安',
    lng: 108.9398,
    lat: 34.3416,
    baseAudience: 10400000,
    topCategory: '历史文化',
  },
  {
    id: 'AH',
    name: '安徽',
    city: '合肥',
    lng: 117.2272,
    lat: 31.8206,
    baseAudience: 9800000,
    topCategory: '生活',
  },
  {
    id: 'LN',
    name: '辽宁',
    city: '沈阳',
    lng: 123.4315,
    lat: 41.8057,
    baseAudience: 9200000,
    topCategory: '体育',
  },
  {
    id: 'YN',
    name: '云南',
    city: '昆明',
    lng: 102.8329,
    lat: 24.8801,
    baseAudience: 8800000,
    topCategory: '旅行',
  },
  {
    id: 'GX',
    name: '广西',
    city: '南宁',
    lng: 108.3669,
    lat: 22.817,
    baseAudience: 8300000,
    topCategory: '美食',
  },
  {
    id: 'JX',
    name: '江西',
    city: '南昌',
    lng: 115.8582,
    lat: 28.682,
    baseAudience: 7600000,
    topCategory: '生活',
  },
  {
    id: 'TJ',
    name: '天津',
    city: '天津',
    lng: 117.2009,
    lat: 39.0842,
    baseAudience: 7200000,
    topCategory: '剧情',
  },
  {
    id: 'HE',
    name: '河北',
    city: '石家庄',
    lng: 114.5149,
    lat: 38.0428,
    baseAudience: 6900000,
    topCategory: '生活',
  },
];

const keywordSeeds = [
  '城市漫游',
  '美食探店',
  '国风穿搭',
  '校园生活',
  '剧情反转',
  '音乐挑战',
  '热点事件',
  '旅行攻略',
  '运动健身',
  '萌宠日常',
  '科技数码',
  '知识科普',
  '职场经验',
  '亲子互动',
  '学习方法',
  '开箱测评',
  '户外露营',
  '舞蹈翻跳',
  '生活记录',
  '情绪价值',
  '影视剪辑',
  '地方文化',
  '城市夜景',
  '非遗手作',
  '本地生活',
  '创作教程',
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

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, digits = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(digits));
}

function normalizePercentList(list) {
  const total = list.reduce((sum, item) => sum + item.value, 0);

  return list.map((item) => ({
    ...item,
    value: Number(((item.value / total) * 100).toFixed(1)),
  }));
}

function buildRegions() {
  const regions = chinaRegionSeeds.map((region) => {
    const audienceCount = Math.round(region.baseAudience * randomFloat(0.88, 1.18));
    const activeRate = randomFloat(28, 62);
    const interactionRate = randomFloat(2.8, 8.6);

    return {
      id: region.id,
      name: region.name,
      city: region.city,
      lng: region.lng,
      lat: region.lat,
      audienceCount,
      activeRate,
      interactionRate,
      heat: 0,
      topCategory: region.topCategory,
      rank: 0,
    };
  });

  const maxAudience = Math.max(...regions.map((region) => region.audienceCount));

  return regions
    .map((region) => ({
      ...region,
      heat: Number((region.audienceCount / maxAudience).toFixed(2)),
    }))
    .sort((a, b) => b.audienceCount - a.audienceCount)
    .map((region, index) => ({
      ...region,
      rank: index + 1,
    }));
}

function buildOverview(contentList, regions) {
  const totalPlayCount = sumBy(contentList, 'playCount');
  const totalLikeCount = sumBy(contentList, 'likeCount');
  const totalCommentCount = sumBy(contentList, 'commentCount');
  const totalShareCount = sumBy(contentList, 'shareCount');

  const totalAudience = sumBy(regions, 'audienceCount');
  const activeAudience = Math.round(totalAudience * 0.42);
  const newAudience = Math.round(totalAudience * 0.075);

  const interactionRate =
    totalPlayCount > 0
      ? Number(
          (((totalLikeCount + totalCommentCount + totalShareCount) / totalPlayCount) * 100).toFixed(
            2,
          ),
        )
      : 0;

  return {
    totalAudience,
    activeAudience,
    newAudience,
    avgWatchDuration: randomNumber(38, 76),
    interactionRate,
    retentionRate: randomFloat(31, 58),
    topRegion: regions[0]?.name ?? '广东',
    regionCount: regions.length,
  };
}

function buildDemographics() {
  return {
    gender: [
      {
        label: '女性',
        value: 51.2,
      },
      {
        label: '男性',
        value: 45.8,
      },
      {
        label: '未知',
        value: 3.0,
      },
    ],
    age: [
      {
        label: '18岁以下',
        value: 8.8,
      },
      {
        label: '18-24岁',
        value: 31.6,
      },
      {
        label: '25-30岁',
        value: 26.2,
      },
      {
        label: '31-40岁',
        value: 21.4,
      },
      {
        label: '41岁以上',
        value: 12.0,
      },
    ],
    device: [
      {
        label: 'Android',
        value: 68.5,
      },
      {
        label: 'iOS',
        value: 27.2,
      },
      {
        label: 'Web',
        value: 2.8,
      },
      {
        label: 'Tablet',
        value: 1.5,
      },
    ],
  };
}

function buildKeywords(contentList) {
  const categoryCountMap = new Map();

  contentList.slice(0, 8000).forEach((item) => {
    const currentCount = categoryCountMap.get(item.category) ?? 0;

    categoryCountMap.set(item.category, currentCount + 1);
  });

  const categoryKeywords = Array.from(categoryCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, count]) => ({
      word: category,
      value: Math.max(24, Math.round(count / 10)),
      type: 'category',
    }));

  const interestKeywords = keywordSeeds.map((word, index) => ({
    word,
    value: Math.max(18, randomNumber(32, 110 - index)),
    type: 'interest',
  }));

  return [...categoryKeywords, ...interestKeywords].sort((a, b) => b.value - a.value).slice(0, 32);
}

function pickKeywords(keywords, count) {
  const copiedKeywords = [...keywords];
  const result = [];

  while (copiedKeywords.length > 0 && result.length < count) {
    const index = randomNumber(0, copiedKeywords.length - 1);
    const [keyword] = copiedKeywords.splice(index, 1);

    result.push({
      word: keyword.word,
      value: Math.round(keyword.value * randomFloat(0.65, 1.35)),
    });
  }

  return result;
}

function buildRegionDetails(regions, keywords) {
  const baseDemographics = buildDemographics();

  return Object.fromEntries(
    regions.map((region) => {
      const gender = normalizePercentList(
        baseDemographics.gender.map((item) => ({
          ...item,
          value: item.value * randomFloat(0.92, 1.08),
        })),
      );

      const age = normalizePercentList(
        baseDemographics.age.map((item) => ({
          ...item,
          value: item.value * randomFloat(0.85, 1.15),
        })),
      );

      const device = normalizePercentList(
        baseDemographics.device.map((item) => ({
          ...item,
          value: item.value * randomFloat(0.9, 1.1),
        })),
      );

      return [
        region.id,
        {
          regionId: region.id,
          regionName: region.name,
          city: region.city,
          audienceCount: region.audienceCount,
          activeRate: region.activeRate,
          interactionRate: region.interactionRate,
          topCategory: region.topCategory,
          gender,
          age,
          device,
          keywords: pickKeywords(keywords, 8),
        },
      ];
    }),
  );
}

function main() {
  ensureDir(processedDir);

  const contentList = readJson(contentListPath);

  const regions = buildRegions();
  const overview = buildOverview(contentList, regions);
  const demographics = buildDemographics();
  const keywords = buildKeywords(contentList);
  const regionDetails = buildRegionDetails(regions, keywords);

  writeJson(outputFiles.overview, overview);
  writeJson(outputFiles.demographics, demographics);
  writeJson(outputFiles.regions, regions);
  writeJson(outputFiles.keywords, keywords);
  writeJson(outputFiles.regionDetails, regionDetails);

  console.log('China audience data generated successfully.');
  console.log(`Source content rows: ${contentList.length}`);
  console.log(`China regions: ${regions.length}`);
  console.log(`Output directory: ${processedDir}`);
}

main();
