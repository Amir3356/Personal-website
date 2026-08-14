/**
 * Lets services signal an HTTP outcome without importing `res`. The error
 * handler turns these into the right status code.
 */
export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export const notFound = (what) => new AppError(`${what} not found`, 404);
