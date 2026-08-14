/**
 * Guards every mutating route. Read endpoints stay public so the portfolio
 * itself can fetch content without signing in.
 */
export function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  res.status(401).json({ message: 'Authentication required' });
}
