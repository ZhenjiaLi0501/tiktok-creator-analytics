import type { PageResponse } from '@/types/api';

export type ContentStatus = 'published' | 'reviewing' | 'offline';

export type ContentSortField =
  'publishTime' | 'playCount' | 'likeCount' | 'commentCount' | 'shareCount' | 'engagmentRate';

export type SortOrder = 'asc' | 'desc';

export type ContentVideo = {
  id: string;
  sourceVideoId: string;
  title: string;
  creatorName: string;
  category: string;
  region: string;
  coverUrl: string;
  publishTime: string;
  duration: number;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  engagmentRate: number;
  status: ContentStatus;
};

export type ContentListQuery = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  status?: ContentStatus | 'all';
  sortBy?: ContentSortField;
  sortOrder?: SortOrder;
};

export type ContentListResponse = PageResponse<ContentVideo>;

export type BatchUpdateContentStatusPayload = {
  ids: string[];
  status: ContentStatus;
};

export type BatchDeleteContentPayload = {
  ids: string[];
};
