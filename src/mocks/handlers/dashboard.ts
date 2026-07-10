import { delay, http, HttpResponse } from 'msw';

import { createPlatformOverviewMock } from '@/mocks/data/dashboard';
import type { ApiResponse } from '@/types/api';
import type { DashboardDateRange, PlatformOverview } from '@/types/dashboard';

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
];
