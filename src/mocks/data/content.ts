import type {
  BatchDeleteContentPayload,
  BatchUpdateContentStatusPayload,
  ContentListQuery,
  ContentListResponse,
  ContentSortField,
  ContentStatus,
  ContentVideo,
  SortOrder,
} from '@/types/content';

let contentListCache: ContentVideo[] | null = null;

async function loadContentListData() {
  if (contentListCache) {
    return contentListCache;
  }

  const response = await fetch('/mock/content-list.json');

  if (!response.ok) {
    throw new Error(`Failed to load content mock data: ${response.status}`);
  }

  contentListCache = (await response.json()) as ContentVideo[];

  return contentListCache;
}

function normalizePage(value: unknown, fallback: number) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return fallback;
  }

  return Math.floor(numberValue);
}

function normalizeSortOrder(value: unknown): SortOrder {
  return value === 'asc' ? 'asc' : 'desc';
}

function normalizeSortBy(value: unknown): ContentSortField {
  const allowedFields: ContentSortField[] = [
    'publishTime',
    'playCount',
    'likeCount',
    'commentCount',
    'shareCount',
    'engagmentRate',
  ];

  return allowedFields.includes(value as ContentSortField)
    ? (value as ContentSortField)
    : 'publishTime';
}

function compareContentVideo(
  a: ContentVideo,
  b: ContentVideo,
  sortBy: ContentSortField,
  sortOrder: SortOrder,
) {
  const direction = sortOrder === 'asc' ? 1 : -1;

  if (sortBy === 'publishTime') {
    return (new Date(a.publishTime).getTime() - new Date(b.publishTime).getTime()) * direction;
  }

  return (a[sortBy] - b[sortBy]) * direction;
}

function filterContentList(list: ContentVideo[], query: ContentListQuery) {
  const keyword = query.keyword?.trim().toLowerCase();
  const category = query.category;
  const status = query.status;

  return list.filter((item) => {
    const title = String(item.title ?? '').toLowerCase();
    const creatorName = String(item.creatorName ?? '').toLowerCase();

    const keywordMatched = keyword
      ? title.includes(keyword) || creatorName.includes(keyword)
      : true;

    const categoryMatched = category && category !== 'all' ? item.category === category : true;
    const statusMatched = status && status !== 'all' ? item.status === status : true;

    return keywordMatched && categoryMatched && statusMatched;
  });
}

export async function getContentListMock(
  query: ContentListQuery = {},
): Promise<ContentListResponse> {
  const contentList = await loadContentListData();

  const page = normalizePage(query.page, 1);
  const pageSize = normalizePage(query.pageSize, 50);
  const sortBy = normalizeSortBy(query.sortBy);
  const sortOrder = normalizeSortOrder(query.sortOrder);

  const filteredList = filterContentList(contentList, query);
  const sortedList = [...filteredList].sort((a, b) => compareContentVideo(a, b, sortBy, sortOrder));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    list: sortedList.slice(start, end),
    total: sortedList.length,
    page,
    pageSize,
  };
}

export async function getContentDetailMock(id: string) {
  const contentList = await loadContentListData();

  return contentList.find((item) => item.id === id) ?? null;
}

export async function getContentCategoriesMock() {
  const contentList = await loadContentListData();

  return Array.from(new Set(contentList.map((item) => item.category))).sort();
}

export async function batchUpdateContentStatusMock(
  payload: BatchUpdateContentStatusPayload,
): Promise<{ updatedIds: string[] }> {
  const contentList = await loadContentListData();
  const idSet = new Set(payload.ids);
  const allowedStatuses: ContentStatus[] = ['published', 'reviewing', 'offline'];

  if (!allowedStatuses.includes(payload.status)) {
    return {
      updatedIds: [],
    };
  }

  contentListCache = contentList.map((item) => {
    if (!idSet.has(item.id)) {
      return item;
    }

    return {
      ...item,
      status: payload.status,
    };
  });

  return {
    updatedIds: payload.ids,
  };
}

export async function batchDeleteContentMock(
  payload: BatchDeleteContentPayload,
): Promise<{ deletedIds: string[] }> {
  const contentList = await loadContentListData();
  const idSet = new Set(payload.ids);

  contentListCache = contentList.filter((item) => !idSet.has(item.id));

  return {
    deletedIds: payload.ids,
  };
}
