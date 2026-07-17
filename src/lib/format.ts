function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
}

export function formatInteger(value: number) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return new Intl.NumberFormat('zh-CN').format(value);
}

export function formatDecimal(value: number, fractionDigits = 1) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return trimTrailingZeros(value.toFixed(fractionDigits));
}

export function formatCompactNumber(value: number, fractionDigits = 1) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  const absValue = Math.abs(value);

  if (absValue >= 100000000) {
    return `${formatDecimal(value / 100000000, fractionDigits)}亿`;
  }

  if (absValue >= 10000) {
    return `${formatDecimal(value / 10000, fractionDigits)}万`;
  }

  return formatInteger(value);
}

export function formatPercent(value: number, fractionDigits = 2) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return `${formatDecimal(value, fractionDigits)}%`;
}

export function formatSignedPercent(value: number, fractionDigits = 1) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  const sign = value > 0 ? '+' : '';

  return `${sign}${formatPercent(value, fractionDigits)}`;
}
