import { authService } from '../services/authService.js';
import { ok, message } from '../handlers/responseHandler.js';
import { SESSION_COOKIE } from '../config/index.js';

export const authController = {
  login(req, res, next) {
    const { email, password } = req.body || {};

    let user;
    try {
      user = authService.verifyCredentials(email, password);
    } catch (err) {
      return next(err);
    }

    // New session id on login so a pre-existing one can't be fixated.
    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.user = user;
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        ok(res, { email: user.email });
      });
    });
  },

  me(req, res) {
    if (req.session?.user) {
      ok(res, { email: req.session.user.email });
    } else {
      ok(res, { email: null });
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie(SESSION_COOKIE);
      message(res, 'Signed out');
    });
  },
};
