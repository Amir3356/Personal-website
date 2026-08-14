import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(path.dirname(__filename));

export const PORT = 5000;

export const DATA_FILE = path.join(ROOT, 'data', 'data.json');

/** Uploaded media lives with the server and is served from /uploads. */
export const UPLOAD_DIR = path.join(ROOT, 'uploads');

// Admin sign-in credentials.
export const ADMIN_EMAIL = 'amirsiraj1995@gmail.com';
export const ADMIN_PASSWORD = 'AEHJSS36';
export const SESSION_SECRET =
  'b7f3c1a9e24d8f60a5b3e91c7d42f8ae63b09d5172c4e8a3f7b16d90c58e2a4f1';

export const SESSION_COOKIE = 'admin.sid';
export const SESSION_MAX_AGE = 8 * 60 * 60 * 1000; // 8 hours

/** Origins allowed to send session cookies (the Vite dev server). */
export const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_UPLOADS = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  // Browsers report .md as text/markdown or text/plain depending on the OS.
  'text/markdown': '.md',
  'text/x-markdown': '.md',
  'text/plain': '.md',
};
