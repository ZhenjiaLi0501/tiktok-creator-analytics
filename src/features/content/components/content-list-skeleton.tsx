import { Skeleton } from '@/components/ui/skeleton';

const contentTableMinWidth = 1280;

const contentTableGridTemplate = '44px minmax(360px, 1.8fr) 140px 120px 120px 120px 110px 110px';

export function ContentListSkeleton() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
      <div
        style={{
          minWidth: contentTableMinWidth,
        }}
      >
        <div
          style={{
            gridTemplateColumns: contentTableGridTemplate,
          }}
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

        <div>
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              style={{
                gridTemplateColumns: contentTableGridTemplate,
              }}
              className="grid h-[72px] items-center gap-4 border-b border-slate-800 px-6"
            >
              <Skeleton className="h-4 w-4 rounded" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[45%]" />
              </div>

              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto h-4 w-16" />
              <Skeleton className="ml-auto h-4 w-16" />
              <Skeleton className="ml-auto h-4 w-16" />
              <Skeleton className="ml-auto h-4 w-14" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
