import { request } from '@/lib/request';
import type {
  AudienceDemographics,
  AudienceKeyword,
  AudienceOverview,
  AudienceRegion,
  AudienceRegionDetail,
} from '@/types/audience';

export function getAudienceOverview() {
  return request<AudienceOverview>('/api/audience/overview', {
    method: 'GET',
  });
}

export function getAudienceDemographics() {
  return request<AudienceDemographics>('/api/audience/demographics', {
    method: 'GET',
  });
}

export function getAudienceRegions() {
  return request<AudienceRegion[]>('/api/audience/regions', {
    method: 'GET',
  });
}

export function getAudienceKeywords() {
  return request<AudienceKeyword[]>('/api/audience/keywords', {
    method: 'GET',
  });
}

export function getAudienceRegionDetail(regionId: string) {
  return request<AudienceRegionDetail>(`/api/audience/regions/${regionId}`, {
    method: 'GET',
  });
}
