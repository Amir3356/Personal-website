/** Turns thrown AppErrors into JSON responses; anything else is a 500. */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({ message: err.message || 'Something went wrong' });
}

/** Unmatched routes land here rather than returning Express's HTML page. */
export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
}
