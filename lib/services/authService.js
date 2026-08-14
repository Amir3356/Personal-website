import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config.js';
import { AppError } from '../handlers/AppError.js';

export const authService = {
  /** Returns the session user, or throws 401 for any bad credential. */
  verifyCredentials(email, password) {
    const emailOk =
      typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const passwordOk = typeof password === 'string' && password === ADMIN_PASSWORD;

    // Same message either way so the response can't be used to probe for a valid email.
    if (!emailOk || !passwordOk) {
      throw new AppError('Invalid email or password', 401);
    }

    return { email: ADMIN_EMAIL, role: 'admin' };
  },
};
