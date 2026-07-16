import { request } from '@/lib/request';
import type {
  DashboardCategoryItem,
  DashboardCategoryQuery,
  DashboardOverviewQuery,
  DashboardTrendPoint,
  DashboardTrendQuery,
  PlatformOverview,
} from '@/types/dashboard';

export async function getDashboardOverview(query?: DashboardOverviewQuery) {
  return request<PlatformOverview>('/api/dashboard/overview', {
    method: 'GET',
    query,
  });
}

export function getDashboardTrend(query?: DashboardTrendQuery) {
  return request<DashboardTrendPoint[]>('/api/dashboard/trend', {
    method: 'GET',
    query,
  });
}

export function getDashboardCategory(query?: DashboardCategoryQuery) {
  return request<DashboardCategoryItem[]>('/api/dashboard/category', {
    method: 'GET',
    query,
  });
}
