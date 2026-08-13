import { useState, useEffect } from "react";
import { api, API_URL } from "./api";

/**
 * Live site settings managed from /admin, with the static `data.js` values as
 * the fallback so the page still renders if the API is down.
 */
export function useSettings(fallback) {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    let active = true;
    api
      .getSettings()
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

/** Uploaded files are served by the API, bundled ones by Vite. */
export const assetUrl = (path) =>
  path?.startsWith("/uploads") ? `${API_URL}${path}` : path;
