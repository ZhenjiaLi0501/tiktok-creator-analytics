import { dashboardHandlers } from '@/mocks/handlers/dashboard';
import { contentHandlers } from '@/mocks/handlers/content';
import { audienceHandlers } from '@/mocks/handlers/audience';

export const handlers = [...dashboardHandlers, ...contentHandlers, ...audienceHandlers];
