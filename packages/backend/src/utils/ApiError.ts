/**
 * A custom Error class for handling API-specific errors.
 * It includes an HTTP status code to be sent back to the client.
 */
class ApiError extends Error {
    public statusCode: number;
  
    constructor(statusCode: number, message: string, stack = '') {
      super(message);
      this.statusCode = statusCode;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default ApiError;