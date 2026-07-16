import type {
  DashboardDateRange,
  PlatformOverview,
  DashboardTrendPoint,
  DashboardCategoryItem,
  DashboardPublishTrendPoint,
} from '@/types/dashboard';

const baseOverview: PlatformOverview = {
  totalCreators: 128560,
  activeCreators: 43820,
  newCreators: 3256,
  totalVideos: 982450,
  totalPlayCount: 1289345000,
  totalLikeCount: 86532000,
  totalCommentCount: 12678000,
  totalShareCount: 9321000,
  avgEngagementRate: 8.42,
};
const trendBaseData: DashboardTrendPoint[] = [
  {
    date: '05-14',
    playCount: 1280000,
    likeCount: 86000,
    commentCount: 12800,
    shareCount: 9600,
    activeCreators: 12600,
    publishedVideos: 48200,
  },
  {
    date: '05-15',
    playCount: 1860000,
    likeCount: 112000,
    commentCount: 16800,
    shareCount: 13800,
    activeCreators: 14800,
    publishedVideos: 53600,
  },
  {
    date: '05-16',
    playCount: 1720000,
    likeCount: 98000,
    commentCount: 15200,
    shareCount: 12100,
    activeCreators: 13900,
    publishedVideos: 51200,
  },
  {
    date: '05-17',
    playCount: 2180000,
    likeCount: 136000,
    commentCount: 22600,
    shareCount: 17500,
    activeCreators: 17200,
    publishedVideos: 64800,
  },
  {
    date: '05-18',
    playCount: 2460000,
    likeCount: 158000,
    commentCount: 24800,
    shareCount: 19800,
    activeCreators: 18600,
    publishedVideos: 69200,
  },
  {
    date: '05-19',
    playCount: 2320000,
    likeCount: 149000,
    commentCount: 23600,
    shareCount: 18200,
    activeCreators: 17900,
    publishedVideos: 66400,
  },
  {
    date: '05-20',
    playCount: 2860000,
    likeCount: 186000,
    commentCount: 29600,
    shareCount: 23100,
    activeCreators: 21300,
    publishedVideos: 78600,
  },
];
const categoryBaseData: DashboardCategoryItem[] = [
  {
    category: '美食',
    videoCount: 128000,
    playCount: 386000000,
    percentage: 26.4,
  },
  {
    category: '旅行',
    videoCount: 96000,
    playCount: 292000000,
    percentage: 19.8,
  },
  {
    category: '科技',
    videoCount: 84000,
    playCount: 245000000,
    percentage: 17.3,
  },
  {
    category: '娱乐',
    videoCount: 76000,
    playCount: 226000000,
    percentage: 15.7,
  },
  {
    category: '教育',
    videoCount: 62000,
    playCount: 168000000,
    percentage: 12.8,
  },
  {
    category: '游戏',
    videoCount: 39000,
    playCount: 116000000,
    percentage: 8.0,
  },
];
const publishTrendBaseData: DashboardPublishTrendPoint[] = [
  {
    date: '05-14',
    publishedVideos: 48200,
    activeCreators: 12600,
  },
  {
    date: '05-15',
    publishedVideos: 53600,
    activeCreators: 14800,
  },
  {
    date: '05-16',
    publishedVideos: 51200,
    activeCreators: 13900,
  },
  {
    date: '05-17',
    publishedVideos: 64800,
    activeCreators: 17200,
  },
  {
    date: '05-18',
    publishedVideos: 69200,
    activeCreators: 18600,
  },
  {
    date: '05-19',
    publishedVideos: 66400,
    activeCreators: 17900,
  },
  {
    date: '05-20',
    publishedVideos: 78600,
    activeCreators: 21300,
  },
];

const trendMultiplierMap: Record<DashboardDateRange, number> = {
  today: 0.18,
  '7d': 1,
  '30d': 3.6,
  custom: 1.4,
};

const dateRangeMultiplierMap: Record<DashboardDateRange, number> = {
  today: 0.16,
  '7d': 1,
  '30d': 3.8,
  custom: 1.6,
};

export function createDashboardPublishTrendMock(dateRange: DashboardDateRange = '7d') {
  const multiplier = trendMultiplierMap[dateRange];
  return publishTrendBaseData.map((point) => ({
    ...point,
    publishedVideos: Math.round(point.publishedVideos * multiplier),
    activeCreators: Math.round(point.activeCreators * multiplier),
  }));
}

function scaleTrendPoint(point: DashboardTrendPoint, multiplier: number): DashboardTrendPoint {
  return {
    ...point,
    playCount: Math.round(point.playCount * multiplier),
    likeCount: Math.round(point.likeCount * multiplier),
    commentCount: Math.round(point.commentCount * multiplier),
    shareCount: Math.round(point.shareCount * multiplier),
    activeCreators: Math.round(point.activeCreators * multiplier),
    publishedVideos: Math.round(point.publishedVideos * multiplier),
  };
}

export function createDashboardCategoryMock(dateRange: DashboardDateRange = '7d') {
  const multiplier = dateRangeMultiplierMap[dateRange];
  return categoryBaseData.map((item) => ({
    ...item,
    videoCount: Math.round(item.videoCount * multiplier),
    playCount: Math.round(item.playCount * multiplier),
  }));
}

export function createDashboardTrendMock(dateRange: DashboardDateRange = '7d') {
  const multiplier = trendMultiplierMap[dateRange];
  return trendBaseData.map((point) => scaleTrendPoint(point, multiplier));
}

function scaleNumber(value: number, multiplier: number) {
  return Math.round(value * multiplier);
}

export function createPlatformOverviewMock(dateRange: DashboardDateRange = '7d') {
  const multiplier = dateRangeMultiplierMap[dateRange];

  return {
    totalCreators: scaleNumber(baseOverview.totalCreators, multiplier),
    activeCreators: scaleNumber(baseOverview.activeCreators, multiplier),
    newCreators: scaleNumber(baseOverview.newCreators, multiplier),
    totalVideos: scaleNumber(baseOverview.totalVideos, multiplier),
    totalPlayCount: scaleNumber(baseOverview.totalPlayCount, multiplier),
    totalLikeCount: scaleNumber(baseOverview.totalLikeCount, multiplier),
    totalCommentCount: scaleNumber(baseOverview.totalCommentCount, multiplier),
    totalShareCount: scaleNumber(baseOverview.totalShareCount, multiplier),
    avgEngagementRate:
      dateRange === 'today' ? 7.86 : dateRange === '30d' ? 8.95 : baseOverview.avgEngagementRate,
  };
}
