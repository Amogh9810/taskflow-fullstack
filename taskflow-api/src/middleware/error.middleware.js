import logger from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
  logger.error('Unhandled error:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  const statusCode = error.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    error: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack }),
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
