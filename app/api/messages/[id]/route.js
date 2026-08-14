import { messageService } from '@/lib/services/messageService';
import { ok, withAuth } from '@/lib/api-helpers';

export const PATCH = withAuth(async (request, { params }) => {
  const { id } = await params;
  const { read } = await request.json();
  return ok(messageService.setRead(id, read));
});

export const DELETE = withAuth(async (request, { params }) => {
  const { id } = await params;
  return ok(messageService.remove(id));
});
