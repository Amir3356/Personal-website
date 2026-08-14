import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/authService';
import { createSessionToken, sessionCookieOptions } from '@/lib/auth';
import { handle } from '@/lib/api-helpers';
import { SESSION_COOKIE } from '@/lib/config';

export const POST = handle(async (request) => {
  const { email, password } = await request.json();
  const user = authService.verifyCredentials(email, password);

  const response = NextResponse.json({ email: user.email });
  response.cookies.set(SESSION_COOKIE, createSessionToken(user), sessionCookieOptions);
  return response;
});
