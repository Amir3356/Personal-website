import { readData, updateData } from './dataStore.js';

/**
 * CRUD over one named array inside data.json. Experience, projects and messages
 * all share this shape, so they share one implementation.
 */
export function createCollectionRepository(key) {
  return {
    findAll: () => readData()[key] || [],

    findById: (id) => (readData()[key] || []).find((item) => item.id === id) || null,

    create: (item, { prepend = false } = {}) =>
      updateData((data) => {
        data[key] = data[key] || [];
        if (prepend) data[key].unshift(item);
        else data[key].push(item);
        return item;
      }),

    update: (id, patch) =>
      updateData((data) => {
        data[key] = data[key] || [];
        const index = data[key].findIndex((item) => item.id === id);
        if (index === -1) return null;
        data[key][index] = { ...data[key][index], ...patch };
        return data[key][index];
      }),

    remove: (id) =>
      updateData((data) => {
        data[key] = data[key] || [];
        const before = data[key].length;
        data[key] = data[key].filter((item) => item.id !== id);
        return data[key].length < before;
      }),
  };
}
