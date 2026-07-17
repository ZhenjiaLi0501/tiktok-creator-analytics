import { formatCompactNumber, formatPercent } from '@/lib/format';

export type ChartTooltipFormatter = (params: unknown) => string;

type TooltipParam = {
  axisValue?: string | number;
  axisValueLabel?: string;
  name?: string;
  seriesName?: string;
  marker?: string;
  value?: unknown;
  percent?: number;
  data?: unknown;
};

type PieTooltipExtraField = {
  key: string;
  label: string;
  formatter?: (value: number) => string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTooltipParam(value: unknown): value is TooltipParam {
  return isRecord(value);
}

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    const numberValue = value.find((item) => typeof item === 'number' && Number.isFinite(item));

    return typeof numberValue === 'number' ? numberValue : null;
  }

  return null;
}

function getParamNumber(param: TooltipParam) {
  const valueNumber = toNumber(param.value);

  if (valueNumber !== null) {
    return valueNumber;
  }

  if (isRecord(param.data)) {
    return toNumber(param.data.value);
  }

  return toNumber(param.data);
}

function renderTooltipContainer(title: string, rows: string[]) {
  return `
    <div style="min-width: 150px;">
      <div style="margin-bottom: 8px; color: #e2e8f0; font-size: 13px; font-weight: 600;">
        ${escapeHtml(title)}
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        ${rows.join('')}
      </div>
    </div>
  `;
}

function renderTooltipRow(marker: string | undefined, label: string, value: string) {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
      <span style="display: inline-flex; align-items: center; gap: 6px; color: #94a3b8;">
        ${marker ?? ''}
        <span>${escapeHtml(label)}</span>
      </span>
      <span style="color: #f8fafc; font-weight: 600;">${escapeHtml(value)}</span>
    </div>
  `;
}

export function createAxisTooltipFormatter(
  valueFormatter: (value: number) => string = formatCompactNumber,
): ChartTooltipFormatter {
  return (params) => {
    const list = Array.isArray(params) ? params.filter(isTooltipParam) : [];

    if (list.length === 0) {
      return '';
    }

    const firstItem = list[0];
    const title = String(firstItem.axisValueLabel ?? firstItem.axisValue ?? '');

    const rows = list.map((item) => {
      const value = getParamNumber(item);

      return renderTooltipRow(
        item.marker,
        item.seriesName ?? '',
        value === null ? '--' : valueFormatter(value),
      );
    });

    return renderTooltipContainer(title, rows);
  };
}

export function createPieTooltipFormatter({
  valueLabel = '数值',
  extraFields = [],
}: {
  valueLabel?: string;
  extraFields?: PieTooltipExtraField[];
} = {}): ChartTooltipFormatter {
  return (params) => {
    if (!isTooltipParam(params)) {
      return '';
    }

    const title = String(params.name ?? '');
    const value = getParamNumber(params);

    const rows = [
      renderTooltipRow(
        params.marker,
        valueLabel,
        value === null ? '--' : formatCompactNumber(value),
      ),
    ];

    if (typeof params.percent === 'number') {
      rows.push(renderTooltipRow(undefined, '占比', formatPercent(params.percent, 1)));
    }

    if (isRecord(params.data)) {
      extraFields.forEach((field) => {
        const fieldValue = toNumber((params.data as Record<string, unknown>)[field.key]);

        rows.push(
          renderTooltipRow(
            undefined,
            field.label,
            fieldValue === null ? '--' : (field.formatter ?? formatCompactNumber)(fieldValue),
          ),
        );
      });
    }

    return renderTooltipContainer(title, rows);
  };
}
