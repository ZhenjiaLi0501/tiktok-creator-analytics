import type { DashboardDateRange, PlatformOverview } from '@/types/dashboard';

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

const dateRangeMultiplierMap: Record<DashboardDateRange, number> = {
  today: 0.16,
  '7d': 1,
  '30d': 3.8,
  custom: 1.6,
};

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
