import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { AssistantCategoryTrend } from '@/types/creator-assistant';

import { CreatorAssistantCategoryTrendSection } from './creator-assistant-category-trend-section';

const mockTrends: AssistantCategoryTrend[] = [
  {
    category: '娱乐',
    videoCount: 1200,
    playCount: 86000000,
    likeCount: 3200000,
    commentCount: 460000,
    shareCount: 180000,
    avgEngagementRate: 5.6,
    trendScore: 92.3,
    trendStatus: 'rising',
    suggestion: '建议增加内容供给，优先扶持该分类创作者。',
  },
  {
    category: '生活',
    videoCount: 980,
    playCount: 62000000,
    likeCount: 2100000,
    commentCount: 300000,
    shareCount: 120000,
    avgEngagementRate: 4.8,
    trendScore: 68.5,
    trendStatus: 'stable',
    suggestion: '建议保持稳定更新，观察互动率变化。',
  },
];

describe('CreatorAssistantCategoryTrendSection', () => {
  it('renders category trend section', () => {
    render(<CreatorAssistantCategoryTrendSection trends={mockTrends} />);

    expect(screen.getByText('分类趋势分析')).toBeInTheDocument();
    expect(screen.getByText('娱乐')).toBeInTheDocument();
    expect(screen.getByText('生活')).toBeInTheDocument();
  });

  it('renders trend status and suggestion', () => {
    render(<CreatorAssistantCategoryTrendSection trends={mockTrends} />);

    expect(screen.getByText('快速上升')).toBeInTheDocument();
    expect(screen.getByText('稳定表现')).toBeInTheDocument();
    expect(screen.getByText('建议增加内容供给，优先扶持该分类创作者。')).toBeInTheDocument();
  });

  it('renders trend score', () => {
    render(<CreatorAssistantCategoryTrendSection trends={mockTrends} />);

    expect(screen.getByText('92.3')).toBeInTheDocument();
    expect(screen.getByText('68.5')).toBeInTheDocument();
  });
});
