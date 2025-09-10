import { Request, Response, NextFunction } from 'express';

// Define a type for our async route handlers
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * A wrapper for async route handlers to catch errors and pass them to the global error handler.
 * This avoids the need for repetitive try-catch blocks in every route.
 * @param fn The async route handler function.
 * @returns A new function that handles promise rejections.
 */
export const catchAsync = (fn: AsyncFunction) => (
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  }
);