/**
 * Wraps a route handler so a thrown error reaches the error middleware instead
 * of crashing the request.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
