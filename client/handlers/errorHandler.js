import { ApiError } from "@/network/client";

/**
 * Turns whatever a failed request threw into a message worth showing a user.
 * Keeps components from each inventing their own error copy.
 */
export function toMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (error instanceof ApiError) {
    // The server's message is written for humans; prefer it when present.
    if (error.message) return error.message;
    if (error.status === 401) return "Your session expired. Please sign in again.";
    if (error.status === 404) return "That item no longer exists.";
    if (error.status >= 500) return "The server had a problem. Please try again.";
  }

  // A dead server surfaces as a TypeError from fetch, not an ApiError.
  if (error instanceof TypeError) {
    return "Can't reach the server. Is it running?";
  }

  return error.message || fallback;
}

/** True when the failure means the admin session is gone. */
export const isAuthError = (error) => error instanceof ApiError && error.status === 401;

/**
 * Wraps an async action so callers get `[result, errorMessage]` instead of
 * writing the same try/catch in every panel.
 */
export async function attempt(action, fallback) {
  try {
    return [await action(), null];
  } catch (error) {
    return [null, toMessage(error, fallback)];
  }
}
