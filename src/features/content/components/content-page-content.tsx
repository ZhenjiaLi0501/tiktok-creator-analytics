'use client';

import { markPerformance, measurePerformance, observeLongTasks } from '@/lib/performance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EmptyState } from '@/components/common/empty-state';
import { ContentListSkeleton } from './content-list-skeleton';
import { Button } from '@/components/ui/button';
import {
  batchDeleteContent,
  batchUpdateContentStatus,
  getContentCategories,
  getContentList,
} from '@/services/content';
import type {
  ContentListQuery,
  ContentSortField,
  ContentStatus,
  ContentVideo,
  SortOrder,
} from '@/types/content';
import { ContentDetailDrawer } from './content-detail-drawer';

import { ContentVirtualList } from './content-virtual-list';

type QueryState = {
  keyword: string;
  category: string;
  status: ContentStatus | 'all';
  sortBy: ContentSortField;
  sortOrder: SortOrder;
};

const defaultQuery: QueryState = {
  keyword: '',
  category: 'all',
  status: 'all',
  sortBy: 'playCount',
  sortOrder: 'desc',
};

const statusOptions: Array<{
  label: string;
  value: ContentStatus | 'all';
}> = [
  {
    label: '全部状态',
    value: 'all',
  },
  {
    label: '已发布',
    value: 'published',
  },
  {
    label: '审核中',
    value: 'reviewing',
  },
  {
    label: '已下架',
    value: 'offline',
  },
];

const sortFieldOptions: Array<{
  label: string;
  value: ContentSortField;
}> = [
  {
    label: '发布时间',
    value: 'publishTime',
  },
  {
    label: '播放量',
    value: 'playCount',
  },
  {
    label: '点赞量',
    value: 'likeCount',
  },
  {
    label: '评论量',
    value: 'commentCount',
  },
  {
    label: '分享量',
    value: 'shareCount',
  },
  {
    label: '互动率',
    value: 'engagmentRate',
  },
];

export function ContentPageContent() {
  const [query, setQuery] = useState<QueryState>(defaultQuery);
  const [keywordInput, setKeywordInput] = useState('');
  const [items, setItems] = useState<ContentVideo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeContent, setActiveContent] = useState<ContentVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [operating, setOperating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedIdList = useMemo(() => Array.from(selectedIds), [selectedIds]);

  const buildRequestQuery = useCallback(
    (currentQuery: QueryState): ContentListQuery => ({
      page: 1,
      pageSize: 100000,
      keyword: currentQuery.keyword || undefined,
      category: currentQuery.category,
      status: currentQuery.status,
      sortBy: currentQuery.sortBy,
      sortOrder: currentQuery.sortOrder,
    }),
    [],
  );

  const loadContentList = useCallback(async () => {
    try {
      const response = await getContentList(buildRequestQuery(query));

      setItems(response.list);
      setTotal(response.total);
      setSelectedIds(new Set());
    } catch (error) {
      console.error(error);
      setErrorMessage('内容列表加载失败，请检查 MSW 接口或数据文件。');
    } finally {
      setLoading(false);
    }
  }, [buildRequestQuery, query]);

  const updateQuery = useCallback((updater: (currentQuery: QueryState) => QueryState) => {
    setLoading(true);
    setErrorMessage('');
    setQuery(updater);
  }, []);
  useEffect(() => {
    return observeLongTasks();
  }, []);

  useEffect(() => {
    let ignore = false;
    markPerformance('content-list-request-start');
    getContentList(buildRequestQuery(query))
      .then((response) => {
        if (ignore) {
          return;
        }
        markPerformance('content-list-data-ready');
        measurePerformance(
          'content-list request duration',
          'content-list-request-start',
          'content-list-data-ready',
        );
        setItems(response.list);
        setTotal(response.total);
        setSelectedIds(new Set());
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);
        setErrorMessage('内容列表加载失败，请检查 MSW 接口或数据文件。');
      })
      .finally(() => {
        if (ignore) {
          return;
        }

        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [buildRequestQuery, query]);

  useEffect(() => {
    if (loading || items.length === 0) {
      return;
    }
    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        markPerformance('content-list-visible-rows-ready');

        measurePerformance(
          'content-list data ready to visible',
          'content-list-request-start',
          'content-list-visible-rows-ready',
        );

        measurePerformance(
          'content-list data ready to visible rows',
          'content-list-data-ready',
          'content-list-visible-rows-ready',
        );
        const renderedRowCount = document.querySelectorAll('[data-content-row="true"]').length;
        console.info(`[performance] rendered row count: ${renderedRowCount}`);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [loading, items.length]);

  useEffect(() => {
    let ignore = false;

    getContentCategories()
      .then((response) => {
        if (ignore) {
          return;
        }

        setCategories(response);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);

      if (nextSelectedIds.has(id)) {
        nextSelectedIds.delete(id);
      } else {
        nextSelectedIds.add(id);
      }

      return nextSelectedIds;
    });
  }, []);

  const handleSearch = () => {
    updateQuery((currentQuery) => ({
      ...currentQuery,
      keyword: keywordInput.trim(),
    }));
  };

  const handleReset = () => {
    setKeywordInput('');
    updateQuery(() => defaultQuery);
  };

  const handleBatchUpdateStatus = async (status: ContentStatus) => {
    if (selectedIdList.length === 0) {
      return;
    }

    setOperating(true);
    setLoading(true);

    try {
      await batchUpdateContentStatus({
        ids: selectedIdList,
        status,
      });

      await loadContentList();
    } finally {
      setOperating(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIdList.length === 0) {
      return;
    }

    const confirmed = window.confirm(`确认删除选中的 ${selectedIdList.length} 条内容吗？`);

    if (!confirmed) {
      return;
    }

    setOperating(true);
    setLoading(true);

    try {
      await batchDeleteContent({
        ids: selectedIdList,
      });

      await loadContentList();
    } finally {
      setOperating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_160px_160px_160px_140px_auto]">
          <input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="搜索标题或创作者"
            className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <select
            value={query.category}
            onChange={(event) =>
              updateQuery((currentQuery) => ({
                ...currentQuery,
                category: event.target.value,
              }))
            }
            className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          >
            <option value="all">全部分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={query.status}
            onChange={(event) =>
              updateQuery((currentQuery) => ({
                ...currentQuery,
                status: event.target.value as ContentStatus | 'all',
              }))
            }
            className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={query.sortBy}
            onChange={(event) =>
              updateQuery((currentQuery) => ({
                ...currentQuery,
                sortBy: event.target.value as ContentSortField,
              }))
            }
            className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          >
            {sortFieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                按{option.label}排序
              </option>
            ))}
          </select>
          <select
            value={query.sortOrder}
            onChange={(event) =>
              updateQuery((currentQuery) => ({
                ...currentQuery,
                sortOrder: event.target.value as SortOrder,
              }))
            }
            className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
          >
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>

          <div className="flex gap-2">
            <Button type="button" onClick={handleSearch}>
              搜索
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-400">
          共 <span className="text-slate-100">{total.toLocaleString()}</span> 条内容，当前加载{' '}
          <span className="text-slate-100">{items.length.toLocaleString()}</span> 条，已选{' '}
          <span className="text-slate-100">{selectedIds.size}</span> 条。
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={selectedIds.size === 0 || operating}
            onClick={() => handleBatchUpdateStatus('published')}
          >
            批量发布
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={selectedIds.size === 0 || operating}
            onClick={() => handleBatchUpdateStatus('offline')}
          >
            批量下架
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={selectedIds.size === 0 || operating}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <ContentListSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="暂无内容数据"
          description="当前筛选条件下没有匹配的视频内容，请调整关键词、分类或状态后重试。"
        />
      ) : (
        <ContentVirtualList
          items={items}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onOpenDetail={setActiveContent}
        />
      )}

      <ContentDetailDrawer
        content={activeContent}
        open={Boolean(activeContent)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveContent(null);
          }
        }}
      />
    </div>
  );
}
