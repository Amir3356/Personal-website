import fs from 'fs';
import path from 'path';
import { DATA_FILE } from '../config/index.js';

/**
 * The single point of contact with data.json. Every repository goes through
 * these two helpers, so swapping in a real database later means rewriting this
 * file rather than hunting for `fs` calls across the codebase.
 */

const EMPTY = { experience: [], projects: [], messages: [], settings: {} };

export const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return { ...EMPTY };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

export const writeData = (data) => {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

/** Read, mutate via `mutator`, write back — used by every write operation. */
export const updateData = (mutator) => {
  const data = readData();
  const result = mutator(data);
  writeData(data);
  return result;
};
