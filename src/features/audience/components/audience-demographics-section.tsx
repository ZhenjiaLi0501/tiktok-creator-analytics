import type { AudienceDemographics } from '@/types/audience';

import { AudienceDemographicChart } from './audience-demographic-chart';

type AudienceDemographicsSectionProps = {
  demographics: AudienceDemographics;
};

export function AudienceDemographicsSection({ demographics }: AudienceDemographicsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">基础画像分布</h2>
        <p className="mt-1 text-sm text-slate-400">展示中国区观众的性别、年龄和终端设备分布。</p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <AudienceDemographicChart title="性别分布" data={demographics.gender} chartType="pie" />

        <AudienceDemographicChart title="年龄分布" data={demographics.age} chartType="bar" />

        <AudienceDemographicChart title="终端分布" data={demographics.device} chartType="pie" />
      </div>
    </section>
  );
}
