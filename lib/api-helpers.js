import { NextResponse } from 'next/server';
import { getSession } from './auth';
import { AppError } from './handlers/AppError';

export const ok = (data) => NextResponse.json(data);
export const created = (data) => NextResponse.json(data, { status: 201 });
export const fail = (message, status = 400) => NextResponse.json({ message }, { status });

/**
 * Wraps a route handler so a thrown AppError becomes the right status instead
 * of an unhandled 500 — the Next equivalent of the Express error middleware.
 */
export const handle = (fn) => async (request, context) => {
  try {
    return await fn(request, context);
  } catch (error) {
    if (error instanceof AppError) return fail(error.message, error.status);
    console.error(error);
    return fail('Something went wrong', 500);
  }
};

/**
 * Guards a mutating route. Reads stay public so the portfolio renders without
 * signing in.
 */
export const withAuth = (fn) =>
  handle(async (request, context) => {
    const session = await getSession();
    if (!session) return fail('Authentication required', 401);
    return fn(request, { ...context, session });
  });
