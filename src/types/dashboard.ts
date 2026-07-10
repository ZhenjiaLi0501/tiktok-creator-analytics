export type DashboardDateRange = 'today' | '7d' | '30d' | 'custom';

export type PlatformOverview = {
  totalCreators: number;
  activeCreators: number;
  newCreators: number;
  totalVideos: number;
  totalPlayCount: number;
  totalLikeCount: number;
  totalCommentCount: number;
  totalShareCount: number;
  avgEngagementRate: number;
};

export type DashboardOverviewQuery = {
  dateRange?: DashboardDateRange;
  platform?: 'douyin';
  category?: string;
};
