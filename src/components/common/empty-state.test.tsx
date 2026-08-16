import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="暂无内容数据" description="当前筛选条件下没有匹配的视频内容。" />);

    expect(screen.getByText('暂无内容数据')).toBeInTheDocument();
    expect(screen.getByText('当前筛选条件下没有匹配的视频内容。')).toBeInTheDocument();
  });
});
