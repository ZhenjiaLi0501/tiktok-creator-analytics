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
  category?: string;
};

export type DashboardTrendPoint = {
  date: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  activeCreators: number;
  publishedVideos: number;
};
export type DashboardTrendQuery = {
  dateRange?: DashboardDateRange;
  category?: string;
};

export type DashboardCategoryItem = {
  category: string;
  videoCount: number;
  playCount: number;
  percentage: number;
};

export type DashboardCategoryQuery = {
  dateRange?: DashboardDateRange;
};
