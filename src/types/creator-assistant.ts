export type AssistantPriority = 'high' | 'medium' | 'low';

export type AssistantTrendStatus = 'rising' | 'stable' | 'potential';

export type AssistantCompetitionLevel = 'high' | 'medium' | 'low';

export type AssistantOverview = {
  hotContentCount: number;
  categoryTrendCount: number;
  recommendedSlotCount: number;
  titleKeywordCount: number;
  suggestionCount: number;
  topCategory: string;
  bestPublishTime: string;
  topKeyword: string;
  generatedAt: string;
};

export type AssistantHotContent = {
  id: string;
  title: string;
  creatorName: string;
  category: string;
  publishTime: string;
  publishSlot: string;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  engagementRate: number;
  hotScore: number;
  reasonTags: string[];
  rank: number;
};

export type AssistantCategoryTrend = {
  category: string;
  videoCount: number;
  playCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  avgEngagementRate: number;
  trendScore: number;
  trendStatus: AssistantTrendStatus;
  suggestion: string;
};

export type AssistantPublishTime = {
  id: string;
  weekday: number;
  weekdayText: string;
  hour: number;
  label: string;
  score: number;
  avgPlayCount: number;
  avgEngagementRate: number;
  sampleCount: number;
  competitionLevel: AssistantCompetitionLevel;
  competitionText: string;
  expectedPlayLift: number;
  reason: string;
};

export type AssistantTitleKeyword = {
  word: string;
  count: number;
  avgPlayCount: number;
  score: number;
  type: string;
  suggestion: string;
};

export type AssistantSuggestion = {
  id: string;
  title: string;
  type: string;
  priority: AssistantPriority;
  reason: string;
  action: string;
};
