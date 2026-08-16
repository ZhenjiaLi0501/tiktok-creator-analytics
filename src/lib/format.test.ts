import { describe, expect, it } from 'vitest';

import {
  formatCompactNumber,
  formatDecimal,
  formatInteger,
  formatPercent,
  formatSignedPercent,
} from './format';

describe('format utils', () => {
  it('formats integer with locale separators', () => {
    expect(formatInteger(1234567)).toBe('1,234,567');
  });

  it('formats decimal with fixed digits', () => {
    expect(formatDecimal(12.3456, 2)).toBe('12.35');
  });

  it('formats compact number with Chinese units', () => {
    expect(formatCompactNumber(999)).toBe('999');
    expect(formatCompactNumber(12000)).toBe('1.2万');
    expect(formatCompactNumber(230000000)).toBe('2.3亿');
  });

  it('formats percent value', () => {
    expect(formatPercent(12.345, 1)).toBe('12.3%');
  });

  it('formats signed percent value', () => {
    expect(formatSignedPercent(5.2)).toBe('+5.2%');
    expect(formatSignedPercent(-3.1)).toBe('-3.1%');
  });
});
