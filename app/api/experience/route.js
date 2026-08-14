import { experienceService } from '@/lib/services/experienceService';
import { ok, created, handle, withAuth } from '@/lib/api-helpers';

// Reads are public so the portfolio renders without signing in.
export const GET = handle(async () => ok(await experienceService.list()));

export const POST = withAuth(async (request) =>
  created(await experienceService.create(await request.json()))
);
