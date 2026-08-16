import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { AssistantTitleKeyword } from '@/types/creator-assistant';

import { CreatorAssistantTitleKeywordSection } from './creator-assistant-title-keyword-section';

const mockKeywords: AssistantTitleKeyword[] = [
  {
    word: '热点',
    count: 120,
    avgPlayCount: 860000,
    score: 100,
    type: 'structure',
    suggestion: '适合用于标题结构，提高点击预期。',
  },
  {
    word: '美食',
    count: 96,
    avgPlayCount: 720000,
    score: 82,
    type: 'interest',
    suggestion: '适合结合兴趣内容，提升用户触达。',
  },
  {
    word: '生活',
    count: 80,
    avgPlayCount: 610000,
    score: 70,
    type: 'category',
    suggestion: '适合结合垂类内容，强化内容定位。',
  },
];

describe('CreatorAssistantTitleKeywordSection', () => {
  it('renders title keyword analysis module', () => {
    render(<CreatorAssistantTitleKeywordSection keywords={mockKeywords} />);

    expect(screen.getByText('标题词频分析')).toBeInTheDocument();
    expect(screen.getByText('高频标题词云')).toBeInTheDocument();
    expect(screen.getByText('TOP 关键词明细')).toBeInTheDocument();
  });

  it('shows first keyword detail by default', () => {
    render(<CreatorAssistantTitleKeywordSection keywords={mockKeywords} />);

    expect(screen.getByText('当前选中关键词')).toBeInTheDocument();
    expect(screen.getByText('标题价值分 100')).toBeInTheDocument();

    expect(screen.getAllByText('适合用于标题结构，提高点击预期。').length).toBeGreaterThan(0);
  });

  it('updates detail panel after clicking another keyword', async () => {
    const user = userEvent.setup();

    render(<CreatorAssistantTitleKeywordSection keywords={mockKeywords} />);

    await user.click(screen.getAllByRole('button', { name: /美食/ })[0]);

    expect(await screen.findByText('标题价值分 82')).toBeInTheDocument();

    expect(screen.getAllByText('适合结合兴趣内容，提升用户触达。').length).toBeGreaterThan(0);
  });

  it('renders empty state when keywords are empty', () => {
    render(<CreatorAssistantTitleKeywordSection keywords={[]} />);

    expect(screen.getByText('暂无标题关键词数据。')).toBeInTheDocument();
  });
});
