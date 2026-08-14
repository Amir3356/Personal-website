import { upload } from '../middlewares/upload.js';
import { created } from '../handlers/responseHandler.js';
import { AppError } from '../handlers/AppError.js';

export const uploadController = {
  /**
   * Runs multer inline so its errors (bad type, too large) reach the error
   * handler as clean 400s instead of bubbling up as unhandled failures.
   */
  single(req, res, next) {
    upload.single('file')(req, res, (err) => {
      // Filter rejections already carry a status; multer's own limit errors
      // (file too large) arrive as plain Errors, so give those one.
      if (err) return next(err.status ? err : new AppError(err.message, 400));
      if (!req.file) return next(new AppError('No file received', 400));
      created(res, { url: `/uploads/${req.file.filename}` });
    });
  },
};
