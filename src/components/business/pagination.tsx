'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PageItem = number | 'left-ellipsis' | 'right-ellipsis';

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
};

function getTotalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'right-ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'left-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'left-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'right-ellipsis',
    totalPages,
  ];
}

export function Pagination({
  currentPage,
  pageSize,
  total,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const totalPages = getTotalPages(total, pageSize);
  const pageItems = getPageItems(currentPage, totalPages);

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange(page);
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
    >
      <div className="text-center text-sm text-slate-400 lg:text-left">
        <span className="sm:hidden">
          共 <span className="text-white">{total}</span> 条，第{' '}
          <span className="text-white">{currentPage}</span> /{' '}
          <span className="text-white">{totalPages}</span> 页
        </span>

        <span className="hidden sm:inline">
          共 <span className="text-white">{total}</span> 条数据，当前显示{' '}
          <span className="text-white">{start}</span> - <span className="text-white">{end}</span> 条
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-end">
        {onPageSizeChange ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>每页</span>

            <select
              value={pageSize}
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value));
              }}
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition hover:bg-white/[0.06]"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option} className="bg-douyin-dark text-white">
                  {option}
                </option>
              ))}
            </select>

            <span>条</span>
          </div>
        ) : null}

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          >
            上一页
          </Button>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-center text-xs text-slate-300 sm:hidden">
            {currentPage} / {totalPages}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {pageItems.map((item) => {
              if (item === 'left-ellipsis' || item === 'right-ellipsis') {
                return (
                  <span key={item} className="px-2 text-sm text-slate-500">
                    ...
                  </span>
                );
              }

              const isActive = item === currentPage;

              return (
                <Button
                  key={item}
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(item)}
                  className={cn(
                    'min-w-9',
                    isActive
                      ? 'bg-douyin-red text-white hover:bg-douyin-red/90'
                      : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
                  )}
                >
                  {item}
                </Button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
