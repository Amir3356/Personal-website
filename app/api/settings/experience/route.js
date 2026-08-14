import { settingsService } from '@/lib/services/settingsService';
import { ok, withAuth } from '@/lib/api-helpers';

export const PUT = withAuth(async (request) =>
  ok(await settingsService.updateExperience(await request.json()))
);
