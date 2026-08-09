import { delay, http, HttpResponse } from 'msw';

import {
  getAssistantCategoryTrendsMock,
  getAssistantHotContentsMock,
  getAssistantOverviewMock,
  getAssistantPublishTimesMock,
  getAssistantSuggestionsMock,
  getAssistantTitleKeywordsMock,
} from '@/mocks/data/creator-assistant';
import type { ApiResponse } from '@/types/api';
import type {
  AssistantCategoryTrend,
  AssistantHotContent,
  AssistantOverview,
  AssistantPublishTime,
  AssistantSuggestion,
  AssistantTitleKeyword,
} from '@/types/creator-assistant';

export const creatorAssistantHandlers = [
  http.get('/api/creator-assistant/overview', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AssistantOverview>>({
      code: 0,
      message: 'success',
      data: getAssistantOverviewMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/creator-assistant/hot-contents', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AssistantHotContent[]>>({
      code: 0,
      message: 'success',
      data: getAssistantHotContentsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/creator-assistant/category-trends', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AssistantCategoryTrend[]>>({
      code: 0,
      message: 'success',
      data: getAssistantCategoryTrendsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/creator-assistant/publish-times', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AssistantPublishTime[]>>({
      code: 0,
      message: 'success',
      data: getAssistantPublishTimesMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/creator-assistant/title-keywords', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AssistantTitleKeyword[]>>({
      code: 0,
      message: 'success',
      data: getAssistantTitleKeywordsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/creator-assistant/suggestions', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AssistantSuggestion[]>>({
      code: 0,
      message: 'success',
      data: getAssistantSuggestionsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
];
