import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('text-sm', 'font-medium')).toBe('text-sm font-medium');
  });

  it('handles conditional class names', () => {
    expect(cn('base', false && 'hidden', true && 'active')).toBe('base active');
  });

  it('resolves tailwind class conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
