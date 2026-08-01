import { delay, http, HttpResponse } from 'msw';

import {
  getAudienceDemographicsMock,
  getAudienceKeywordsMock,
  getAudienceOverviewMock,
  getAudienceRegionDetailMock,
  getAudienceRegionsMock,
} from '@/mocks/data/audience';
import type { ApiResponse } from '@/types/api';
import type {
  AudienceDemographics,
  AudienceKeyword,
  AudienceOverview,
  AudienceRegion,
  AudienceRegionDetail,
} from '@/types/audience';

export const audienceHandlers = [
  http.get('/api/audience/overview', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AudienceOverview>>({
      code: 0,
      message: 'success',
      data: getAudienceOverviewMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/audience/demographics', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AudienceDemographics>>({
      code: 0,
      message: 'success',
      data: getAudienceDemographicsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/audience/regions', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AudienceRegion[]>>({
      code: 0,
      message: 'success',
      data: getAudienceRegionsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/audience/keywords', async () => {
    await delay(120);

    return HttpResponse.json<ApiResponse<AudienceKeyword[]>>({
      code: 0,
      message: 'success',
      data: getAudienceKeywordsMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/audience/regions/:regionId', async ({ params }) => {
    await delay(120);

    const regionId = String(params.regionId);
    const detail = getAudienceRegionDetailMock(regionId);

    if (!detail) {
      return HttpResponse.json<ApiResponse<AudienceRegionDetail | null>>(
        {
          code: 404,
          message: 'region detail not found',
          data: null,
          requestId: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json<ApiResponse<AudienceRegionDetail | null>>({
      code: 0,
      message: 'success',
      data: detail,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
];
