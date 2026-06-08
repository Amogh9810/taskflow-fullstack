import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { errorHandler } from './middleware/error.middleware.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  })
);

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // limit each IP to 10 requests per windowMs on auth routes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

app.use(globalLimiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// API routes
const apiV1 = express.Router();

// Swagger docs
apiV1.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes with rate limiting
apiV1.use('/auth', authLimiter, authRoutes);

// Task routes
apiV1.use('/tasks', taskRoutes);

// Admin routes
apiV1.use('/admin', adminRoutes);

// Mount API v1
app.use('/api/v1', apiV1);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
