import dashboardCategoriesJson from '../../../data/processed/dashboard-categories.json';
import dashboardOverviewJson from '../../../data/processed/dashboard-overview.json';
import dashboardPublishTrendJson from '../../../data/processed/dashboard-publish-trend.json';
import dashboardTrendJson from '../../../data/processed/dashboard-trend.json';

import type {
  DashboardCategoryItem,
  DashboardDateRange,
  DashboardPublishTrendPoint,
  DashboardTrendPoint,
  PlatformOverview,
} from '@/types/dashboard';

const fallbackDateRange: DashboardDateRange = '7d';

const dashboardOverviewByRange = dashboardOverviewJson as Record<
  DashboardDateRange,
  PlatformOverview
>;

const dashboardTrendByRange = dashboardTrendJson as Record<
  DashboardDateRange,
  DashboardTrendPoint[]
>;

const dashboardCategoriesByRange = dashboardCategoriesJson as Record<
  DashboardDateRange,
  DashboardCategoryItem[]
>;

const dashboardPublishTrendByRange = dashboardPublishTrendJson as Record<
  DashboardDateRange,
  DashboardPublishTrendPoint[]
>;

function normalizeDateRange(dateRange: DashboardDateRange) {
  if (dashboardOverviewByRange[dateRange]) {
    return dateRange;
  }

  return fallbackDateRange;
}

export function createPlatformOverviewMock(dateRange: DashboardDateRange = fallbackDateRange) {
  const normalizedDateRange = normalizeDateRange(dateRange);

  return dashboardOverviewByRange[normalizedDateRange];
}

export function createDashboardTrendMock(dateRange: DashboardDateRange = fallbackDateRange) {
  const normalizedDateRange = normalizeDateRange(dateRange);

  return dashboardTrendByRange[normalizedDateRange] ?? [];
}

export function createDashboardCategoryMock(dateRange: DashboardDateRange = fallbackDateRange) {
  const normalizedDateRange = normalizeDateRange(dateRange);

  return dashboardCategoriesByRange[normalizedDateRange] ?? [];
}

export function createDashboardPublishTrendMock(dateRange: DashboardDateRange = fallbackDateRange) {
  const normalizedDateRange = normalizeDateRange(dateRange);

  return dashboardPublishTrendByRange[normalizedDateRange] ?? [];
}
