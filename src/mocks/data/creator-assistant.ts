import assistantCategoryTrendsJson from '../../../data/processed/assistant-category-trends.json';
import assistantHotContentsJson from '../../../data/processed/assistant-hot-contents.json';
import assistantOverviewJson from '../../../data/processed/assistant-overview.json';
import assistantPublishTimesJson from '../../../data/processed/assistant-publish-times.json';
import assistantSuggestionsJson from '../../../data/processed/assistant-suggestions.json';
import assistantTitleKeywordsJson from '../../../data/processed/assistant-title-keywords.json';

import type {
  AssistantCategoryTrend,
  AssistantHotContent,
  AssistantOverview,
  AssistantPublishTime,
  AssistantSuggestion,
  AssistantTitleKeyword,
} from '@/types/creator-assistant';

const assistantOverview = assistantOverviewJson as AssistantOverview;
const assistantHotContents = assistantHotContentsJson as AssistantHotContent[];
const assistantCategoryTrends = assistantCategoryTrendsJson as unknown as AssistantCategoryTrend[];
const assistantPublishTimes = assistantPublishTimesJson as unknown as AssistantPublishTime[];
const assistantTitleKeywords = assistantTitleKeywordsJson as AssistantTitleKeyword[];
const assistantSuggestions = assistantSuggestionsJson as AssistantSuggestion[];

export function getAssistantOverviewMock() {
  return assistantOverview;
}

export function getAssistantHotContentsMock() {
  return assistantHotContents;
}

export function getAssistantCategoryTrendsMock() {
  return assistantCategoryTrends;
}

export function getAssistantPublishTimesMock() {
  return assistantPublishTimes;
}

export function getAssistantTitleKeywordsMock() {
  return assistantTitleKeywords;
}

export function getAssistantSuggestionsMock() {
  return assistantSuggestions;
}
