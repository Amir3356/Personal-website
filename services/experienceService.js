import { request } from "@/network/client";

export const experienceService = {
  list: () => request("/api/experience"),
  create: (body) => request("/api/experience", { method: "POST", body }),
  update: (id, body) => request(`/api/experience/${id}`, { method: "PUT", body }),
  remove: (id) => request(`/api/experience/${id}`, { method: "DELETE" }),
};
