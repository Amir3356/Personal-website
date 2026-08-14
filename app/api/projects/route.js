import { projectService } from '@/lib/services/projectService';
import { ok, created, handle, withAuth } from '@/lib/api-helpers';

export const GET = handle(async () => ok(await projectService.list()));

export const POST = withAuth(async (request) =>
  created(await projectService.create(await request.json()))
);
