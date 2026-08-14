import path from 'path';

const ROOT = process.cwd();

export const DATA_FILE = path.join(ROOT, 'data', 'data.json');

/** Uploads live outside `public/` so Next doesn't need a restart to serve them. */
export const UPLOAD_DIR = path.join(ROOT, 'uploads');

/**
 * Serverless hosts (Vercel) give each request a read-only, throwaway filesystem:
 * writing to UPLOAD_DIR fails with EROFS, and anything that did get written
 * would vanish when the instance is recycled. When a Blob store is configured
 * we upload there instead and keep the absolute URL it returns.
 *
 * The token is injected automatically once a Blob store is linked to the Vercel
 * project; locally it's absent, so uploads keep going to disk as before.
 */
export const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Admin sign-in credentials.
export const ADMIN_EMAIL = 'amirsiraj1995@gmail.com';
export const ADMIN_PASSWORD = 'AEHJSS36';
export const SESSION_SECRET =
  'b7f3c1a9e24d8f60a5b3e91c7d42f8ae63b09d5172c4e8a3f7b16d90c58e2a4f1';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 8 * 60 * 60; // seconds

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Gmail SMTP, used to forward contact-form submissions to the inbox.
 * Secrets come from `.env` (see `.env.example`) — SMTP_PASS must be a Google
 * App Password, not the account password. Missing values disable forwarding:
 * the message is still stored and shown in the admin inbox.
 */
export const SMTP = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  // 465 is implicit TLS; 587 upgrades via STARTTLS.
  secure: (Number(process.env.SMTP_PORT) || 465) === 465,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  // Where the notification lands; defaults to the sending account.
  to: process.env.CONTACT_TO || process.env.SMTP_USER || '',
};

export const smtpConfigured = Boolean(SMTP.user && SMTP.pass && SMTP.to);

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
