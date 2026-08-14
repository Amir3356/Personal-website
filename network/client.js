/**
 * Thin API client. Keeps the base URL in one place so the admin screens don't
 * each hand-roll fetch calls.
 *
 * Auth is session-based: the server sets an httpOnly cookie that the browser
 * attaches automatically, so there's no token for this module to hold.
 */

/**
 * Empty on purpose: requests go to same-origin paths and the dev server proxies
 * them to the API (see vite.config.js). That keeps the session cookie
 * first-party — pointing this at http://localhost:5000 makes every admin
 * request cross-site and the browser silently drops the cookie.
 */
export const API_URL = "";

/** Thrown for non-2xx responses so callers can show the server's message. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, raw } = {}) {
  const headers = {};
  if (body && !raw) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    // Required for the session cookie to travel cross-origin.
    credentials: "include",
    body: raw ? body : body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }

  return data;
}

export { request };
