'use client';

import { BaseTable, type BaseTableColumn } from '@/components/business/base-table';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { Pagination } from '@/components/business/pagination';
import { Button } from '@/components/ui/button';
import { DetailDrawer } from '@/components/business/detail-drawer';

type CreatorPreview = {
  id: string;
  name: string;
  type: 'personal' | 'mcn' | 'brand';
  category: string;
  fansCount: number;
  videoCount: number;
  totalPlayCount: number;
  engagementRate: number;
  status: 'active' | 'inactive' | 'risk';
};

const creatorRows: CreatorPreview[] = [
  {
    id: 'creator_001',
    name: '美食观察所',
    type: 'mcn',
    category: '美食',
    fansCount: 1280000,
    videoCount: 342,
    totalPlayCount: 98650000,
    engagementRate: 8.6,
    status: 'active',
  },
  {
    id: 'creator_002',
    name: '科技前线',
    type: 'personal',
    category: '科技',
    fansCount: 860000,
    videoCount: 215,
    totalPlayCount: 54320000,
    engagementRate: 7.9,
    status: 'active',
  },
  {
    id: 'creator_003',
    name: '城市旅行家',
    type: 'brand',
    category: '旅行',
    fansCount: 620000,
    videoCount: 188,
    totalPlayCount: 38600000,
    engagementRate: 6.8,
    status: 'inactive',
  },
];

const creatorTypeTextMap: Record<CreatorPreview['type'], string> = {
  personal: '个人',
  mcn: 'MCN',
  brand: '品牌',
};

const statusTextMap: Record<CreatorPreview['status'], string> = {
  active: '活跃',
  inactive: '低活跃',
  risk: '风险',
};

const statusVariantMap: Record<CreatorPreview['status'], 'default' | 'secondary' | 'destructive'> =
  {
    active: 'default',
    inactive: 'secondary',
    risk: 'destructive',
  };
export function CreatorTablePreview() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCreator, setSelectedCreator] = useState<CreatorPreview | null>(null);

  const columns: BaseTableColumn<CreatorPreview>[] = [
    {
      key: 'name',
      title: '创作者',
      width: '220px',
      render: (row) => (
        <div>
          <div className="font-medium text-white">{row.name}</div>
          <div className="mt-1 text-xs text-slate-500">ID: {row.id}</div>
        </div>
      ),
    },
    {
      key: 'type',
      title: '类型',
      render: (row) => <Badge variant="secondary">{creatorTypeTextMap[row.type]}</Badge>,
    },
    {
      key: 'category',
      title: '内容分类',
      render: (row) => row.category,
    },
    {
      key: 'fansCount',
      title: '粉丝数',
      align: 'right',
      render: (row) => row.fansCount.toLocaleString(),
    },
    {
      key: 'videoCount',
      title: '视频数',
      align: 'right',
      render: (row) => row.videoCount.toLocaleString(),
    },
    {
      key: 'totalPlayCount',
      title: '总播放量',
      align: 'right',
      render: (row) => row.totalPlayCount.toLocaleString(),
    },
    {
      key: 'engagementRate',
      title: '互动率',
      align: 'right',
      render: (row) => `${row.engagementRate}%`,
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      render: (row) => (
        <Badge variant={statusVariantMap[row.status]}>{statusTextMap[row.status]}</Badge>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          className="border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          onClick={() => {
            setSelectedCreator(row);
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return creatorRows.slice(start, end);
  }, [currentPage, pageSize]);

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-4">
      <BaseTable columns={columns} data={currentRows} rowKey="id" />

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={creatorRows.length}
        pageSizeOptions={[5, 10, 20]}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <DetailDrawer
        open={Boolean(selectedCreator)}
        title={selectedCreator?.name ?? '创作者详情'}
        description="展示当前创作者的基础数据表现。"
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCreator(null);
          }
        }}
      >
        {selectedCreator ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm text-slate-400">创作者 ID</div>
              <div className="mt-2 text-white">{selectedCreator.id}</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-slate-400">创作者类型</div>
                <div className="mt-2 text-white">{creatorTypeTextMap[selectedCreator.type]}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-slate-400">内容分类</div>
                <div className="mt-2 text-white">{selectedCreator.category}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-slate-400">粉丝数</div>
                <div className="mt-2 text-white">{selectedCreator.fansCount.toLocaleString()}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-slate-400">视频数</div>
                <div className="mt-2 text-white">{selectedCreator.videoCount.toLocaleString()}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-slate-400">总播放量</div>
                <div className="mt-2 text-white">
                  {selectedCreator.totalPlayCount.toLocaleString()}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-slate-400">互动率</div>
                <div className="mt-2 text-white">{selectedCreator.engagementRate}%</div>
              </div>
            </div>
          </div>
        ) : null}
      </DetailDrawer>
    </div>
  );
}
