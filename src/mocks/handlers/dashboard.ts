import { delay, http, HttpResponse } from 'msw';

import {
  createPlatformOverviewMock,
  createDashboardTrendMock,
  createDashboardCategoryMock,
  createDashboardPublishTrendMock,
} from '@/mocks/data/dashboard';
import type { ApiResponse } from '@/types/api';
import type {
  DashboardDateRange,
  PlatformOverview,
  DashboardTrendPoint,
  DashboardCategoryItem,
  DashboardPublishTrendPoint,
} from '@/types/dashboard';

export const dashboardHandlers = [
  http.get('/api/dashboard/overview', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const dateRange = (url.searchParams.get('dateRange') ?? '7d') as DashboardDateRange;

    return HttpResponse.json<ApiResponse<PlatformOverview>>({
      code: 0,
      message: 'success',
      data: createPlatformOverviewMock(dateRange),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
  http.get('/api/dashboard/trend', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const dateRange = (url.searchParams.get('dateRange') ?? '7d') as DashboardDateRange;

    return HttpResponse.json<ApiResponse<DashboardTrendPoint[]>>({
      code: 0,
      message: 'success',
      data: createDashboardTrendMock(dateRange),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
  http.get('/api/dashboard/category', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const dateRange = (url.searchParams.get('dateRange') ?? '7d') as DashboardDateRange;

    return HttpResponse.json<ApiResponse<DashboardCategoryItem[]>>({
      code: 0,
      message: 'success',
      data: createDashboardCategoryMock(dateRange),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
  http.get('/api/dashboard/publish-trend', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const dateRange = (url.searchParams.get('dateRange') ?? '7d') as DashboardDateRange;

    return HttpResponse.json<ApiResponse<DashboardPublishTrendPoint[]>>({
      code: 0,
      message: 'success',
      data: createDashboardPublishTrendMock(dateRange),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
];
