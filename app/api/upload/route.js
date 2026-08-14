import fs from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';
import { created, fail, withAuth } from '@/lib/api-helpers';
import { ALLOWED_UPLOADS, MAX_UPLOAD_BYTES, UPLOAD_DIR, blobConfigured } from '@/lib/config';

const ALLOWED_EXTENSIONS = Object.values(ALLOWED_UPLOADS);

// Buffering the whole file needs the Node runtime, not Edge.
export const runtime = 'nodejs';

/**
 * Replaces multer: Next route handlers parse multipart natively via the Web
 * FormData API, so the file arrives as a Blob we write ourselves.
 */
export const POST = withAuth(async (request) => {
  const form = await request.formData();
  const file = form.get('file');

  if (!file || typeof file === 'string') return fail('No file received');
  if (file.size > MAX_UPLOAD_BYTES) return fail('File too large');

  const original = path.extname(file.name || '').toLowerCase();

  // text/plain is allowed only to let .md through — a real .txt is not a CV.
  if (file.type.startsWith('text/') && original !== '.md') {
    return fail('Only .md is accepted for text files');
  }
  if (!ALLOWED_UPLOADS[file.type]) {
    return fail('Only PNG, JPG, WEBP, GIF, AVIF, PDF, DOC, DOCX or MD files are allowed');
  }

  // Never trust the client filename — build our own from a whitelisted
  // extension, preferring the original when it's one we allow (.md often
  // arrives as text/plain).
  const ext = ALLOWED_EXTENSIONS.includes(original) ? original : ALLOWED_UPLOADS[file.type];
  const filename = `file-${Date.now()}${ext}`;

  // Hosted: hand the bytes to Blob storage and keep the absolute URL it hands
  // back. `addRandomSuffix` stops a second upload in the same millisecond from
  // overwriting the first.
  if (blobConfigured) {
    const { url } = await put(`uploads/${filename}`, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: true,
    });
    return created({ url });
  }

  // Local dev: plain disk write, served back by app/uploads/[...path].
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer())
  );

  return created({ url: `/uploads/${filename}` });
});
