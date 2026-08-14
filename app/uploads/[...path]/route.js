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

/**
 * Serves uploaded media. Files sit outside `public/` because Next only picks
 * that directory up at build time — anything written at runtime wouldn't be
 * served without a restart.
 */
export async function GET(request, { params }) {
  const { path: segments } = await params;

  // Resolve and confirm the result is still inside UPLOAD_DIR, so a crafted
  // "../../" path can't read arbitrary files off disk.
  const filePath = path.resolve(UPLOAD_DIR, ...segments);
  if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
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
