'use client';

import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatCompactNumber } from '@/lib/format';
import type { ContentVideo } from '@/types/content';
import Image from 'next/image';
import { useState } from 'react';

type ContentDetailDrawerProps = {
  content: ContentVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const statusTextMap: Record<ContentVideo['status'], string> = {
  published: '已发布',
  reviewing: '审核中',
  offline: '已下架',
};

function formatPublishTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-100">{value}</div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-100">{value}</div>
    </div>
  );
}

export function ContentDetailDrawer({ content, open, onOpenChange }: ContentDetailDrawerProps) {
  const [erroredCoverContentId, setErroredCoverContentId] = useState<string | null>(null);

  const isCoverUnavailable = !content?.coverUrl || erroredCoverContentId === content.id;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-slate-800 bg-slate-950 text-slate-100 sm:max-w-[520px]"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-100">内容详情</SheetTitle>
          <SheetDescription className="text-slate-400">
            查看视频基础信息、内容状态和核心运营数据。
          </SheetDescription>
        </SheetHeader>

        {content ? (
          <div className="mt-6 space-y-6">
            <div className="relative flex aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              {!isCoverUnavailable && content ? (
                <Image
                  src={content.coverUrl}
                  alt={content.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 520px"
                  className="object-cover"
                  unoptimized
                  onError={() => setErroredCoverContentId(content.id)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 px-6 text-center">
                  <div className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-300">
                    视频封面
                  </div>

                  <div className="mt-3 line-clamp-2 text-sm font-medium text-slate-200">
                    {content?.title ?? '暂无封面'}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    原始封面暂不可用，已使用占位封面展示
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-cyan-400/30 text-cyan-300">
                  {content.category}
                </Badge>

                <Badge variant="outline" className="border-slate-700 text-slate-300">
                  {statusTextMap[content.status]}
                </Badge>
              </div>

              <h3 className="line-clamp-3 text-lg font-semibold leading-7 text-slate-100">
                {content.title}
              </h3>

              <p className="text-sm text-slate-400">
                创作者：<span className="text-slate-200">{content.creatorName}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricItem label="播放量" value={formatCompactNumber(content.playCount)} />
              <MetricItem label="点赞量" value={formatCompactNumber(content.likeCount)} />
              <MetricItem label="评论量" value={formatCompactNumber(content.commentCount)} />
              <MetricItem label="分享量" value={formatCompactNumber(content.shareCount)} />
              <MetricItem label="互动率" value={`${content.engagmentRate.toFixed(2)}%`} />
              <MetricItem label="视频时长" value={formatDuration(content.duration)} />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <DetailItem label="内容 ID" value={content.id} />
              <DetailItem label="原始视频 ID" value={content.sourceVideoId} />
              <DetailItem label="发布时间" value={formatPublishTime(content.publishTime)} />
              <DetailItem label="数据地区" value={content.region} />
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
