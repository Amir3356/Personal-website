/**
 * Thin API client. Keeps the base URL and the auth token in one place so the
 * admin screens don't each hand-roll fetch calls.
 */

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Thrown for non-2xx responses so callers can show the server's message. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = false, raw } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body && !raw) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
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
    // An expired token should drop the session rather than leave a dead one behind.
    if (res.status === 401 && auth) clearToken();
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/api/auth/me", { auth: true }),

  getExperience: () => request("/api/experience"),
  createExperience: (body) => request("/api/experience", { method: "POST", body, auth: true }),
  updateExperience: (id, body) => request(`/api/experience/${id}`, { method: "PUT", body, auth: true }),
  deleteExperience: (id) => request(`/api/experience/${id}`, { method: "DELETE", auth: true }),

  getProjects: () => request("/api/projects"),
  createProject: (body) => request("/api/projects", { method: "POST", body, auth: true }),
  updateProject: (id, body) => request(`/api/projects/${id}`, { method: "PUT", body, auth: true }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: "DELETE", auth: true }),

  sendMessage: (body) => request("/api/messages", { method: "POST", body }),
  getMessages: () => request("/api/messages", { auth: true }),
  markMessageRead: (id, read) =>
    request(`/api/messages/${id}`, { method: "PATCH", body: { read }, auth: true }),
  deleteMessage: (id) => request(`/api/messages/${id}`, { method: "DELETE", auth: true }),

  getSettings: () => request("/api/settings"),
  updateHero: (body) => request("/api/settings/hero", { method: "PUT", body, auth: true }),
  updateContact: (body) => request("/api/settings/contact", { method: "PUT", body, auth: true }),

  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("/api/upload", { method: "POST", body: form, auth: true, raw: true });
  },
};
