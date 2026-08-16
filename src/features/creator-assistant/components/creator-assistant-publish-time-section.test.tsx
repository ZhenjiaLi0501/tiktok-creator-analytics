import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { AssistantPublishTime } from '@/types/creator-assistant';

import { CreatorAssistantPublishTimeSection } from './creator-assistant-publish-time-section';

const mockPublishTimes: AssistantPublishTime[] = [
  {
    id: '5-20',
    weekday: 5,
    weekdayText: '周五',
    hour: 20,
    label: '周五 20:00',
    score: 92.5,
    avgPlayCount: 860000,
    avgEngagementRate: 6.35,
    sampleCount: 120,
    competitionLevel: 'medium',
    competitionText: '竞争适中',
    expectedPlayLift: 15.4,
    reason: '该时段历史平均播放表现较好，竞争适中，适合安排重点内容发布。',
  },
  {
    id: '6-21',
    weekday: 6,
    weekdayText: '周六',
    hour: 21,
    label: '周六 21:00',
    score: 84.2,
    avgPlayCount: 720000,
    avgEngagementRate: 5.8,
    sampleCount: 98,
    competitionLevel: 'low',
    competitionText: '竞争较低',
    expectedPlayLift: 12.1,
    reason: '该时段样本竞争度较低，适合作为备用发布时间。',
  },
];

describe('CreatorAssistantPublishTimeSection', () => {
  it('renders publish time recommendation section', () => {
    render(<CreatorAssistantPublishTimeSection publishTimes={mockPublishTimes} />);

    expect(screen.getByText('发布时间推荐')).toBeInTheDocument();
    expect(screen.getByText('周五 20:00')).toBeInTheDocument();
    expect(screen.getByText('周六 21:00')).toBeInTheDocument();
  });

  it('renders publish time metrics', () => {
    render(<CreatorAssistantPublishTimeSection publishTimes={mockPublishTimes} />);

    expect(screen.getAllByText('推荐分').length).toBeGreaterThan(0);
    expect(screen.getByText('92.5')).toBeInTheDocument();
    expect(screen.getByText('竞争适中')).toBeInTheDocument();
    expect(screen.getByText('15.4%')).toBeInTheDocument();
  });
});
