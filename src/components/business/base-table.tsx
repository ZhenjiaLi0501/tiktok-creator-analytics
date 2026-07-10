import type { ReactNode } from 'react';
import { EmptyState } from '@/components/common/empty-state';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

export type BaseTableColumn<TData> = {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  render: (row: TData, index: number) => ReactNode;
};

type BaseTableRowKey<TData> = keyof TData | ((row: TData, index: number) => string | number);

type BaseTableProps<TData> = {
  columns: BaseTableColumn<TData>[];
  data: TData[];
  rowKey?: BaseTableRowKey<TData>;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

function getAlignClassName(align: BaseTableColumn<unknown>['align']) {
  if (align === 'center') {
    return 'text-center';
  }
  if (align === 'right') {
    return 'text-right';
  }
  return 'text-left';
}

function getRowKey<TData>(
  row: TData,
  rowKey: BaseTableRowKey<TData> | undefined,
  index: number,
): string | number {
  if (!rowKey) {
    return index;
  }
  if (typeof rowKey === 'function') {
    return rowKey(row, index);
  }
  const value = row[rowKey];
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return index;
}

export function BaseTable<TData>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyTitle = '暂无数据',
  emptyDescription = '当前没有可展示的数据',
  className,
}: BaseTableProps<TData>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={cn(
                    'px-4 py-3 font-medium text-slate-400',
                    getAlignClassName(column.align),
                    column.headerClassName,
                  )}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-white/10 last:border-b-0">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <Skeleton className="h-5 w-full bg-white/10" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowKey, rowIndex)}
                  className="border-b border-white/10 transition last:border-b-0 hover:bg-white/[0.04]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-4 text-slate-200',
                        getAlignClassName(column.align),
                        column.className,
                      )}
                    >
                      {column.render(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-6">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
