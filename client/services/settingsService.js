import { request } from "@/network/client";
export const settingsService = {
  get: () => request("/api/settings"),
  updateHero: (body) => request("/api/settings/hero", { method: "PUT", body }),
  updateExperience: (body) => request("/api/settings/experience", { method: "PUT", body }),
  updateContact: (body) => request("/api/settings/contact", { method: "PUT", body }),
};
