import { verifyToken } from '../utils/jwt.utils.js';
import logger from '../utils/logger.js';

export const verifyAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth verification failed:', error.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
