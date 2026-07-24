import { request } from '@/lib/request';

import type {
  BatchDeleteContentPayload,
  BatchUpdateContentStatusPayload,
  ContentListQuery,
  ContentListResponse,
  ContentVideo,
} from '@/types/content';

export function getContentList(query?: ContentListQuery) {
  return request<ContentListResponse>('/api/content/list', {
    method: 'GET',
    query: {
      ...query,
    },
  });
}

export function getContentCategories() {
  return request<string[]>('/api/content/categories', {
    method: 'GET',
  });
}

export function getContentDetail(id: string) {
  return request<ContentVideo>(`/api/content/${id}`, {
    method: 'GET',
  });
}

export function batchUpdateContentStatus(payload: BatchUpdateContentStatusPayload) {
  return request<{ updatedIds: string[] }>('/api/content/batch-status', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function batchDeleteContent(payload: BatchDeleteContentPayload) {
  return request<{ deletedIds: string[] }>('/api/content/batch-delete', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
