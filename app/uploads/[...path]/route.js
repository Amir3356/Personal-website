import fs from 'fs/promises';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/config';

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.md': 'text/markdown',
};

// Reading from disk needs the Node runtime, not Edge.
export const runtime = 'nodejs';

/**
 * Serves uploaded media in local development. Files sit outside `public/`
 * because Next only picks that directory up at build time — anything written at
 * runtime wouldn't be served without a restart.
 *
 * In production uploads live in Blob storage and are referenced by their own
 * absolute URL, so they never reach this handler. Only files committed to the
 * repo under `uploads/` are served here once deployed.
 */
export async function GET(request, { params }) {
  const { path: segments } = await params;

  // Resolve and confirm the result is still inside UPLOAD_DIR, so a crafted
  // "../../" path can't read arbitrary files off disk.
  // The trailing separator matters: without it a sibling directory whose name
  // merely starts with "uploads" would also pass the check.
  const root = path.resolve(UPLOAD_DIR);
  const filePath = path.resolve(root, ...segments);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        'Content-Type': CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
