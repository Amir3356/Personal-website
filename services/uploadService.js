import { request } from "@/network/client";
export const uploadService = {
  upload(file) {
    const form = new FormData();
    form.append("file", file);
    return request("/api/upload", { method: "POST", body: form, raw: true });
  },
};
