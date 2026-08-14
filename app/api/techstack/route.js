import { techstackService } from '@/lib/services/techstackService';
import { ok, created, handle, withAuth } from '@/lib/api-helpers';

// Reads are public so the portfolio renders without signing in.
export const GET = handle(async () => ok(techstackService.list()));

export const POST = withAuth(async (request) =>
  created(techstackService.create(await request.json()))
);
