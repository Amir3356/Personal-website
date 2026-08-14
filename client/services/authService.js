import { request } from "@/network/client";

export const authService = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),
};
