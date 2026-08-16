'use client';
import { memo, useMemo } from 'react';
import { FixedSizeList, areEqual, type ListChildComponentProps } from 'react-window';

import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/format';
import type { ContentVideo } from '@/types/content';

type ContentVirtualListProps = {
  items: ContentVideo[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (item: ContentVideo) => void;
};

type RowData = {
  items: ContentVideo[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (item: ContentVideo) => void;
};

const statusTextMap: Record<ContentVideo['status'], string> = {
  published: '已发布',
  reviewing: '审核中',
  offline: '已下线',
};

const statusClassNameMap: Record<ContentVideo['status'], string> = {
  published: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  reviewing: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  offline: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
};
const contentTableMinWidth = 1280;
const contentTableGridTemplate = '44px minmax(360px,1.8fr) 140px 120px 120px 120px 110px 110px';

function formatPublishTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
}

function formatEngagmentRate(value: number) {
  return `${value.toFixed(2)}%`;
}

const ContentRow = memo(function ContentRow({
  index,
  style,
  data,
}: ListChildComponentProps<RowData>) {
  const item = data.items[index];
  const selected = data.selectedIds.has(item.id);

  return (
    <div style={style} className="px-3">
      <button
        type="button"
        aria-label={`查看内容详情: ${item.title}`}
        data-content-row="true"
        onClick={() => data.onOpenDetail(item)}
        style={{ gridTemplateColumns: contentTableGridTemplate }}
        className={cn(
          'grid h-[72px] w-full items-center gap-4 border-b border-slate-800 px-6 text-left text-sm transition-colors hover:bg-slate-900/70',
          selected && 'bg-slate-900',
        )}
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            aria-label={`选择内容: ${item.title}`}
            checked={selected}
            onChange={() => data.onToggleSelect(item.id)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-950"
          />
        </div>

        <div className="min-w-0">
          <div className="truncate font-medium text-slate-100">{item.title}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="truncate">{item.creatorName}</span>
            <span>·</span>
            <span>{formatDuration(item.duration)}</span>
          </div>
        </div>
        <div className="text-slate-300">{formatPublishTime(item.publishTime)}</div>
        <div className="text-right text-slate-200">{formatCompactNumber(item.playCount)}</div>
        <div className="text-right text-slate-200">{formatCompactNumber(item.likeCount)}</div>
        <div className="text-right text-slate-200">{formatCompactNumber(item.commentCount)}</div>
        <div className="text-right text-slate-200">{formatEngagmentRate(item.engagmentRate)}</div>
        <div>
          <span
            className={cn(
              'inline-flex rounded-full border px-2 py-1 text-xs',
              statusClassNameMap[item.status],
            )}
          >
            {statusTextMap[item.status]}
          </span>
        </div>
      </button>
    </div>
  );
}, areEqual);

export function ContentVirtualList({
  items,
  selectedIds,
  onToggleSelect,
  onOpenDetail,
}: ContentVirtualListProps) {
  const rowData = useMemo<RowData>(
    () => ({
      items,
      selectedIds,
      onToggleSelect,
      onOpenDetail,
    }),
    [items, selectedIds, onToggleSelect, onOpenDetail],
  );
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
      <div style={{ minWidth: contentTableMinWidth }}>
        <div
          style={{ gridTemplateColumns: contentTableGridTemplate }}
          className="grid h-12 items-center gap-4 border-b border-slate-800 px-6 text-xs font-medium text-slate-400"
        >
          <div />
          <div>内容</div>
          <div>发布时间</div>
          <div className="text-right">播放量</div>
          <div className="text-right">点赞量</div>
          <div className="text-right">评论量</div>
          <div className="text-right">互动率</div>
          <div>状态</div>
        </div>
        <FixedSizeList
          height={640}
          width="100%"
          itemCount={items.length}
          itemSize={72}
          itemData={rowData}
          overscanCount={8}
        >
          {ContentRow}
        </FixedSizeList>
      </div>
    </div>
  );
}
