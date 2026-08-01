import audienceDemographicsJson from '../../../data/processed/audience-demographics.json';
import audienceKeywordsJson from '../../../data/processed/audience-keywords.json';
import audienceOverviewJson from '../../../data/processed/audience-overview.json';
import audienceRegionDetailsJson from '../../../data/processed/audience-region-details.json';
import audienceRegionsJson from '../../../data/processed/audience-regions.json';

import type {
  AudienceDemographics,
  AudienceKeyword,
  AudienceOverview,
  AudienceRegion,
  AudienceRegionDetail,
} from '@/types/audience';

const audienceOverview = audienceOverviewJson as AudienceOverview;
const audienceDemographics = audienceDemographicsJson as AudienceDemographics;
const audienceRegions = audienceRegionsJson as AudienceRegion[];
const audienceKeywords = audienceKeywordsJson as AudienceKeyword[];
const audienceRegionDetails = audienceRegionDetailsJson as Record<string, AudienceRegionDetail>;

export function getAudienceOverviewMock() {
  return audienceOverview;
}

export function getAudienceDemographicsMock() {
  return audienceDemographics;
}

export function getAudienceRegionsMock() {
  return audienceRegions;
}

export function getAudienceKeywordsMock() {
  return audienceKeywords;
}

export function getAudienceRegionDetailMock(regionId: string) {
  return audienceRegionDetails[regionId] ?? null;
}
