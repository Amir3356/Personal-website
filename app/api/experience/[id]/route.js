import { experienceService } from '@/lib/services/experienceService';
import { ok, withAuth } from '@/lib/api-helpers';

export const PUT = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(await experienceService.update(id, await request.json()));
});

export const DELETE = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(await experienceService.remove(id));
});
