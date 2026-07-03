import { request } from '@/lib/request';
import type { DashboardOverviewQuery, PlatformOverview } from '@/types/dashboard';

export async function getDashboardOverview(query?: DashboardOverviewQuery) {
  return request<PlatformOverview>('/api/dashboard/overview', {
    method: 'GET',
    query,
  });
}
