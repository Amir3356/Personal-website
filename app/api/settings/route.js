import { settingsService } from '@/lib/services/settingsService';
import { ok, handle } from '@/lib/api-helpers';

export const GET = handle(async () => ok(await settingsService.get()));
