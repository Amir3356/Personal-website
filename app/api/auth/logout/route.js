import { NextResponse } from 'next/server';
import { handle } from '@/lib/api-helpers';
import { SESSION_COOKIE } from '@/lib/config';

export const POST = handle(async () => {
  const response = NextResponse.json({ message: 'Signed out' });
  response.cookies.delete(SESSION_COOKIE);
  return response;
});
