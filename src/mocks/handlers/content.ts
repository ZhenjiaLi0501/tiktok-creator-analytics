import { delay, http, HttpResponse } from 'msw';

import {
  batchDeleteContentMock,
  batchUpdateContentStatusMock,
  getContentCategoriesMock,
  getContentDetailMock,
  getContentListMock,
} from '@/mocks/data/content';
import type { ApiResponse } from '@/types/api';
import type {
  BatchDeleteContentPayload,
  BatchUpdateContentStatusPayload,
  ContentListQuery,
  ContentListResponse,
  ContentVideo,
} from '@/types/content';

function getSearchParam(url: URL, key: string) {
  return url.searchParams.get(key) ?? undefined;
}

export const contentHandlers = [
  http.get('/api/content/list', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);

    const query: ContentListQuery = {
      page: Number(getSearchParam(url, 'page') ?? 1),
      pageSize: Number(getSearchParam(url, 'pageSize') ?? 50),
      keyword: getSearchParam(url, 'keyword'),
      category: getSearchParam(url, 'category'),
      status: getSearchParam(url, 'status') as ContentListQuery['status'],
      sortBy: getSearchParam(url, 'sortBy') as ContentListQuery['sortBy'],
      sortOrder: getSearchParam(url, 'sortOrder') as ContentListQuery['sortOrder'],
    };

    return HttpResponse.json<ApiResponse<ContentListResponse>>({
      code: 0,
      message: 'success',
      data: await getContentListMock(query),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/content/categories', async () => {
    await delay(200);

    return HttpResponse.json<ApiResponse<string[]>>({
      code: 0,
      message: 'success',
      data: await getContentCategoriesMock(),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.get('/api/content/:id', async ({ params }) => {
    await delay(200);

    const id = String(params.id);
    const detail = await getContentDetailMock(id);

    if (!detail) {
      return HttpResponse.json<ApiResponse<ContentVideo | null>>(
        {
          code: 404,
          message: 'content not found',
          data: null,
          requestId: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json<ApiResponse<ContentVideo | null>>({
      code: 0,
      message: 'success',
      data: detail,
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.patch('/api/content/batch-status', async ({ request }) => {
    await delay(300);

    const payload = (await request.json()) as BatchUpdateContentStatusPayload;

    return HttpResponse.json<ApiResponse<{ updatedIds: string[] }>>({
      code: 0,
      message: 'success',
      data: await batchUpdateContentStatusMock(payload),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),

  http.post('/api/content/batch-delete', async ({ request }) => {
    await delay(300);

    const payload = (await request.json()) as BatchDeleteContentPayload;

    return HttpResponse.json<ApiResponse<{ deletedIds: string[] }>>({
      code: 0,
      message: 'success',
      data: await batchDeleteContentMock(payload),
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  }),
];
