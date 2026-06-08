import express from 'express';
import { listUsers, listAllTasks } from './admin.controller.js';
import { verifyAuth, requireRole } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/users', verifyAuth, requireRole('ADMIN'), listUsers);

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: List all tasks across all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE, ARCHIVED]
 *     responses:
 *       200:
 *         description: List of all tasks
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/tasks', verifyAuth, requireRole('ADMIN'), listAllTasks);

export default router;
