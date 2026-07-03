import { delay, http, HttpResponse } from 'msw';
import { platformOverview } from '@/mocks/data/dashboard';
import type { PlatformOverview } from '@/types/dashboard';
import type { ApiResponse } from '@/types/api';

export const dashboarldHandlers = [
  http.get('/api/dashboard/overview', async () => {
    await delay(300);
    return HttpResponse.json<ApiResponse<PlatformOverview>>({
      code: 0,
      message: 'success',
      data: platformOverview,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
];
