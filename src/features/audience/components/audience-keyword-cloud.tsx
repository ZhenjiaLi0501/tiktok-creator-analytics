'use client';

import * as d3 from 'd3';
import { useMemo } from 'react';

import type { AudienceKeyword } from '@/types/audience';

type AudienceKeywordCloudProps = {
  keywords: AudienceKeyword[];
  selectedKeyword: AudienceKeyword | null;
  onKeywordSelect: (keyword: AudienceKeyword) => void;
};

type KeywordNode = AudienceKeyword & {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotate: number;
};

const width = 760;
const height = 420;

const typeTextMap: Record<AudienceKeyword['type'], string> = {
  category: '内容分类',
  interest: '兴趣标签',
};

function buildKeywordNodes(keywords: AudienceKeyword[]): KeywordNode[] {
  if (keywords.length === 0) {
    return [];
  }

  const valueExtent = d3.extent(keywords, (keyword) => keyword.value);
  const minValue = valueExtent[0] ?? 0;
  const maxValue = valueExtent[1] ?? 1;

  const fontSizeScale = d3.scaleSqrt().domain([minValue, maxValue]).range([14, 44]);

  const colorScale = d3
    .scaleOrdinal<AudienceKeyword['type'], string>()
    .domain(['category', 'interest'])
    .range(['#ff3b70', '#22d3ee']);

  const centerX = width / 2;
  const centerY = height / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  return keywords.map((keyword, index) => {
    const radius = Math.sqrt(index) * 34;
    const angle = index * goldenAngle;

    return {
      ...keyword,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius * 0.72,
      fontSize: fontSizeScale(keyword.value),
      color: colorScale(keyword.type),
      rotate: index % 7 === 0 ? -12 : index % 5 === 0 ? 10 : 0,
    };
  });
}

export function AudienceKeywordCloud({
  keywords,
  selectedKeyword,
  onKeywordSelect,
}: AudienceKeywordCloudProps) {
  const keywordNodes = useMemo(() => buildKeywordNodes(keywords), [keywords]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="中国区观众兴趣关键词云"
        className="h-[420px] w-full"
      >
        <defs>
          <radialGradient id="keyword-cloud-bg" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          <filter id="keyword-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#keyword-cloud-bg)" />

        <circle cx={width / 2} cy={height / 2} r={150} fill="#0f172a" opacity={0.35} />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={210}
          fill="none"
          stroke="#1e293b"
          strokeDasharray="6 10"
          opacity={0.8}
        />

        {keywordNodes.map((node) => {
          const selected = selectedKeyword?.word === node.word;

          return (
            <g
              key={`${node.type}-${node.word}`}
              transform={`translate(${node.x}, ${node.y}) rotate(${node.rotate})`}
              className="cursor-pointer"
              onClick={() => onKeywordSelect(node)}
            >
              {selected ? (
                <rect
                  x={-(node.word.length * node.fontSize * 0.52) / 2 - 12}
                  y={-node.fontSize}
                  width={node.word.length * node.fontSize * 0.52 + 24}
                  height={node.fontSize + 16}
                  rx={12}
                  fill={node.color}
                  opacity={0.16}
                />
              ) : null}

              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={node.color}
                fontSize={node.fontSize}
                fontWeight={selected ? 800 : node.value > 60 ? 700 : 500}
                opacity={selected ? 1 : 0.82}
                filter={selected ? 'url(#keyword-glow)' : undefined}
                className="select-none transition-opacity hover:opacity-100"
              >
                {node.word}
              </text>

              {selected ? (
                <text
                  y={node.fontSize + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#94a3b8"
                  fontSize={11}
                  className="select-none"
                >
                  {typeTextMap[node.type]} · 热度 {node.value}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="flex items-center gap-4 border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff3b70]" />
          内容分类
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22d3ee]" />
          兴趣标签
        </div>

        <div className="ml-auto text-slate-500">字体越大，代表兴趣热度越高</div>
      </div>
    </div>
  );
}
