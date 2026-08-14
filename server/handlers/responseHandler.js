/**
 * One place that decides what a success response looks like. Controllers call
 * these instead of `res.status(...).json(...)`, so the shape stays consistent
 * and can change in one edit.
 */

export const ok = (res, data) => res.json(data);

export const created = (res, data) => res.status(201).json(data);

export const message = (res, text) => res.json({ message: text });
