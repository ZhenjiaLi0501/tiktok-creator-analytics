export type AudienceMetricItem = {
  label: string;
  value: number;
};

export type AudienceOverview = {
  totalAudience: number;
  activeAudience: number;
  newAudience: number;
  avgWatchDuration: number;
  interactionRate: number;
  retentionRate: number;
  topRegion: string;
  regionCount: number;
};

export type AudienceDemographics = {
  gender: AudienceMetricItem[];
  age: AudienceMetricItem[];
  device: AudienceMetricItem[];
};

export type AudienceRegion = {
  id: string;
  name: string;
  city: string;
  lng: number;
  lat: number;
  audienceCount: number;
  activeRate: number;
  interactionRate: number;
  heat: number;
  topCategory: string;
  rank: number;
};

export type AudienceKeyword = {
  word: string;
  value: number;
  type: 'category' | 'interest';
};

export type AudienceRegionKeyword = {
  word: string;
  value: number;
};

export type AudienceRegionDetail = {
  regionId: string;
  regionName: string;
  city: string;
  audienceCount: number;
  activeRate: number;
  interactionRate: number;
  topCategory: string;
  gender: AudienceMetricItem[];
  age: AudienceMetricItem[];
  device: AudienceMetricItem[];
  keywords: AudienceRegionKeyword[];
};
