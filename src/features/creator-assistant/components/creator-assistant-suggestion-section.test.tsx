import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { AssistantSuggestion } from '@/types/creator-assistant';

import { CreatorAssistantSuggestionSection } from './creator-assistant-suggestion-section';

const mockSuggestions: AssistantSuggestion[] = [
  {
    id: 'suggestion_1',
    title: '加大娱乐内容供给',
    type: 'category',
    priority: 'high',
    reason: '娱乐类内容当前趋势分最高，播放量和互动表现都较突出。',
    action: '优先选择高互动选题，扶持同类创作者持续发布。',
  },
  {
    id: 'suggestion_2',
    title: '优先选择晚间发布',
    type: 'publish_time',
    priority: 'medium',
    reason: '晚间时段历史平均播放量较高。',
    action: '建议将重点内容安排在晚间高活跃时间段发布。',
  },
];

describe('CreatorAssistantSuggestionSection', () => {
  it('renders suggestion section', () => {
    render(<CreatorAssistantSuggestionSection suggestions={mockSuggestions} />);

    expect(screen.getByText('创作建议清单')).toBeInTheDocument();

    expect(screen.getAllByText('加大娱乐内容供给').length).toBeGreaterThan(0);

    expect(
      screen.getByRole('button', {
        name: /优先选择晚间发布/,
      }),
    ).toBeInTheDocument();
  });

  it('shows first suggestion detail by default', () => {
    render(<CreatorAssistantSuggestionSection suggestions={mockSuggestions} />);

    expect(screen.getByText('当前建议')).toBeInTheDocument();

    expect(
      screen.getAllByText('优先选择高互动选题，扶持同类创作者持续发布。').length,
    ).toBeGreaterThan(0);
  });

  it('updates detail after clicking another suggestion', async () => {
    const user = userEvent.setup();

    render(<CreatorAssistantSuggestionSection suggestions={mockSuggestions} />);

    await user.click(
      screen.getByRole('button', {
        name: /优先选择晚间发布/,
      }),
    );

    expect(
      await screen.findByText('建议将重点内容安排在晚间高活跃时间段发布。'),
    ).toBeInTheDocument();
  });
});
