import { request } from "@/network/client";
export const projectService = {
  list: () => request("/api/projects"),
  create: (body) => request("/api/projects", { method: "POST", body }),
  update: (id, body) => request(`/api/projects/${id}`, { method: "PUT", body }),
  remove: (id) => request(`/api/projects/${id}`, { method: "DELETE" }),
};
