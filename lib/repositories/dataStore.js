import fs from 'fs';
import path from 'path';
import { list, put } from '@vercel/blob';
import { DATA_FILE, DATA_BLOB_KEY, blobConfigured } from '../config.js';

/**
 * The single point of contact with the data store. Every repository goes through
 * these helpers, so swapping backends means rewriting this file rather than
 * hunting for `fs` calls across the codebase.
 *
 * Two backends, picked by whether a Blob store is linked:
 *
 * - Hosted (Vercel): the JSON document lives in Blob storage. The serverless
 *   filesystem is read-only, so `fs.writeFileSync` fails with EROFS and every
 *   mutating request 500s. Blob is also durable across deploys and instance
 *   recycling, which a written file never was.
 * - Local dev: plain `data/data.json` on disk, exactly as before, so the repo
 *   stays runnable with no cloud setup and no token.
 */

const EMPTY = { experience: [], projects: [], techstack: [], messages: [], settings: {} };

/**
 * Blob reads go through the CDN, which can serve a stale copy for a moment
 * after a write. Caching the document we just wrote keeps a read-after-write
 * within the same warm instance consistent. Module scope, so it lives exactly
 * as long as the instance does.
 */
let cache = null;

/** Resolve the blob's public URL by key; null when it hasn't been created yet. */
const findBlobUrl = async () => {
  const { blobs } = await list({ prefix: DATA_BLOB_KEY, limit: 1 });
  return blobs.find((blob) => blob.pathname === DATA_BLOB_KEY)?.url || null;
};

const readFromBlob = async () => {
  if (cache) return structuredClone(cache);

  const url = await findBlobUrl();
  // First run against a fresh store: nothing uploaded yet, so seed from the
  // repo's data.json when it's bundled, else start empty.
  if (!url) return readFromDisk();

  // `no-store` because Next's extended fetch cache would otherwise pin the
  // first response for the lifetime of the deployment.
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to read data blob: ${response.status}`);

  const data = await response.json();
  cache = structuredClone(data);
  return data;
};

const writeToBlob = async (data) => {
  await put(DATA_BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    // Same key every time — this is one mutable document, not a new upload.
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  cache = structuredClone(data);
};

const readFromDisk = () => {
  if (!fs.existsSync(DATA_FILE)) return { ...EMPTY };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const writeToDisk = (data) => {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

export const readData = async () => (blobConfigured ? readFromBlob() : readFromDisk());

export const writeData = async (data) =>
  blobConfigured ? writeToBlob(data) : writeToDisk(data);

/** Read, mutate via `mutator`, write back — used by every write operation. */
export const updateData = async (mutator) => {
  const data = await readData();
  const result = mutator(data);
  await writeData(data);
  return result;
};
