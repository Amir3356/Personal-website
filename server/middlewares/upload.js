import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { UPLOAD_DIR, ALLOWED_UPLOADS, MAX_UPLOAD_BYTES } from '../config/index.js';
import { AppError } from '../handlers/AppError.js';

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXTENSIONS = Object.values(ALLOWED_UPLOADS);

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    // Never trust the client filename — build our own from a whitelisted
    // extension. .md often arrives as text/plain, so prefer the original
    // extension when it's one we allow.
    filename: (req, file, cb) => {
      const original = path.extname(file.originalname).toLowerCase();
      const ext = ALLOWED_EXTENSIONS.includes(original)
        ? original
        : ALLOWED_UPLOADS[file.mimetype];
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    // AppError rather than Error, so a rejection carries its 400 all the way
    // to the error handler instead of being read as an unexpected 500.
    if (file.mimetype.startsWith('text/')) {
      return path.extname(file.originalname).toLowerCase() === '.md'
        ? cb(null, true)
        : cb(new AppError('Only .md is accepted for text files', 400));
    }
    if (ALLOWED_UPLOADS[file.mimetype]) return cb(null, true);
    cb(new AppError('Only PNG, JPG, WEBP, GIF, AVIF, PDF, DOC, DOCX or MD files are allowed', 400));
  },
});
