import { request } from "@/network/client";

export const techstackService = {
  list: () => request("/api/techstack"),
  create: (body) => request("/api/techstack", { method: "POST", body }),
  update: (id, body) => request(`/api/techstack/${id}`, { method: "PUT", body }),
  remove: (id) => request(`/api/techstack/${id}`, { method: "DELETE" }),
};
