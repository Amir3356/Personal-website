import { request } from "@/network/client";
export const messageService = {
  send: (body) => request("/api/messages", { method: "POST", body }),
  list: () => request("/api/messages"),
  setRead: (id, read) => request(`/api/messages/${id}`, { method: "PATCH", body: { read } }),
  remove: (id) => request(`/api/messages/${id}`, { method: "DELETE" }),
};
