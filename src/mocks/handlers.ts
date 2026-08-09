import { dashboardHandlers } from '@/mocks/handlers/dashboard';
import { contentHandlers } from '@/mocks/handlers/content';
import { audienceHandlers } from '@/mocks/handlers/audience';
import { creatorAssistantHandlers } from '@/mocks/handlers/creator-assistant';

export const handlers = [
  ...dashboardHandlers,
  ...contentHandlers,
  ...audienceHandlers,
  ...creatorAssistantHandlers,
];
