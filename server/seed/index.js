/**
 * Resets data.json to the baseline content.
 *
 *   npm run seed          # only if data.json is missing
 *   npm run seed -- --force   # overwrite whatever is there
 *
 * The default is deliberately non-destructive so a stray run can't wipe real
 * content.
 */
import fs from 'fs';
import { DATA_FILE } from '../config/index.js';
import { writeData } from '../repositories/dataStore.js';
import { seedData } from './seedData.js';

const force = process.argv.includes('--force');

if (fs.existsSync(DATA_FILE) && !force) {
  console.log('data.json already exists — nothing written.');
  console.log('Re-run with `npm run seed -- --force` to overwrite it.');
} else {
  writeData(seedData);
  console.log(`Seeded ${DATA_FILE}`);
}
