import crypto from 'crypto';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_MAX_AGE, SESSION_SECRET } from './config';

/**
 * Signed-cookie sessions.
 *
 * Route handlers have no persistent in-memory store, so the session lives in
 * the cookie itself: a base64 payload plus an HMAC. The signature means a
 * client can read the payload but can't forge or alter one.
 */

const sign = (value) =>
  crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');

/** Constant-time compare so a bad signature can't be guessed by timing. */
function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(payload) {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Date.now() + SESSION_MAX_AGE * 1000 })
  ).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function readSessionToken(token) {
  if (!token) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (!safeEqual(signature, sign(body))) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** The signed-in admin, or null. */
export async function getSession() {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true, // not readable from JavaScript
  sameSite: 'lax', // same-origin in Next, so lax is correct and safer
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE,
};
