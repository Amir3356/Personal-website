import { techstackService } from '@/lib/services/techstackService';
import { ok, withAuth } from '@/lib/api-helpers';

export const PUT = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(await techstackService.update(id, await request.json()));
});

export const DELETE = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(await techstackService.remove(id));
});
