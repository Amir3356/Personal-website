"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/network/client";
import { settingsService } from "@/services";

/**
 * Live site settings managed from /admin, with the static `data.js` values as
 * the fallback so the page still renders if the API is down.
 */
export function useSettings(fallback) {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    let active = true;
    settingsService
      .get()
      .then((data) => {
        if (active) setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}

/**
 * Resolves a stored asset reference to something an <img src> can use.
 *
 * Files uploaded to Blob storage are already absolute URLs on another host, so
 * they must be handed back untouched — prefixing them would corrupt them.
 * Legacy `/uploads/...` paths stay relative and are served by the route handler.
 */
export const assetUrl = (path) => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/uploads") ? `${API_URL}${path}` : path;
};
