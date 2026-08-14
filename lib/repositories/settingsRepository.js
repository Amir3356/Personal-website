import { readData, updateData } from './dataStore.js';

/** Settings is a single object rather than a collection, so it stands alone. */
export const settingsRepository = {
  get: async () => (await readData()).settings || {},

  updateSection: (section, patch) =>
    updateData((data) => {
      data.settings = data.settings || {};
      data.settings[section] = { ...(data.settings[section] || {}), ...patch };
      return data.settings[section];
    }),
};
