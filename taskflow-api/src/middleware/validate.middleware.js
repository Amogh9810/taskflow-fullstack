import logger from '../utils/logger.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.validatedBody = validated;
      next();
    } catch (error) {
      logger.error('Validation error:', error.errors);
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: formattedErrors,
      });
    }
  };
};
