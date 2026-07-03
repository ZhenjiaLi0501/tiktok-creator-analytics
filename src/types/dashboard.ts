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
  dataRange?: 'today' | '7d' | '30d' | 'custom';
  platform?: 'douyin';
  category?: string;
};
