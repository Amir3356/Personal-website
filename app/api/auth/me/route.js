import { getSession } from '@/lib/auth';
import { ok, handle } from '@/lib/api-helpers';

/** Returns `{ email: null }` rather than 401 so the client can ask freely. */
export const GET = handle(async () => {
  const session = await getSession();
  return ok({ email: session?.email ?? null });
});
