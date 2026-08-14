import { messageService } from '@/lib/services/messageService';
import { ok, created, handle, withAuth } from '@/lib/api-helpers';

// Public: anyone submitting the portfolio contact form.
export const POST = handle(async (request) =>
  created(await messageService.create(await request.json()))
);

// Reading the inbox is admin-only.
export const GET = withAuth(async () => ok(messageService.list()));
