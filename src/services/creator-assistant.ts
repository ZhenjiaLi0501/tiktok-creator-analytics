import { request } from '@/lib/request';
import type {
  AssistantCategoryTrend,
  AssistantHotContent,
  AssistantOverview,
  AssistantPublishTime,
  AssistantSuggestion,
  AssistantTitleKeyword,
} from '@/types/creator-assistant';

export function getAssistantOverview() {
  return request<AssistantOverview>('/api/creator-assistant/overview', {
    method: 'GET',
  });
}

export function getAssistantHotContents() {
  return request<AssistantHotContent[]>('/api/creator-assistant/hot-contents', {
    method: 'GET',
  });
}

export function getAssistantCategoryTrends() {
  return request<AssistantCategoryTrend[]>('/api/creator-assistant/category-trends', {
    method: 'GET',
  });
}

export function getAssistantPublishTimes() {
  return request<AssistantPublishTime[]>('/api/creator-assistant/publish-times', {
    method: 'GET',
  });
}

export function getAssistantTitleKeywords() {
  return request<AssistantTitleKeyword[]>('/api/creator-assistant/title-keywords', {
    method: 'GET',
  });
}

export function getAssistantSuggestions() {
  return request<AssistantSuggestion[]>('/api/creator-assistant/suggestions', {
    method: 'GET',
  });
}
