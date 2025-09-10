import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { env } from '../config/env';

// This is the shape of our standardized error response
interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    stack?: string;
  };
}

/**
 * The global error handling middleware for the Express application.
 * It catches all errors and formats them into a standardized JSON response.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Use the status code from ApiError if available, otherwise default to 500
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  
  // Use the message from the error, or a generic message for server errors
  const message = err instanceof ApiError ? err.message : 'An unexpected internal server error occurred.';

  const response: ErrorResponse = {
    error: {
      statusCode,
      message,
    },
  };

  // Include stack trace in development for easier debugging
  if (env.NODE_ENV === 'development') {
    console.error('API Error:', err);
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};