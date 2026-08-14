import { projectService } from '@/lib/services/projectService';
import { ok, withAuth } from '@/lib/api-helpers';

export const PUT = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(await projectService.update(id, await request.json()));
});

export const DELETE = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(await projectService.remove(id));
});
